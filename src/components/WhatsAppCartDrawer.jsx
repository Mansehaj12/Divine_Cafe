import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, 
  Clock, ChefHat, PartyPopper, RotateCcw, History, Calendar, Utensils, BookOpen, ArrowLeft, PlusCircle, PenLine, ArrowLeftRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cafeConfig } from '../data/cafeConfig';
import { menuItems } from '../data/menuData';

// Estimate prep time based on item count & types
function getEstimatedTime(items) {
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  if (count <= 2) return { min: 5, max: 10 };
  if (count <= 5) return { min: 10, max: 18 };
  if (count <= 8) return { min: 15, max: 25 };
  return { min: 20, max: 35 };
}

// Stepper stages for the live order tracker
const ORDER_STEPS = [
  { id: 'sent', label: 'Order Sent', icon: CheckCircle2, description: 'Your order has been sent via WhatsApp' },
  { id: 'received', label: 'Being Reviewed', icon: Clock, description: 'Cafe is reviewing your order' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Your food is being freshly prepared' },
  { id: 'ready', label: 'Ready!', icon: PartyPopper, description: 'Your order should be ready now' },
];

// Helper to format past order date/time nicely
function formatOrderDate(dateString) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recently';

    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isToday) return `Today at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;
    return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${timeStr}`;
  } catch {
    return 'Past visit';
  }
}

