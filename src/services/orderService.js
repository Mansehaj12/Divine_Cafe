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
 * Save orders to localStorage, BroadcastChannel, and dispatch custom event
 */
function saveOrdersLocally(orders) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    
    // Broadcast to other tabs
    if (channel) {
      channel.postMessage({ type: 'ORDERS_UPDATED', orders });
    }

    // Dispatch event in SAME window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('divine_orders_changed', { detail: orders }));
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
    status: 'pending',
    diningMode: orderData.diningMode || 'dine-in',
    tableNumber: orderData.tableNumber || '',
    items: orderData.items || [],
    totalCount: orderData.totalCount || 0,
    totalAmount: orderData.totalAmount || 0,
    notes: orderData.notes || '',
    source: 'Website QR / Online'
  };

  // 1. Save locally and dispatch
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders.filter(o => o.id !== newOrder.id)];
  saveOrdersLocally(updatedOrders);

  // 2. Sync to local server API (for multi-device / phone-to-PC sync)
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
  } catch {
    // Local server offline or in static preview, local storage remains intact
  }

  // 3. Sync to Firebase Cloud DB if configured
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

  // Sync to local server API
  try {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus })
    });
  } catch {}

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
 * Fetch orders from local server API or cloud DB
 */
export async function syncFromCloud() {
  // First try local server /api/orders
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const serverOrders = await res.json();
      if (Array.isArray(serverOrders) && serverOrders.length > 0) {
        // Merge with local orders without duplicates
        const local = getLocalOrders();
        const map = new Map();
        [...serverOrders, ...local].forEach(o => map.set(o.id, o));
        const merged = Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        saveOrdersLocally(merged);
        return merged;
      }
    }
  } catch {}

  // Then try Firebase Cloud DB if configured
  const cloudUrl = cafeConfig.kitchen?.firebaseDbUrl;
  if (cloudUrl && cloudUrl.startsWith('http')) {
    try {
      const endpoint = cloudUrl.replace(/\/$/, '') + '/orders.json';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const cloudOrders = Object.values(data).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          saveOrdersLocally(cloudOrders);
          return cloudOrders;
        }
      }
    } catch (err) {
      console.warn("Failed to sync from cloud:", err);
    }
  }

  return getLocalOrders();
}

/**
 * Subscribe to realtime updates across browser tabs, storage, and server
 */
export function subscribeToOrders(callback) {
  // 1. Same-window custom event
  const handleCustom = (e) => {
    callback(e.detail || getLocalOrders());
  };

  // 2. Cross-window storage event
  const handleStorage = (e) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      callback(getLocalOrders());
    }
  };

  // 3. Cross-window BroadcastChannel
  const handleChannel = (e) => {
    if (e.data && e.data.type === 'ORDERS_UPDATED') {
      callback(e.data.orders);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('divine_orders_changed', handleCustom);
    window.addEventListener('storage', handleStorage);
  }

  if (channel) {
    channel.addEventListener('message', handleChannel);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('divine_orders_changed', handleCustom);
      window.removeEventListener('storage', handleStorage);
    }
    if (channel) {
      channel.removeEventListener('message', handleChannel);
    }
  };
}
