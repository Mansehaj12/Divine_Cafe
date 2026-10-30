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

  useEffect(() => {
    try {
      localStorage.setItem('divine_cafe_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

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

  const getWhatsAppMessage = (customerNotes = '') => {
    let msg = `*New Order Enquiry - Divine Cafe*\n`;
    msg += `_“You Are What You Eat”_\n\n`;
    msg += `*Order Items:*\n`;
    cart.forEach((item, index) => {
      const sizeStr = item.size ? ` (${item.size})` : '';
      msg += `${index + 1}. *${item.name}${sizeStr}* × ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    msg += `\n*Total Amount:* ₹${totalAmount}\n`;
    if (customerNotes && customerNotes.trim()) {
      msg += `*Note:* ${customerNotes.trim()}\n`;
    }
    msg += `\nPlease confirm if this order can be prepared. Thank you!`;
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