export default function WhatsAppCartDrawer() {
  const {
    cart,
    addToCart,
    totalCount,
    totalAmount,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerTab,
    setDrawerTab,
    currentView,
    navigateTo,
    updateQuantity,
    removeFromCart,
    clearCart,
    tableNumber,
    diningMode,
    updateDiningMode,
    getWhatsAppMessage,
    orderHistory,
    saveOrderToHistory,
    reorderPastOrder,
    deleteOrderFromHistory,
    clearOrderHistory
  } = useCart();

  const [notes, setNotes] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [sentOrder, setSentOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [reorderNotification, setReorderNotification] = useState('');

  // Whenever new items are manually added to cart, clear live tracker
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

  // Timer: count elapsed seconds for live tracker
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

    if (elapsedSeconds >= 8 && currentStep < 1) {
      setCurrentStep(1);
    }
    if (elapsedSeconds >= estMinSeconds * 0.3 && currentStep < 2) {
      setCurrentStep(2);
    }
    if (elapsedSeconds >= estMinSeconds && currentStep < 3) {
      setCurrentStep(3);
    }
  }, [elapsedSeconds, sentOrder, currentStep]);

  const handleSendOrder = () => {
    if (cart.length === 0) return;

    // Snapshot order details
    const orderSnapshot = {
      items: [...cart],
      totalAmount,
      totalCount,
      diningMode,
      tableNumber: diningMode === 'dine-in' ? tableNumber : '',
      sentAt: new Date(),
      estimatedTime: getEstimatedTime(cart),
      notes
    };

    // Save to customer's permanent on-device order history
    saveOrderToHistory(orderSnapshot);

    // Open WhatsApp with pre-formatted message
    const message = getWhatsAppMessage(notes);
    const whatsappUrl = `https://wa.me/${cafeConfig.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Show live confirmation tracker
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
    setDrawerTab('cart');
    setIsDrawerOpen(false);
  };

  const handleReorderClick = (pastOrder) => {
    reorderPastOrder(pastOrder);
    setSentOrder(null);
    setReorderNotification(`Loaded ${pastOrder.totalCount} item${pastOrder.totalCount > 1 ? 's' : ''} from past order!`);
    setTimeout(() => setReorderNotification(''), 4000);
  };

  const formatElapsed = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!sentOrder) return 0;
    const maxSec = sentOrder.estimatedTime.max * 60;
    return Math.min(100, Math.round((elapsedSeconds / maxSec) * 100));
  };

  // Suggestions for "CRAVING MORE?" section (filter out items already in cart)
  const cravingMoreItems = menuItems
    .filter(item => !cart.some(ci => ci.id === item.id))
    .slice(0, 8);

  return (
    <>
      {/* Sticky Bottom Pill on Mobile if cart has items and drawer is closed */}
      {totalCount > 0 && !isDrawerOpen && (
        <div 
          className={`fixed left-3 right-3 z-30 md:hidden transition-all duration-300 ${
            currentView === 'menu' ? 'bottom-3 sm:bottom-4' : 'bottom-20'
          }`}
          style={{
            bottom: currentView === 'menu' 
              ? 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' 
              : undefined
          }}
        >
          <button
            onClick={() => {
              setDrawerTab('cart');
              setIsDrawerOpen(true);
            }}
            className="w-full bg-[#143826] text-cream-100 p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-forest-600 flex items-center justify-between animate-in slide-in-from-bottom duration-300 active:scale-[0.98]"
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

      {/* Full-Screen Cart & Orders Window (100% width on mobile, no empty side space) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden overscroll-none bg-forest-950/70 backdrop-blur-xs flex justify-center items-stretch sm:items-center sm:p-4">
          <div className="w-full h-full sm:h-[94vh] sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-150">
              
              {/* Drawer Top Bar */}
              <div className="bg-[#143826] text-cream-100 border-b border-forest-800">
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1.5 rounded-lg bg-forest-800 text-cream-200 hover:text-white hover:bg-forest-700 sm:hidden"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-olive-300">
                      {sentOrder ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : drawerTab === 'history' ? (
                        <History className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                        {sentOrder 
                          ? 'Order Tracker' 
                          : drawerTab === 'history' 
                            ? 'Your Previous Orders' 
                            : 'Order Bag'}
                      </h3>
                      <p className="text-[11px] text-olive-200">
                        {sentOrder
                          ? `Placed at ${sentOrder.sentAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
                          : drawerTab === 'history'
                            ? `${orderHistory.length} saved order${orderHistory.length !== 1 ? 's' : ''}`
                            : `${totalCount} item${totalCount !== 1 ? 's' : ''} in bag`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-forest-800 text-cream-200 hover:text-white hover:bg-forest-700"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sub-Tabs: Current Bag vs Past Orders + Compact Order Type Switcher */}
                {!sentOrder && (
                  <div className="px-3 sm:px-5 pb-3 flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setDrawerTab('cart')}
                      className={`flex-1 py-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        drawerTab === 'cart'
                          ? 'bg-olive-500 text-white shadow-sm'
                          : 'bg-forest-800/80 text-cream-200 hover:bg-forest-800 hover:text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Current Bag</span>
                      {totalCount > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-forest-950 text-[10px] font-bold text-olive-200">
                          {totalCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDrawerTab('history')}
                      className={`flex-1 py-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        drawerTab === 'history'
                          ? 'bg-olive-500 text-white shadow-sm'
                          : 'bg-forest-800/80 text-cream-200 hover:bg-forest-800 hover:text-white'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Past Orders</span>
                      {orderHistory.length > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-forest-950 text-[10px] font-bold text-olive-200">
                          {orderHistory.length}
                        </span>
                      )}
                    </button>

                    {/* Compact Order Type Swap Pill (next to Past Orders) */}
                    <button
                      type="button"
                      onClick={() => updateDiningMode(diningMode === 'dine-in' ? 'takeaway' : 'dine-in')}
                      className="py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-forest-800/90 hover:bg-forest-700 text-cream-100 border border-forest-600/70 transition-all shadow-2xs active:scale-95 shrink-0"
                      title="Tap to switch between Dine-In and Takeaway"
                    >
                      <span className="text-[11px] sm:text-xs">
                        {diningMode === 'dine-in' 
                          ? (tableNumber ? `🍽️ #${tableNumber}` : '🍽️ Dine-In') 
                          : '🛍️ Takeaway'}
                      </span>
                      <ArrowLeftRight className="w-3 h-3 text-olive-300" />
                    </button>
                  </div>
                )}
              </div>

              {/* Toast Notification when Reordered */}
              {reorderNotification && (
                <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-200 shadow-md">
                  <span>✓ {reorderNotification}</span>
                  <button onClick={() => setReorderNotification('')} className="text-white/80 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">

                {/* ============================================================ */}
                {/* 1. LIVE ORDER TRACKER (Displayed right after placing order) */}
                {/* ============================================================ */}
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
                          Saved in your <button type="button" onClick={() => { setSentOrder(null); setDrawerTab('history'); }} className="text-forest-800 underline font-semibold">Past Orders</button> on this device.
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

                    {/* Items List Preview */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Items in this order</p>
                      {sentOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs px-3 py-2 bg-cream-50 rounded-lg border border-cream-200/60">
                          <span className="text-forest-900 font-medium truncate">
                            {item.quantity}× {item.name} {item.size ? `(${item.size})` : ''}
                          </span>
                          <span className="font-serif font-bold text-forest-950 shrink-0 ml-2">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live Tracker Stages */}
                    <div className="p-4 bg-forest-50/50 rounded-2xl border border-forest-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider">Preparation Progress</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-forest-700 font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-forest-200">
                          <Clock className="w-3 h-3" />
                          <span>{formatElapsed(elapsedSeconds)}</span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
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

                      {/* Estimated Prep Window */}
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Estimated Prep Time</p>
                        <p className="text-sm font-bold text-forest-950 font-serif">
                          {sentOrder.estimatedTime.min} – {sentOrder.estimatedTime.max} minutes
                        </p>
                      </div>

                      {/* Step Progress Checklist */}
                      <div className="space-y-0">
                        {ORDER_STEPS.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isActive = idx === currentStep;
                          const isDone = idx < currentStep;
                          const isPending = idx > currentStep;

                          return (
                            <div key={step.id} className="flex items-start gap-3">
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

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSentOrder(null);
                          setDrawerTab('history');
                        }}
                        className="flex-1 py-3 px-4 rounded-xl border border-forest-300 text-forest-800 hover:bg-forest-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <History className="w-4 h-4" />
                        <span>Past Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNewOrder();
                          navigateTo('menu');
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Order More</span>
                      </button>
                    </div>
                  </div>

                ) : drawerTab === 'history' ? (
                  /* ============================================================ */
                  /* 2. PAST ORDERS VIEW (Saved directly on customer's phone)     */
                  /* ============================================================ */
                  <div className="space-y-4">
                    {orderHistory.length === 0 ? (
                      /* Empty State */
                      <div className="text-center py-16 space-y-3">
                        <div className="w-14 h-14 rounded-full bg-cream-100 text-forest-800 flex items-center justify-center mx-auto">
                          <History className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-serif text-lg font-bold text-forest-950">
                          No previous orders yet
                        </p>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                          Whenever you send an order on WhatsApp, it will be automatically remembered here so you can reorder your favourites in 1 tap!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              setIsDrawerOpen(false);
                              navigateTo('menu');
                            }}
                            className="px-5 py-2 rounded-full bg-forest-800 hover:bg-forest-900 text-cream-100 text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 active:scale-95 transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-olive-300" />
                            <span>Browse Menu</span>
                          </button>
                          <button
                            onClick={() => setDrawerTab('cart')}
                            className="px-5 py-2 rounded-full bg-cream-200 hover:bg-cream-300 text-forest-900 text-xs font-semibold shadow-sm"
                          >
                            View Current Bag
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Past Orders List */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-cream-200">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                            Saved on this device ({orderHistory.length})
                          </span>
                          <button
                            onClick={() => {
                              if (window.confirm("Clear all your previous order history from this phone?")) {
                                clearOrderHistory();
                              }
                            }}
                            className="text-[11px] text-red-600 hover:text-red-700 font-medium"
                          >
                            Clear All
                          </button>
                        </div>

                        {orderHistory.map((past) => (
                          <div
                            key={past.id}
                            className="p-4 bg-cream-50/80 rounded-2xl border border-cream-300 hover:border-forest-300 transition-all space-y-3 shadow-xs"
                          >
                            {/* Card Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-forest-700" />
                                <span className="text-xs font-bold text-forest-950">
                                  {formatOrderDate(past.createdAt)}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-forest-800 border border-cream-300">
                                {past.diningMode === 'takeaway' ? '🛍️ Takeaway' : `🍽️ Dine-In ${past.tableNumber ? `#${past.tableNumber}` : ''}`}
                              </span>
                            </div>

                            {/* Items Preview */}
                            <div className="space-y-1 bg-white/70 p-2.5 rounded-xl border border-cream-200/80">
                              {past.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-forest-900">
                                  <span className="truncate">
                                    <span className="font-semibold">{item.quantity}×</span> {item.name} {item.size ? `(${item.size})` : ''}
                                  </span>
                                  <span className="font-serif font-medium text-gray-600 text-[11px] shrink-0 ml-2">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Total and Reorder Button */}
                            <div className="flex items-center justify-between pt-1 border-t border-cream-200/60">
                              <div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Total</span>
                                <span className="font-serif font-bold text-forest-950 text-sm">₹{past.totalAmount}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => deleteOrderFromHistory(past.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-cream-100 transition-colors"
                                  title="Remove from history"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleReorderClick(past)}
                                  className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-cream-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                  title="1-Tap Reorder"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-olive-300" />
                                  <span>1-Tap</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                ) : cart.length === 0 ? (
                  /* ============================================================ */
                  /* 3. EMPTY CART VIEW                                           */
                  /* ============================================================ */
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
                    {orderHistory.length > 0 && (
                      <button
                        onClick={() => setDrawerTab('history')}
                        className="inline-flex items-center gap-1.5 mt-1 px-4 py-2 rounded-full bg-cream-200 hover:bg-cream-300 text-forest-900 text-xs font-semibold transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-forest-700" />
                        <span>Or reorder from past orders ({orderHistory.length})</span>
                      </button>
                    )}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsDrawerOpen(false);
                          navigateTo('menu');
                        }}
                        className="px-6 py-2.5 rounded-full bg-forest-800 hover:bg-forest-900 text-cream-100 text-xs font-semibold shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4 text-olive-300" />
                        <span>Browse Menu →</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ============================================================ */
                  /* 4. ACTIVE CART VIEW                                          */
                  /* ============================================================ */
                  <>
                    {/* Single Consolidated Box: Items Added + Action Buttons (matching user screenshot) */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-cream-200/90 shadow-xs space-y-3">
                      {/* Box Header */}
                      <div className="flex items-center justify-between pb-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950">
                          ITEMS ADDED
                        </h4>
                        <button
                          onClick={clearCart}
                          className="text-[11px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear All</span>
                        </button>
                      </div>

                      {/* Items List separated by dashed lines */}
                      <div className="divide-y divide-dashed divide-gray-200">
                        {cart.map((item) => (
                          <div
                            key={item.cartKey}
                            className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                          >
                            {/* Left: Veg Badge & Name */}
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span className="veg-badge shrink-0 scale-90 mt-0.5">
                                <span className="veg-dot"></span>
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-forest-950 truncate">
                                  {item.name}
                                </h4>
                                {item.size && (
                                  <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                                    {item.size}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: Quantity Controls Pill [- 1 +] & Price */}
                            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                              <div className="flex items-center border border-gray-300 rounded-lg p-0.5 bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartKey, -1)}
                                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream-100 text-forest-900 active:scale-90"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-forest-950 px-2 text-center min-w-[20px]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.cartKey, 1)}
                                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-cream-100 text-forest-900 active:scale-90"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <span className="text-xs sm:text-sm font-serif font-bold text-forest-950 min-w-[48px] text-right">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dotted Separator Line inside the box */}
                      <div className="border-t border-dashed border-gray-200 pt-3">
                        {/* Two Action Buttons: Add More Items & Add Instructions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsDrawerOpen(false);
                              navigateTo('menu');
                            }}
                            className="flex-1 py-2 px-2.5 sm:px-3 rounded-xl border border-gray-300 hover:border-forest-600 bg-white hover:bg-cream-50 text-forest-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
                          >
                            <PlusCircle className="w-4 h-4 text-forest-800 shrink-0" />
                            <span className="truncate">Add More Items</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowInstructions(!showInstructions)}
                            className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                              notes || showInstructions
                                ? 'border-forest-800 bg-forest-50 text-forest-900'
                                : 'border-gray-300 hover:border-forest-600 bg-white hover:bg-cream-50 text-forest-950'
                            }`}
                          >
                            <PenLine className="w-4 h-4 text-forest-800 shrink-0" />
                            <span className="truncate">{notes ? 'Edit Instructions' : 'Add Instructions'}</span>
                          </button>
                        </div>

                        {/* Special Instructions Expandable Area (ONLY opens when user clicks Add Instructions) */}
                        {showInstructions && (
                          <div className="mt-3 p-3 bg-cream-50 rounded-2xl border border-cream-300 space-y-2 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                                <PenLine className="w-3.5 h-3.5 text-forest-800" />
                                <span>Special Cooking / Preparation Notes:</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowInstructions(false)}
                                className="text-xs text-gray-400 hover:text-gray-600 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <textarea
                              rows="2"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="e.g. Less spicy, packing required, extra napkins..."
                              className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white focus:outline-none focus:ring-1 focus:ring-forest-600 text-forest-950 shadow-2xs"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setShowInstructions(false)}
                                className="px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-xs"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}

                        {/* If notes already saved and instructions panel is collapsed, show note preview */}
                        {notes && !showInstructions && (
                          <div className="mt-2.5 p-2 bg-cream-100/80 rounded-xl border border-cream-200/90 flex items-start justify-between gap-2 text-xs">
                            <div className="flex items-start gap-1.5 text-forest-900">
                              <PenLine className="w-3 h-3 text-forest-700 shrink-0 mt-0.5" />
                              <span className="italic line-clamp-2">"{notes}"</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setShowInstructions(true)}
                                className="text-[11px] font-bold text-forest-800 hover:underline"
                              >
                                Edit
                              </button>
                              <span className="text-gray-300">•</span>
                              <button
                                type="button"
                                onClick={() => setNotes('')}
                                className="text-[11px] text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CRAVING MORE? Horizontal Carousel matching user reference screenshot */}
                    {cravingMoreItems.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                          CRAVING MORE?
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                          {cravingMoreItems.map((rec) => {
                            const hasMultipleSizes = Boolean(rec.sizes && rec.sizes.length > 1);
                            const recPrice = hasMultipleSizes ? rec.sizes[0].price : rec.price;

                            return (
                              <div
                                key={rec.id}
                                className="w-32 sm:w-36 shrink-0 bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                              >
                                {/* Image with veg badge and + button */}
                                <div className="relative h-28 w-full overflow-hidden bg-cream-100">
                                  <img
                                    src={rec.image}
                                    alt={rec.name}
                                    onError={(e) => {
                                      if (rec.fallbackImage) e.currentTarget.src = rec.fallbackImage;
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  {/* Veg Badge on bottom-left */}
                                  <div className="absolute bottom-2 left-2 bg-white/95 rounded px-1 py-0.5 shadow-xs">
                                    <span className="veg-badge scale-75"><span className="veg-dot"></span></span>
                                  </div>

                                  {/* Add Button on bottom-right matching screenshot */}
                                  <button
                                    type="button"
                                    onClick={() => addToCart(rec)}
                                    className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-lg shadow-md border border-cream-200 flex items-center justify-center text-forest-950 hover:bg-forest-800 hover:text-white transition-all active:scale-90"
                                    title={`Add ${rec.name} to bag`}
                                  >
                                    <Plus className="w-4 h-4 stroke-[2.5]" />
                                  </button>
                                </div>

                                {/* Title and Price */}
                                <div className="p-2.5 text-left">
                                  <p className="text-xs font-bold text-forest-950 truncate" title={rec.name}>
                                    {rec.name}
                                  </p>
                                  <p className="text-xs font-serif font-bold text-forest-900 mt-0.5">
                                    ₹{recPrice}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Compact Checkout Footer (Minimal space, 1-row layout) */}
              {!sentOrder && drawerTab === 'cart' && cart.length > 0 && (
                <div className="p-3 sm:p-4 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                    {/* Compact Total Amount */}
                    <div className="shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block leading-none">
                        Total
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-forest-950 block leading-tight mt-0.5">
                        ₹{totalAmount}
                      </span>
                    </div>

                    {/* Single Sleek WhatsApp Action Button */}
                    <button
                      onClick={handleSendOrder}
                      className="flex-1 py-3 px-4 sm:px-6 rounded-2xl bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Send Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </>
    );
  }
