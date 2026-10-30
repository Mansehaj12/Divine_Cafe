/**
 * Divine Cafe - Realtime Order Service
 * Handles live KOT slips, multi-device synchronization, audio bells, and status tracking.
 */
import { cafeConfig } from '../data/cafeConfig';

const LOCAL_STORAGE_KEY = 'divine_cafe_orders_v1';
const CHANNEL_NAME = 'divine_orders_channel';

// Browser-safe broadcast channel
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(CHANNEL_NAME)
  : null;

/**
 * Play a realistic two-tone brass service bell using Web Audio API
 * No external MP3 file needed — 100% reliable across all browsers & devices
 */
export function playOrderBell() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // First tone (High Ding - 880Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.6, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.8);

    // Second tone (Harmonic chime - 1320Hz / E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (err) {
    console.warn("Could not play order bell:", err);
  }
}

/**
 * Fetch all orders currently saved locally
 */
export function getLocalOrders() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Failed to read local orders:", err);
    return [];
  }
}

/**
 * Save orders to localStorage and broadcast to other open tabs
 */
function saveOrdersLocally(orders) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    if (channel) {
      channel.postMessage({ type: 'ORDERS_UPDATED', orders });
    }
  } catch (err) {
    console.error("Failed to save local orders:", err);
  }
}

/**
 * Create a new order (from customer checkout)
 */
export async function createOrder(orderData) {
  const timestamp = Date.now();
  const dateObj = new Date(timestamp);
  
  // Format readable time e.g. "01:45 PM"
  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const orderId = `DC-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: orderId,
    timestamp,
    formattedTime,
    formattedDate,
    status: 'pending', // 'pending' -> 'preparing' -> 'served' -> 'cancelled'
    diningMode: orderData.diningMode || 'dine-in',
    tableNumber: orderData.tableNumber || '',
    items: orderData.items || [],
    totalCount: orderData.totalCount || 0,
    totalAmount: orderData.totalAmount || 0,
    notes: orderData.notes || '',
    source: 'Website QR / Online'
  };

  // 1. Save locally
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveOrdersLocally(updatedOrders);

  // 2. Sync to Firebase Cloud DB if configured
  const cloudUrl = cafeConfig.kitchen?.firebaseDbUrl;
  if (cloudUrl && cloudUrl.startsWith('http')) {
    try {
      const endpoint = cloudUrl.replace(/\/$/, '') + `/orders/${newOrder.id}.json`;
      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (cloudErr) {
      console.warn("Could not sync order to cloud DB:", cloudErr);
    }
  }

  return newOrder;
}

/**
 * Update an order's status ('pending' | 'preparing' | 'served' | 'cancelled')
 */
export async function updateOrderStatus(orderId, newStatus) {
  const orders = getLocalOrders();
  const updated = orders.map(ord => {
    if (ord.id === orderId) {
      return { ...ord, status: newStatus, updatedTime: Date.now() };
    }
    return ord;
  });

  saveOrdersLocally(updated);

  // Sync to Cloud DB
  const cloudUrl = cafeConfig.kitchen?.firebaseDbUrl;
  if (cloudUrl && cloudUrl.startsWith('http')) {
    try {
      const endpoint = cloudUrl.replace(/\/$/, '') + `/orders/${orderId}/status.json`;
      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus)
      });
    } catch (err) {
      console.warn("Could not update cloud order status:", err);
    }
  }

  return updated;
}

/**
 * Clear all completed (served/cancelled) orders
 */
export function clearCompletedOrders() {
  const orders = getLocalOrders();
  const remaining = orders.filter(o => o.status !== 'served' && o.status !== 'cancelled');
  saveOrdersLocally(remaining);
  return remaining;
}

/**
 * Fetch orders from cloud DB if configured
 */
export async function syncFromCloud() {
  const cloudUrl = cafeConfig.kitchen?.firebaseDbUrl;
  if (!cloudUrl || !cloudUrl.startsWith('http')) return null;

  try {
    const endpoint = cloudUrl.replace(/\/$/, '') + '/orders.json';
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return [];

    const cloudOrders = Object.values(data).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    saveOrdersLocally(cloudOrders);
    return cloudOrders;
  } catch (err) {
    console.warn("Failed to sync from cloud:", err);
    return null;
  }
}

/**
 * Subscribe to realtime updates across browser tabs and storage
 */
export function subscribeToOrders(callback) {
  const handleStorage = (e) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      callback(getLocalOrders());
    }
  };

  const handleChannel = (e) => {
    if (e.data && e.data.type === 'ORDERS_UPDATED') {
      callback(e.data.orders);
    }
  };

  window.addEventListener('storage', handleStorage);
  if (channel) {
    channel.addEventListener('message', handleChannel);
  }

  return () => {
    window.removeEventListener('storage', handleStorage);
    if (channel) {
      channel.removeEventListener('message', handleChannel);
    }
  };
}
