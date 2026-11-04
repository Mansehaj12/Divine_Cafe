import React, { useState, useEffect, useCallback } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, Clock, ChefHat, PartyPopper, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cafeConfig } from '../data/cafeConfig';

// Estimate prep time based on item count & types
function getEstimatedTime(items) {
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  if (count <= 2) return { min: 5, max: 10 };
  if (count <= 5) return { min: 10, max: 18 };
  if (count <= 8) return { min: 15, max: 25 };
  return { min: 20, max: 35 };
}

// Stepper stages for the order tracker
const ORDER_STEPS = [
  { id: 'sent', label: 'Order Sent', icon: CheckCircle2, description: 'Your order has been sent via WhatsApp' },
  { id: 'received', label: 'Being Reviewed', icon: Clock, description: 'Cafe is reviewing your order' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Your food is being freshly prepared' },
  { id: 'ready', label: 'Ready!', icon: PartyPopper, description: 'Your order should be ready now' },
];

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
  const [sentOrder, setSentOrder] = useState(null); // { items, totalAmount, totalCount, diningMode, tableNumber, sentAt, estimatedTime }
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Whenever new items are added to cart, clear confirmation so user sees their fresh cart
  useEffect(() => {
    if (cart.length > 0 && sentOrder) {
      setSentOrder(null);
      setCurrentStep(0);
      setElapsedSeconds(0);
    }
  }, [cart, sentOrder]);

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

  // Timer: count elapsed seconds and auto-advance steps after order is sent
  useEffect(() => {
    if (!sentOrder) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sentOrder]);

  // Auto-advance tracker steps based on elapsed time
  useEffect(() => {
    if (!sentOrder) return;

    const estMinSeconds = sentOrder.estimatedTime.min * 60;
    const estMaxSeconds = sentOrder.estimatedTime.max * 60;

    // Step 0 → 1: After 8 seconds (simulate "received/reviewing")
    if (elapsedSeconds >= 8 && currentStep < 1) {
      setCurrentStep(1);
    }
    // Step 1 → 2: After 30% of min estimated time (preparing)
    if (elapsedSeconds >= estMinSeconds * 0.3 && currentStep < 2) {
      setCurrentStep(2);
    }
    // Step 2 → 3: After min estimated time (ready!)
    if (elapsedSeconds >= estMinSeconds && currentStep < 3) {
      setCurrentStep(3);
    }
  }, [elapsedSeconds, sentOrder, currentStep]);

  const handleSendOrder = () => {
    if (cart.length === 0) return;

    // Capture order details before clearing
    const orderSnapshot = {
      items: [...cart],
      totalAmount,
      totalCount,
      diningMode,
      tableNumber,
      sentAt: new Date(),
      estimatedTime: getEstimatedTime(cart),
    };

    // Open WhatsApp with pre-formatted message
    const message = getWhatsAppMessage(notes);
    const whatsappUrl = `https://wa.me/${cafeConfig.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Show confirmation tracker
    setSentOrder(orderSnapshot);
    setCurrentStep(0);
    setElapsedSeconds(0);
    setNotes('');
    clearCart();
  };

  const handleNewOrder = () => {
    setSentOrder(null);
    setCurrentStep(0);
    setElapsedSeconds(0);
    setIsDrawerOpen(false);
  };

  // Format elapsed time as mm:ss
  const formatElapsed = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Progress bar percentage (0-100)
  const getProgress = () => {
    if (!sentOrder) return 0;
    const maxSec = sentOrder.estimatedTime.max * 60;
    return Math.min(100, Math.round((elapsedSeconds / maxSec) * 100));
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
                <p className="text-xs font-bold leading-tight">Order Bag</p>
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
                    {sentOrder ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {sentOrder ? 'Order Tracker' : 'Order Bag'}
                    </h3>
                    <p className="text-[11px] text-olive-200">
                      {sentOrder
                        ? `Sent at ${sentOrder.sentAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
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

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4">

                {/* ===== ORDER SENT CONFIRMATION & TRACKER ===== */}
                {sentOrder && cart.length === 0 ? (
                  <div className="space-y-5">
                    {/* Success Header */}
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 3 }}>
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          Order Sent ✓
                        </span>
                        <h3 className="font-serif text-xl font-bold text-forest-950 mt-2">
                          Message Sent to Divine Cafe!
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Please complete sending the message on WhatsApp if prompted.
                        </p>
                      </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="p-4 bg-cream-100/80 rounded-2xl border border-cream-200 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-cream-200/80 pb-2">
                        <span className="text-xs text-gray-500">Service:</span>
                        <span className="font-semibold text-forest-950 text-xs">
                          {sentOrder.diningMode === 'takeaway' ? '🛍️ Takeaway' : `🍽️ Dine-In ${sentOrder.tableNumber ? `(Table #${sentOrder.tableNumber})` : ''}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-cream-200/80 pb-2">
                        <span className="text-xs text-gray-500">Items:</span>
                        <span className="text-xs font-medium text-forest-900">{sentOrder.totalCount} item{sentOrder.totalCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-xs font-bold text-forest-950">Total Amount:</span>
                        <span className="font-serif font-bold text-base text-forest-950">₹{sentOrder.totalAmount}</span>
                      </div>
                    </div>

                    {/* Items List (Collapsed) */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Items Ordered</p>
                      {sentOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs px-3 py-2 bg-cream-50 rounded-lg border border-cream-200/60">
                          <span className="text-forest-900 font-medium truncate">
                            {item.quantity}× {item.name} {item.size ? `(${item.size})` : ''}
                          </span>
                          <span className="font-serif font-bold text-forest-950 shrink-0 ml-2">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* ===== LIVE ORDER TRACKER ===== */}
                    <div className="p-4 bg-forest-50/50 rounded-2xl border border-forest-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider">Order Progress</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-forest-700 font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-forest-200">
                          <Clock className="w-3 h-3" />
                          <span>{formatElapsed(elapsedSeconds)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${getProgress()}%`,
                            background: currentStep >= 3
                              ? 'linear-gradient(90deg, #10b981, #059669)'
                              : 'linear-gradient(90deg, #25D366, #128C7E)',
                          }}
                        />
                      </div>

                      {/* Estimated Time */}
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Estimated Prep Time</p>
                        <p className="text-sm font-bold text-forest-950 font-serif">
                          {sentOrder.estimatedTime.min} – {sentOrder.estimatedTime.max} minutes
                        </p>
                      </div>

                      {/* Step Tracker */}
                      <div className="space-y-0">
                        {ORDER_STEPS.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isActive = idx === currentStep;
                          const isDone = idx < currentStep;
                          const isPending = idx > currentStep;

                          return (
                            <div key={step.id} className="flex items-start gap-3">
                              {/* Vertical Line + Circle */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                                    isDone
                                      ? 'bg-emerald-500 text-white shadow-sm'
                                      : isActive
                                        ? 'bg-[#25D366] text-white shadow-md ring-4 ring-[#25D366]/20'
                                        : 'bg-cream-200 text-gray-400'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <StepIcon className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                {idx < ORDER_STEPS.length - 1 && (
                                  <div
                                    className={`w-0.5 h-8 transition-all duration-500 ${
                                      isDone ? 'bg-emerald-400' : 'bg-cream-200'
                                    }`}
                                  />
                                )}
                              </div>

                              {/* Step Text */}
                              <div className={`pt-1 pb-3 ${isPending ? 'opacity-40' : ''}`}>
                                <p className={`text-xs font-bold ${isActive ? 'text-forest-950' : isDone ? 'text-emerald-700' : 'text-gray-500'}`}>
                                  {step.label}
                                  {isActive && (
                                    <span className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                                  )}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{step.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Place New Order Button */}
                    <button
                      onClick={handleNewOrder}
                      className="w-full py-3 px-6 rounded-full bg-forest-800 hover:bg-forest-700 text-cream-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Place Another Order</span>
                    </button>
                  </div>

                ) : cart.length === 0 ? (
                  /* ===== EMPTY CART ===== */
                  <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-cream-100 text-forest-800 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="font-serif text-lg font-bold text-forest-950">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Add any delicious dishes, pizzas, or drinks from our menu to place your order.
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="mt-2 px-5 py-2 rounded-full bg-forest-800 text-cream-100 text-xs font-semibold"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  /* ===== CART ITEMS ===== */
                  <>
                    {/* Dine-In / Takeaway Toggle */}
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

              {/* Drawer Footer — WhatsApp Send Button */}
              {!sentOrder && cart.length > 0 && (
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
                    className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Send Order on WhatsApp (₹{totalAmount})</span>
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    Opens WhatsApp with your complete order details sent directly to Divine Cafe.
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
