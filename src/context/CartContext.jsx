import React, { createContext, useContext, useState, useEffect } from 'react';
import { cafeConfig } from '../data/cafeConfig';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'divine_cafe_cart';
const HISTORY_STORAGE_KEY = 'divine_cafe_order_history';
const TABLE_STORAGE_KEY = 'divine_cafe_table';
const MODE_STORAGE_KEY = 'divine_cafe_dining_mode';
const NAME_STORAGE_KEY = 'divine_cafe_customer_name';

export function CartProvider({ children }) {
  // Customer Name State (saved so repeat customers don't have to re-enter it)
  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem(NAME_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const updateCustomerName = (val) => {
    setCustomerName(val);
    try {
      if (val && val.trim()) {
        localStorage.setItem(NAME_STORAGE_KEY, val.trim());
      } else {
        localStorage.removeItem(NAME_STORAGE_KEY);
      }
    } catch {}
  };
  // Active Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Past Orders History State (saved permanently on customer phone / browser)
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('cart'); // 'cart' | 'history'

  // View routing: 'home' | 'menu'
  const [currentView, setCurrentView] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.location.hash === '#menu') {
        return 'menu';
      }
      return 'home';
    } catch {
      return 'home';
    }
  });

  const navigateTo = (view) => {
    setCurrentView(view);
    try {
      if (view === 'menu') {
        window.location.hash = 'menu';
      } else {
        if (window.location.hash === '#menu') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHash = () => {
      try {
        if (window.location.hash === '#menu') {
          setCurrentView('menu');
        } else {
          setCurrentView('home');
        }
      } catch {}
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  // Table & Dining Mode State
  const [tableNumber, setTableNumber] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        const parsed = parseInt(urlTable, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 99) {
          localStorage.setItem(TABLE_STORAGE_KEY, String(parsed));
          return String(parsed);
        }
      }
      return localStorage.getItem(TABLE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [diningMode, setDiningMode] = useState(() => {
    try {
      const saved = localStorage.getItem(MODE_STORAGE_KEY);
      if (saved === 'takeaway') return 'takeaway';
      return 'dine-in';
    } catch {
      return 'dine-in';
    }
  });

  // Watch URL changes so changing ?table=7 in browser address bar immediately updates state
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        const parsed = parseInt(urlTable, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 99) {
          setTableNumber(String(parsed));
          setDiningMode('dine-in');
          localStorage.setItem(TABLE_STORAGE_KEY, String(parsed));
          localStorage.setItem(MODE_STORAGE_KEY, 'dine-in');
        }
      }
    } catch {}
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

  // Persist order history
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
    } catch (e) {
      console.warn("Could not save order history to localStorage", e);
    }
  }, [orderHistory]);

  // Safe table update with validation
  const updateTableNumber = (numStr) => {
    if (!numStr || numStr.trim() === '') {
      setTableNumber('');
      try {
        localStorage.removeItem(TABLE_STORAGE_KEY);
      } catch {}
      return;
    }
    const clean = numStr.replace(/[^0-9]/g, '').slice(0, 3);
    const parsed = parseInt(clean, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 99) {
      const val = String(parsed);
      setTableNumber(val);
      setDiningMode('dine-in');
      try {
        localStorage.setItem(TABLE_STORAGE_KEY, val);
        localStorage.setItem(MODE_STORAGE_KEY, 'dine-in');
      } catch {}
    }
  };

  const updateDiningMode = (mode) => {
    if (mode === 'takeaway' || mode === 'dine-in') {
      setDiningMode(mode);
      try {
        localStorage.setItem(MODE_STORAGE_KEY, mode);
      } catch {}
    }
  };

  const addToCart = (item, selectedSize = null) => {
    const itemSize = selectedSize || (item.sizes ? item.sizes[0].label : null);
    const itemPrice = selectedSize 
      ? item.sizes.find(s => s.label === selectedSize)?.price || item.price
      : (item.sizes ? item.sizes[0].price : item.price);

    const cartKey = `${item.id}-${itemSize || 'standard'}`;

    setCart(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i => i.cartKey === cartKey ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        cartKey,
        id: item.id,
        name: item.name,
        size: itemSize,
        price: itemPrice,
        image: item.image,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (cartKey, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartKey === cartKey) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Save completed order to customer's on-device history
  const saveOrderToHistory = (orderData) => {
    const newEntry = {
      id: `DC-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString(),
      items: orderData.items || [],
      totalCount: orderData.totalCount || 0,
      totalAmount: orderData.totalAmount || 0,
      diningMode: orderData.diningMode || 'dine-in',
      tableNumber: orderData.tableNumber || '',
      notes: orderData.notes || ''
    };

    setOrderHistory(prev => {
      // Keep last 30 orders
      const updated = [newEntry, ...prev.filter(o => o.id !== newEntry.id)].slice(0, 30);
      return updated;
    });

    return newEntry;
  };

  // 1-Click Reorder: loads previous order items into active cart
  const reorderPastOrder = (pastOrder) => {
    if (!pastOrder || !pastOrder.items || pastOrder.items.length === 0) return;

    // Load past items into cart
    setCart(pastOrder.items.map(item => ({
      cartKey: item.cartKey || `${item.id}-${item.size || 'standard'}`,
      id: item.id,
      name: item.name,
      size: item.size || null,
      price: item.price,
      image: item.image || null,
      quantity: item.quantity || 1
    })));

    // Restore dining mode if available
    if (pastOrder.diningMode) {
      updateDiningMode(pastOrder.diningMode);
    }
    if (pastOrder.tableNumber && pastOrder.diningMode === 'dine-in') {
      updateTableNumber(pastOrder.tableNumber);
    }

    // Switch tab to 'cart' so customer can review & send
    setDrawerTab('cart');
    setIsDrawerOpen(true);
  };

  // Delete single order from history
  const deleteOrderFromHistory = (orderId) => {
    setOrderHistory(prev => prev.filter(o => o.id !== orderId));
  };

  // Clear all past orders
  const clearOrderHistory = () => {
    setOrderHistory([]);
  };

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Sanitized message generator for WhatsApp
  const getWhatsAppMessage = (customerNotes = '', nameOverride = null) => {
    const isDineIn = diningMode === 'dine-in';
    const hasTable = isDineIn && Boolean(tableNumber && tableNumber.trim());
    const finalName = (nameOverride !== null ? nameOverride : customerName).trim();

    let msg = isDineIn
      ? `*🍽️ DINE-IN ORDER - DIVINE CAFE*\n`
      : `*🛍️ TAKEAWAY ORDER - DIVINE CAFE*\n`;
    
    if (finalName) {
      msg += `👤 *Customer Name:* ${finalName}\n`;
    }

    if (hasTable) {
      msg += `📍 *Table Number:* #${tableNumber.trim()}\n`;
    } else if (isDineIn) {
      msg += `📍 *Service:* Dine-In\n`;
    } else {
      msg += `📍 *Service:* Takeaway / Counter Pickup\n`;
    }

    msg += `_“You Are What You Eat”_\n\n`;
    msg += `*Order Items:*\n`;
    
    cart.forEach((item, index) => {
      const sizeStr = item.size ? ` (${item.size})` : '';
      msg += `${index + 1}. *${item.name}${sizeStr}* × ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    msg += `\n*Total Amount:* ₹${totalAmount}\n`;
    
    if (customerNotes && customerNotes.trim()) {
      const sanitized = customerNotes.trim().replace(/[\r\n]{3,}/g, '\n\n').slice(0, 300);
      msg += `*Special Instructions:* ${sanitized}\n`;
    }
    
    msg += `\nPlease confirm and prepare our order. Thank you!`;
    return encodeURIComponent(msg);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalCount,
      totalAmount,
      isDrawerOpen,
      setIsDrawerOpen,
      drawerTab,
      setDrawerTab,
      currentView,
      setCurrentView,
      navigateTo,
      tableNumber,
      updateTableNumber,
      diningMode,
      updateDiningMode,
      customerName,
      updateCustomerName,
      getWhatsAppMessage,
      orderHistory,
      saveOrderToHistory,
      reorderPastOrder,
      deleteOrderFromHistory,
      clearOrderHistory
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
