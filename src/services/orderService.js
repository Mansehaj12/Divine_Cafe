/**
 * Divine Cafe - Realtime Order Service
 * Handles live KOT slips, multi-device synchronization across phones/PCs, audio bells, and status tracking.
 */
import { cafeConfig } from '../data/cafeConfig';

const LOCAL_STORAGE_KEY = 'divine_cafe_orders_v1';
const CHANNEL_NAME = 'divine_orders_channel';

// Unique global cloud topic for Divine Cafe Patiala (allows real-time cross-device sync on mobile 4G/5G/Wi-Fi)
const CLOUD_TOPIC = 'divine_cafe_patiala_kot_live_v1';
const CLOUD_ENDPOINT = `https://ntfy.sh/${CLOUD_TOPIC}`;

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
 * Create a new order (from customer checkout on phone or PC)
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

  // 1. Save locally and dispatch immediately
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders.filter(o => o.id !== newOrder.id)];
  saveOrdersLocally(updatedOrders);

  // 2. Publish to Live Cloud Relay (Instant cross-device delivery over 4G/5G/Wi-Fi)
  try {
    fetch(CLOUD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Title': `New Order #${newOrder.id} (${newOrder.diningMode === 'takeaway' ? 'Takeaway' : `Table #${newOrder.tableNumber}`})`,
        'Tags': 'bell,plate',
        'Priority': 'urgent'
      },
      body: JSON.stringify(newOrder)
    }).catch(() => {});
  } catch {}

  // 3. Sync to local dev server API if available
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});
  } catch {}

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

  // Broadcast status update to Cloud Relay
  try {
    fetch(CLOUD_ENDPOINT, {
      method: 'POST',
      headers: { 'Title': `Status: Order #${orderId} -> ${newStatus}` },
      body: JSON.stringify({ type: 'STATUS_UPDATE', id: orderId, status: newStatus, timestamp: Date.now() })
    }).catch(() => {});
  } catch {}

  // Sync to local server API
  try {
    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus })
    }).catch(() => {});
  } catch {}

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
 * Fetch and reconstruct all orders from Cloud Relay and local storage
 */
export async function syncFromCloud() {
  const localOrders = getLocalOrders();
  const ordersMap = new Map();
  localOrders.forEach(o => ordersMap.set(o.id, o));

  // 1. Fetch from Cloud Relay (Last 12 hours history)
  try {
    const res = await fetch(`${CLOUD_ENDPOINT}/json?poll=1&since=12h`);
    if (res.ok) {
      const text = await res.text();
      text.trim().split('\n').forEach(line => {
        try {
          const msg = JSON.parse(line);
          if (msg.event === 'message') {
            const data = JSON.parse(msg.message);
            if (data.type === 'STATUS_UPDATE' && data.id) {
              if (ordersMap.has(data.id)) {
                ordersMap.get(data.id).status = data.status;
              }
            } else if (data.id && data.items) {
              // Only overwrite if existing doesn't have a newer status
              const existing = ordersMap.get(data.id);
              if (existing) {
                ordersMap.set(data.id, { ...data, status: existing.status || data.status });
              } else {
                ordersMap.set(data.id, data);
              }
            }
          }
        } catch {}
      });
    }
  } catch (err) {
    console.warn("Could not poll cloud relay:", err);
  }

  // 2. Also check local server /api/orders if running
  try {
    const localApiRes = await fetch('/api/orders');
    if (localApiRes.ok) {
      const serverOrders = await localApiRes.json();
      if (Array.isArray(serverOrders)) {
        serverOrders.forEach(o => {
          if (!ordersMap.has(o.id)) ordersMap.set(o.id, o);
        });
      }
    }
  } catch {}

  const merged = Array.from(ordersMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  saveOrdersLocally(merged);
  return merged;
}

/**
 * Subscribe to realtime updates across mobile phones, tabs, and computers via SSE
 */
export function subscribeToOrders(callback) {
  let eventSource = null;

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

  // 4. Live Server-Sent Events (SSE) from Cloud Relay (instant mobile to computer)
  try {
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      eventSource = new EventSource(`${CLOUD_ENDPOINT}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.event === 'message') {
            const data = JSON.parse(msg.message);
            const current = getLocalOrders();
            let updated = [...current];

            if (data.type === 'STATUS_UPDATE') {
              updated = current.map(o => o.id === data.id ? { ...o, status: data.status } : o);
            } else if (data.id && data.items) {
              if (!current.some(o => o.id === data.id)) {
                updated = [data, ...current];
              }
            }

            saveOrdersLocally(updated);
            callback(updated);
          }
        } catch (e) {
          console.warn("Error processing live SSE event:", e);
        }
      };
    }
  } catch (err) {
    console.warn("Could not connect live SSE stream:", err);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('divine_orders_changed', handleCustom);
      window.removeEventListener('storage', handleStorage);
    }
    if (channel) {
      channel.removeEventListener('message', handleChannel);
    }
    if (eventSource) {
      eventSource.close();
    }
  };
}
