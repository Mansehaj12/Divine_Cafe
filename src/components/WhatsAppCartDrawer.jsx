import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowRight, CheckCircle2, Clock, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cafeConfig } from '../data/cafeConfig';
import { createOrder } from '../services/orderService';

export default function WhatsAppCartDrawer() {
  const {
    cart,
    totalCount,
    totalAmount,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    tableNumber,
    diningMode,
    updateDiningMode,
    getWhatsAppMessage
  } = useCart();

  const [notes, setNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isWhatsappConfigured = cafeConfig.isWhatsappProvided;

  // Whenever items are added to cart, clear any previous receipt so the customer sees their new items!
  useEffect(() => {
    if (cart.length > 0 && placedOrder) {
      setPlacedOrder(null);
    }
  }, [cart, placedOrder]);

  // Prevent background menu scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDrawerOpen]);

  const handleSendOrder = async () => {
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Create order in Live Kitchen Slip store
      const order = await createOrder({
        diningMode,
        tableNumber: diningMode === 'dine-in' ? tableNumber : '',
        items: cart,
        totalCount,
        totalAmount,
        notes
      });

      // 2. Set placed order to show success screen inside drawer
      setPlacedOrder(order);

      // 3. Clear cart after successful placement
      clearCart();
    } catch (err) {
      console.error("Order creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky Bottom Pill on Mobile if cart has items and drawer is closed */}
      {totalCount > 0 && !isDrawerOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full bg-[#143826] text-cream-100 p-3.5 rounded-2xl shadow-2xl border border-forest-600 flex items-center justify-between animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-olive-300">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-olive-500 text-[10px] text-white font-bold flex items-center justify-center">
                  {totalCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">Order Enquiry Bag</p>
                <p className="text-[10px] text-olive-300">{totalCount} item{totalCount > 1 ? 's' : ''} added</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-bold text-white">₹{totalAmount}</span>
              <div className="w-6 h-6 rounded-full bg-cream-100 text-forest-950 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden overscroll-none">
          <div
            className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full overscroll-contain">
              
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 bg-[#143826] text-cream-100 flex items-center justify-between border-b border-forest-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-olive-300">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {placedOrder && cart.length === 0 ? 'Order Confirmation' : 'Order Enquiry Bag'}
                    </h3>
                    <p className="text-[11px] text-olive-200">
                      {placedOrder && cart.length === 0 
                        ? `Order #${placedOrder.id} Placed` 
                        : `${totalCount} item${totalCount !== 1 ? 's' : ''} selected`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-forest-800 text-cream-200 hover:text-white hover:bg-forest-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List / Placed Order View */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">
                {placedOrder && cart.length === 0 ? (
                  /* Order Success Screen */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Order Received!
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-forest-950 mt-2">
                        Slip Sent to Kitchen
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Our chefs at Divine Café have received your order.
                      </p>
                    </div>

                    <div className="p-4 bg-cream-100/80 rounded-2xl border border-cream-200 text-left space-y-2.5">
                      <div className="flex items-center justify-between border-b border-cream-200/80 pb-2">
                        <span className="text-xs text-gray-500">Order ID:</span>
                        <span className="font-mono font-bold text-forest-900 text-sm">#{placedOrder.id}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-cream-200/80 pb-2">
                        <span className="text-xs text-gray-500">Service:</span>
                        <span className="font-semibold text-forest-950 text-xs">
                          {placedOrder.diningMode === 'takeaway' ? '🛍️ Takeaway' : `🍽️ Dine-In ${placedOrder.tableNumber ? `(Table #${placedOrder.tableNumber})` : ''}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-cream-200/80 pb-2">
                        <span className="text-xs text-gray-500">Items:</span>
                        <span className="text-xs font-medium text-forest-900">{placedOrder.totalCount} item{placedOrder.totalCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-xs font-bold text-forest-950">Total Amount:</span>
                        <span className="font-serif font-bold text-base text-forest-950">₹{placedOrder.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-olive-700 bg-olive-50 p-2.5 rounded-xl border border-olive-200">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Estimated Prep Time: 15–20 minutes</span>
                    </div>

                    <div className="pt-2 space-y-2">
                      {isWhatsappConfigured && cafeConfig.whatsappNumber && (
                        <button
                          onClick={() => {
                            const encodedMsg = getWhatsAppMessage(`Order: #${placedOrder.id}\n${notes}`);
                            window.open(`https://wa.me/${cafeConfig.whatsappNumber}?text=${encodedMsg}`, '_blank');
                          }}
                          className="w-full py-3 px-4 rounded-full bg-[#1b4931] hover:bg-[#143826] text-cream-100 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5 text-olive-300" />
                          <span>View / Message via WhatsApp</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setPlacedOrder(null);
                          setIsDrawerOpen(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-full bg-cream-200/70 hover:bg-cream-200 text-forest-950 font-semibold text-xs transition-all"
                      >
                        Order More Dishes / Return
                      </button>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-cream-100 text-forest-800 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="font-serif text-lg font-bold text-forest-950">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Add any delicious dishes, pizzas, or drinks from our menu to initiate your order.
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="mt-2 px-5 py-2 rounded-full bg-forest-800 text-cream-100 text-xs font-semibold"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Dine-In / Takeaway Toggle inside Drawer */}
                    <div className="p-3 bg-cream-100/70 rounded-2xl border border-cream-200/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-forest-950">Order Type:</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-cream-200">
                          <button
                            type="button"
                            onClick={() => updateDiningMode('dine-in')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              diningMode === 'dine-in'
                                ? 'bg-forest-800 text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            🍽️ Dine-In
                          </button>
                          <button
                            type="button"
                            onClick={() => updateDiningMode('takeaway')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              diningMode === 'takeaway'
                                ? 'bg-forest-800 text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            🛍️ Takeaway
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Selected Items
                      </span>
                      <button
                        onClick={clearCart}
                        className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.cartKey}
                          className="flex items-center justify-between gap-3 p-3 bg-cream-50/70 rounded-xl border border-cream-200"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-semibold text-forest-950 truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.size && (
                                <span className="text-[10px] bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded font-medium">
                                  {item.size}
                                </span>
                              )}
                              <span className="text-xs font-serif font-bold text-forest-900">
                                ₹{item.price * item.quantity}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                (₹{item.price} each)
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-cream-300 p-1">
                            <button
                              onClick={() => updateQuantity(item.cartKey, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream-100 text-forest-900"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-forest-950 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartKey, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream-100 text-forest-900"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer Notes */}
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Special Instructions / Preparation Notes:
                      </label>
                      <textarea
                        rows="2"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Less spicy, packing required, etc."
                        className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-1 focus:ring-forest-600 text-forest-950"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {!placedOrder && cart.length > 0 && (
                <div className="p-4 sm:p-6 bg-cream-50 border-t border-cream-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Estimated Total</p>
                      <p className="text-[10px] text-gray-400">(Taxes & packaging if applicable)</p>
                    </div>
                    <div className="font-serif text-2xl font-bold text-forest-950">
                      ₹{totalAmount}
                    </div>
                  </div>

                  <button
                    onClick={handleSendOrder}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#143826] hover:bg-[#0f2b1d] disabled:opacity-50 text-cream-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <Send className="w-4 h-4 text-olive-300" />
                    <span>{isSubmitting ? 'Placing Order...' : 'Place Order & Send Slip to Kitchen'}</span>
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    Sends your digital slip instantly to the billing desk & kitchen for immediate preparation.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
