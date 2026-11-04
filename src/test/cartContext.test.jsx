import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

// Helper wrapper
const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext - Cart Math & State Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('starts with an empty cart and zero totals', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('adds a single-price standard item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = {
      id: 'masala-chai',
      name: 'Organic Masala Chai',
      price: 50,
      image: '/dishes/chai.svg'
    };

    act(() => {
      result.current.addToCart(item);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].id).toBe('masala-chai');
    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.cart[0].price).toBe(50);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalAmount).toBe(50);
  });

  it('correctly handles multi-size items with dynamic pricing', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const pizza = {
      id: 'farm-fresh-pizza',
      name: 'Farm Fresh Pizza',
      sizes: [
        { label: 'Small (7")', price: 170 },
        { label: 'Medium (9")', price: 260 }
      ]
    };

    // Add Small
    act(() => {
      result.current.addToCart(pizza, 'Small (7")');
    });

    // Add Medium
    act(() => {
      result.current.addToCart(pizza, 'Medium (9")');
    });

    expect(result.current.cart.length).toBe(2);
    expect(result.current.cart[0].size).toBe('Small (7")');
    expect(result.current.cart[0].price).toBe(170);
    expect(result.current.cart[1].size).toBe('Medium (9")');
    expect(result.current.cart[1].price).toBe(260);

    // Total = 170 + 260 = 430
    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalAmount).toBe(430);
  });

  it('increments quantity when adding the exact same item and size', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const pasta = {
      id: 'white-sauce-pasta',
      name: 'White Sauce Pasta',
      sizes: [
        { label: 'Half', price: 140 },
        { label: 'Full', price: 230 }
      ]
    };

    act(() => {
      result.current.addToCart(pasta, 'Full');
      result.current.addToCart(pasta, 'Full');
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalAmount).toBe(460); // 230 * 2
  });

  it('adjusts quantities with updateQuantity (+1, -1) and removes item at 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const burger = {
      id: 'royal-paneer-burger',
      name: 'Royal Paneer Burger',
      price: 130
    };

    act(() => {
      result.current.addToCart(burger);
    });

    const cartKey = result.current.cart[0].cartKey;

    // Increment
    act(() => {
      result.current.updateQuantity(cartKey, 1);
    });
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalAmount).toBe(260);

    // Decrement by 1
    act(() => {
      result.current.updateQuantity(cartKey, -1);
    });
    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.totalAmount).toBe(130);

    // Decrement by 1 again -> should remove from cart
    act(() => {
      result.current.updateQuantity(cartKey, -1);
    });
    expect(result.current.cart.length).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('removes item completely with removeFromCart and clears with clearCart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 'item1', name: 'Item 1', price: 100 });
      result.current.addToCart({ id: 'item2', name: 'Item 2', price: 200 });
    });

    expect(result.current.cart.length).toBe(2);
    expect(result.current.totalAmount).toBe(300);

    // Remove item 1
    act(() => {
      result.current.removeFromCart(result.current.cart[0].cartKey);
    });
    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].id).toBe('item2');
    expect(result.current.totalAmount).toBe(200);

    // Clear cart
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.cart.length).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('generates a well-formatted WhatsApp message for Dine-In orders with table numbers', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.updateDiningMode('dine-in');
      result.current.updateTableNumber('7');
      result.current.updateCustomerName('Aman');
      result.current.addToCart({
        id: 'cold-coffee',
        name: 'Cold Coffee',
        price: 110
      });
    });

    const encodedMsg = result.current.getWhatsAppMessage('Less sugar please');
    const decodedMsg = decodeURIComponent(encodedMsg);

    expect(decodedMsg).toContain('*🍽️ DINE-IN ORDER - DIVINE CAFE*');
    expect(decodedMsg).toContain('*Customer Name:* Aman');
    expect(decodedMsg).toContain('*Table Number:* #7');
    expect(decodedMsg).toContain('Cold Coffee* × 1 = ₹110');
    expect(decodedMsg).toContain('Total Amount:* ₹110');
    expect(decodedMsg).toContain('Special Instructions:* Less sugar please');
  });

  it('generates a well-formatted WhatsApp message for Takeaway orders', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.updateDiningMode('takeaway');
      result.current.addToCart({
        id: 'french-fries',
        name: 'French Fries',
        price: 90
      });
    });

    const encodedMsg = result.current.getWhatsAppMessage();
    const decodedMsg = decodeURIComponent(encodedMsg);

    expect(decodedMsg).toContain('*🛍️ TAKEAWAY ORDER - DIVINE CAFE*');
    expect(decodedMsg).toContain('Takeaway / Counter Pickup');
    expect(decodedMsg).toContain('French Fries* × 1 = ₹90');
    expect(decodedMsg).toContain('Total Amount:* ₹90');
  });
});
