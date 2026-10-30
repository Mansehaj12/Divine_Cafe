import React, { createContext, useContext, useState, useEffect } from 'react';
import { cafeConfig } from '../data/cafeConfig';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('divine_cafe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Table & Dining Mode State
  // Supports URL query param (?table=4) or localStorage persistence
  const [tableNumber, setTableNumber] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        // Sanitize: allow only positive integers 1-99
        const parsed = parseInt(urlTable, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 99) {
          localStorage.setItem('divine_cafe_table', String(parsed));
          return String(parsed);
        }
      }
      return localStorage.getItem('divine_cafe_table') || '';
    } catch {
      return '';
    }
  });

  // Dining Mode: 'dine-in' (if tableNumber is set) or 'takeaway'
  const [diningMode, setDiningMode] = useState(() => {
    try {
      const saved = localStorage.getItem('divine_cafe_dining_mode');
      if (saved === 'takeaway') return 'takeaway';
      return localStorage.getItem('divine_cafe_table') ? 'dine-in' : 'dine-in';
    } catch {
      return 'dine-in';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('divine_cafe_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

  // Safe table update with validation
  const updateTableNumber = (numStr) => {
    if (!numStr || numStr.trim() === '') {
      setTableNumber('');
      try {
        localStorage.removeItem('divine_cafe_table');
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
        localStorage.setItem('divine_cafe_table', val);
        localStorage.setItem('divine_cafe_dining_mode', 'dine-in');
      } catch {}
    }
  };

  const updateDiningMode = (mode) => {
    if (mode === 'takeaway' || mode === 'dine-in') {
      setDiningMode(mode);
      try {
        localStorage.setItem('divine_cafe_dining_mode', mode);
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

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Sanitized message generator for WhatsApp
  const getWhatsAppMessage = (customerNotes = '') => {
    const isDineIn = diningMode === 'dine-in';
    const hasTable = isDineIn && Boolean(tableNumber && tableNumber.trim());

    let msg = isDineIn
      ? `*🍽️ DINE-IN ORDER - DIVINE CAFE*\n`
      : `*🛍️ TAKEAWAY ORDER - DIVINE CAFE*\n`;
    
    if (hasTable) {
      msg += `📍 *Table Number:* #${tableNumber.trim()}\n`;
    } else if (isDineIn) {
      msg += `📍 *Service:* Dine-In (Table not specified)\n`;
    } else {
      msg += `📍 *Service:* Takeaway / Pickup\n`;
    }

    msg += `_“You Are What You Eat”_\n\n`;
    msg += `*Order Items:*\n`;
    
    cart.forEach((item, index) => {
      const sizeStr = item.size ? ` (${item.size})` : '';
      msg += `${index + 1}. *${item.name}${sizeStr}* × ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    msg += `\n*Total Amount:* ₹${totalAmount}\n`;
    
    if (customerNotes && customerNotes.trim()) {
      // Sanitize notes: strip dangerous characters or excessive whitespace
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
      tableNumber,
      updateTableNumber,
      diningMode,
      updateDiningMode,
      getWhatsAppMessage
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

