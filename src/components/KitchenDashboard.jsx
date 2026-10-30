import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Bell, 
  BellOff, 
  Printer, 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  ShoppingBag, 
  RefreshCw, 
  Lock, 
  Unlock, 
  ArrowLeft,
  Volume2,
  Trash2,
  Check,
  AlertCircle,
  Layers,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { 
  getLocalOrders, 
  updateOrderStatus, 
  subscribeToOrders, 
  playOrderBell, 
  clearCompletedOrders,
  syncFromCloud 
} from '../services/orderService';
import { cafeConfig } from '../data/cafeConfig';

export default function KitchenDashboard({ onBackToWebsite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('divine_kitchen_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('active'); // 'active' | 'preparing' | 'served' | 'all'
  const [viewMode, setViewMode] = useState('tables'); // 'tables' | 'slips'
  const [selectedTableTab, setSelectedTableTab] = useState('all'); // 'all' | 'table_1' | 'takeaway' etc.
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Printing states
  const [printingOrderId, setPrintingOrderId] = useState(null);
  const [printingTableKey, setPrintingTableKey] = useState(null);

  const prevOrderCountRef = useRef(0);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load and subscribe to live orders
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial load
    const initial = getLocalOrders();
    setOrders(initial);
    prevOrderCountRef.current = initial.length;

    // Server & Cloud sync on startup
    syncFromCloud().then(cloudOrders => {
      if (Array.isArray(cloudOrders)) {
        if (cloudOrders.length > prevOrderCountRef.current) {
          if (soundEnabled) playOrderBell();
        }
        prevOrderCountRef.current = cloudOrders.length;
        setOrders(cloudOrders);
      }
    });

    // Real-time listener (same window + other tabs)
    const unsubscribe = subscribeToOrders((updatedOrders) => {
      if (Array.isArray(updatedOrders)) {
        if (updatedOrders.length > prevOrderCountRef.current) {
          if (soundEnabled) playOrderBell();
        }
        prevOrderCountRef.current = updatedOrders.length;
        setOrders(updatedOrders);
      }
    });

    // Fast polling every 2 seconds for multi-device sync (phone to PC)
    const pollInterval = setInterval(() => {
      syncFromCloud().then(cloudOrders => {
        if (Array.isArray(cloudOrders)) {
          if (cloudOrders.length > prevOrderCountRef.current) {
            if (soundEnabled) playOrderBell();
          }
          prevOrderCountRef.current = cloudOrders.length;
          setOrders(cloudOrders);
        }
      });
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [isAuthenticated, soundEnabled]);

  // Handle PIN Unlock
  const handlePinSubmit = (e) => {
    e?.preventDefault();
    const correctPin = cafeConfig.kitchen?.pin || "1470";
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('divine_kitchen_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('divine_kitchen_auth');
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const handleTableStatusChange = async (group, newStatus) => {
    let updated = orders;
    for (const ord of group.orders) {
      updated = await updateOrderStatus(ord.id, newStatus);
    }
    setOrders(updated);
  };

  const handlePrintSlip = (order) => {
    setPrintingTableKey(null);
    setPrintingOrderId(order.id);
    setTimeout(() => {
      window.print();
      setPrintingOrderId(null);
    }, 150);
  };

  const handlePrintTable = (group) => {
    setPrintingOrderId(null);
    setPrintingTableKey(group.key);
    setTimeout(() => {
      window.print();
      setPrintingTableKey(null);
    }, 150);
  };

  // Filtered orders list
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const servedOrders = orders.filter(o => o.status === 'served');

  const displayedOrders = orders.filter(order => {
    if (filter === 'active') return order.status === 'pending' || order.status === 'preparing';
    if (filter === 'preparing') return order.status === 'preparing';
    if (filter === 'served') return order.status === 'served';
    return true; // 'all'
  });

  // Group orders by Table
  const tableGroups = useMemo(() => {
    const groups = {};

    displayedOrders.forEach(order => {
      const isTakeaway = order.diningMode === 'takeaway';
      const key = isTakeaway ? 'takeaway' : (order.tableNumber ? `table_${order.tableNumber}` : 'table_walkin');
      const label = isTakeaway ? 'Takeaway' : (order.tableNumber ? `Table #${order.tableNumber}` : 'Dine-In (Table N/A)');

      if (!groups[key]) {
        groups[key] = {
          key,
          label,
          tableNumber: order.tableNumber || '',
          isTakeaway,
          orders: [],
          totalAmount: 0,
          totalCount: 0,
          hasPending: false,
          hasPreparing: false,
          allServed: true,
          latestTime: order.formattedTime
        };
      }

      groups[key].orders.push(order);
      groups[key].totalAmount += (order.totalAmount || 0);
      groups[key].totalCount += (order.totalCount || 0);
      if (order.status === 'pending') {
        groups[key].hasPending = true;
        groups[key].allServed = false;
      }
      if (order.status === 'preparing') {
        groups[key].hasPreparing = true;
        groups[key].allServed = false;
      }
      if (order.status !== 'served') {
        groups[key].allServed = false;
      }
    });

    return Object.values(groups).sort((a, b) => {
      // Pending first, then table number
      if (a.hasPending && !b.hasPending) return -1;
      if (!a.hasPending && b.hasPending) return 1;
      return (parseInt(a.tableNumber) || 99) - (parseInt(b.tableNumber) || 99);
    });
  }, [displayedOrders]);

  // Filtered table groups if table tab is selected
  const displayedTableGroups = useMemo(() => {
    if (selectedTableTab === 'all') return tableGroups;
    return tableGroups.filter(g => g.key === selectedTableTab);
  }, [tableGroups, selectedTableTab]);

  // All 10 predefined tables list for quick switcher
  const predefinedTables = [
    { key: 'table_1', num: '1', label: 'T1' },
    { key: 'table_2', num: '2', label: 'T2' },
    { key: 'table_3', num: '3', label: 'T3' },
    { key: 'table_4', num: '4', label: 'T4' },
    { key: 'table_5', num: '5', label: 'T5' },
    { key: 'table_6', num: '6', label: 'T6' },
    { key: 'table_7', num: '7', label: 'T7' },
    { key: 'table_8', num: '8', label: 'T8' },
    { key: 'table_9', num: '9', label: 'T9' },
    { key: 'table_10', num: '10', label: 'T10' },
    { key: 'takeaway', num: 'Takeaway', label: '🛍️ Takeaway' }
  ];

  // PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#11241a] text-cream-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm bg-[#163324] border border-forest-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-forest-800 text-olive-300 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Divine Café
            </h1>
            <p className="text-xs text-olive-300 font-medium uppercase tracking-widest mt-1">
              Kitchen & Billing Desk
            </p>
            <p className="text-xs text-cream-200/70 mt-2">
              Enter staff PIN to view live table orders & slips
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                autoFocus
                className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-2xl bg-[#0e2117] border border-forest-700 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-olive-400 font-mono"
              />
              <p className="text-[11px] text-cream-200/50 mt-1.5">
                Default Staff PIN: <span className="font-mono text-olive-300 font-bold">1470</span>
              </p>
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Incorrect PIN. Please try again.</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-olive-500 hover:bg-olive-400 text-forest-950 font-bold text-sm transition-all shadow-md active:scale-95"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-forest-800/80">
            <button
              onClick={onBackToWebsite}
              className="text-xs text-olive-300 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Kitchen Dashboard Screen
  return (
    <div className="min-h-screen bg-[#0d1e15] text-cream-100 flex flex-col font-sans">
      
      {/* Hidden Thermal Slip Print Container */}
      <div className="hidden print:block print:p-2 print:text-black font-mono text-xs">
        {/* Print Individual KOT Slip */}
        {printingOrderId && orders.filter(o => o.id === printingOrderId).map(order => (
          <div key={order.id} className="max-w-[80mm] mx-auto text-black p-1 space-y-2">
            <div className="text-center border-b pb-2 border-black">
              <h2 className="font-bold text-base uppercase tracking-wider">DIVINE CAFE</h2>
              <p className="text-[10px]">Baradari Garden, Patiala</p>
              <p className="font-bold text-sm mt-1 uppercase">KITCHEN ORDER TICKET (KOT)</p>
            </div>

            <div className="text-[11px] space-y-0.5 border-b pb-1.5 border-black">
              <div className="flex justify-between font-bold">
                <span>ORDER: #{order.id}</span>
                <span>{order.diningMode === 'takeaway' ? '🛍️ TAKEAWAY' : `🍽️ TABLE ${order.tableNumber || 'WALK-IN'}`}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>DATE: {order.formattedDate}</span>
                <span>TIME: {order.formattedTime}</span>
              </div>
            </div>

            <div className="py-1 border-b border-black">
              <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-dashed border-black">
                <span>QTY & ITEM</span>
                <span>AMOUNT</span>
              </div>
              <div className="space-y-1 pt-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <div>
                      <span className="font-bold mr-1">{item.quantity}x</span>
                      <span>{item.name}</span>
                      {item.size && <span className="text-[9px] block text-gray-700">({item.size})</span>}
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.notes && (
              <div className="text-[10px] border-b pb-1 border-black">
                <span className="font-bold block">SPECIAL INSTRUCTIONS:</span>
                <p className="italic">{order.notes}</p>
              </div>
            )}

            <div className="flex justify-between font-bold text-sm pt-1">
              <span>ORDER TOTAL:</span>
              <span>₹{order.totalAmount}</span>
            </div>

            <div className="text-center text-[9px] pt-2 border-t border-dashed border-black">
              <p>*** PREPARE FRESH & SERVE HOT ***</p>
            </div>
          </div>
        ))}

        {/* Print Entire Table Running Bill */}
        {printingTableKey && tableGroups.filter(g => g.key === printingTableKey).map(group => (
          <div key={group.key} className="max-w-[80mm] mx-auto text-black p-1 space-y-2">
            <div className="text-center border-b pb-2 border-black">
              <h2 className="font-bold text-base uppercase tracking-wider">DIVINE CAFE</h2>
              <p className="text-[10px]">Baradari Garden, Patiala</p>
              <p className="font-bold text-base mt-1 uppercase">TABLE RUNNING BILL</p>
              <p className="font-bold text-sm uppercase">{group.label}</p>
            </div>

            <div className="text-[10px] flex justify-between border-b pb-1 border-black">
              <span>ORDERS PLACED: {group.orders.length}</span>
              <span>LATEST: {group.latestTime}</span>
            </div>

            <div className="py-1 border-b border-black space-y-2">
              {group.orders.map((ord, oIdx) => (
                <div key={ord.id} className="border-b border-dashed border-gray-400 pb-1.5 last:border-b-0">
                  <div className="flex justify-between font-bold text-[10px] text-gray-700">
                    <span>Order #{ord.id} ({ord.formattedTime})</span>
                    <span>₹{ord.totalAmount}</span>
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    {ord.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex justify-between text-[11px]">
                        <span>{it.quantity}x {it.name} {it.size ? `(${it.size})` : ''}</span>
                        <span>₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-base pt-1">
              <span>GRAND RUNNING TOTAL:</span>
              <span>₹{group.totalAmount}</span>
            </div>

            <div className="text-center text-[10px] pt-3 border-t border-dashed border-black">
              <p>Thank you for visiting Divine Café!</p>
              <p className="text-[9px]">“You Are What You Eat”</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Top Header (Excluded from Print) */}
      <header className="print:hidden bg-[#143122] border-b border-forest-800 px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Brand & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-cream-200 transition-all"
              title="Return to Menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  Divine Café
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-olive-500/20 text-olive-300 text-[10px] font-bold uppercase tracking-wider border border-olive-500/30">
                  Live Desk
                </span>
              </div>
              <p className="text-[11px] text-cream-200/70">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} • Patiala
              </p>
            </div>
          </div>

          {/* Right Controls & Sound */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Toggle: Tables vs Slips */}
            <div className="flex items-center bg-[#0e2117] p-1 rounded-xl border border-forest-700">
              <button
                onClick={() => setViewMode('tables')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'tables'
                    ? 'bg-olive-500 text-forest-950 shadow-xs'
                    : 'text-cream-200/70 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>By Tables ({tableGroups.length})</span>
              </button>

              <button
                onClick={() => setViewMode('slips')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'slips'
                    ? 'bg-olive-500 text-forest-950 shadow-xs'
                    : 'text-cream-200/70 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>All Slips ({displayedOrders.length})</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                soundEnabled
                  ? 'bg-olive-500 text-forest-950 border-olive-400 shadow-sm'
                  : 'bg-forest-800/80 text-gray-400 border-forest-700'
              }`}
            >
              {soundEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Bell ON' : 'Bell Muted'}</span>
            </button>

            {/* Manual Sync */}
            <button
              onClick={() => {
                syncFromCloud().then(o => o && setOrders(o));
                setOrders(getLocalOrders());
              }}
              className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-200 border border-forest-700"
              title="Refresh Orders"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Lock / Exit */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50"
              title="Lock Screen"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Body (Excluded from Print) */}
      <main className="print:hidden flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* Top Metric Bar & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#143122] p-3 sm:p-4 rounded-2xl border border-forest-800">
          
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-gray-300">Active Tables:</span>
              <span className="font-bold font-serif text-white text-base">
                {tableGroups.filter(g => g.hasPending || g.hasPreparing).length}
              </span>
            </div>
            <div className="text-gray-600">|</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-gray-300">Total Slips Today:</span>
              <span className="font-bold font-serif text-white text-base">{orders.length}</span>
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#0e2117] p-1 rounded-xl border border-forest-700">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'active'
                  ? 'bg-olive-500 text-forest-950 shadow-xs'
                  : 'text-cream-200/70 hover:text-white'
              }`}
            >
              Active ({activeOrders.length})
            </button>

            <button
              onClick={() => setFilter('preparing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'preparing'
                  ? 'bg-olive-500 text-forest-950 shadow-xs'
                  : 'text-cream-200/70 hover:text-white'
              }`}
            >
              In Kitchen ({preparingOrders.length})
            </button>

            <button
              onClick={() => setFilter('served')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'served'
                  ? 'bg-olive-500 text-forest-950 shadow-xs'
                  : 'text-cream-200/70 hover:text-white'
              }`}
            >
              Served ({servedOrders.length})
            </button>

            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-olive-500 text-forest-950 shadow-xs'
                  : 'text-cream-200/70 hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
          </div>

        </div>

        {/* 10-Table Quick Filter Bar (When in Tables View) */}
        {viewMode === 'tables' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTableTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                selectedTableTab === 'all'
                  ? 'bg-olive-500 text-forest-950 border-olive-400 shadow-sm'
                  : 'bg-[#143122] text-cream-200 border-forest-800 hover:border-forest-700'
              }`}
            >
              All Tables ({tableGroups.length})
            </button>

            {predefinedTables.map(t => {
              const activeGroup = tableGroups.find(g => g.key === t.key);
              const hasOrders = !!activeGroup;
              const hasPending = activeGroup?.hasPending;

              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTableTab(t.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                    selectedTableTab === t.key
                      ? 'bg-olive-500 text-forest-950 border-olive-400 font-bold'
                      : hasOrders
                      ? hasPending
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 animate-pulse'
                        : 'bg-[#183929] text-emerald-300 border-emerald-600/50'
                      : 'bg-[#143122]/50 text-gray-500 border-forest-800/60 hover:text-cream-200'
                  }`}
                >
                  <span>{t.label}</span>
                  {hasOrders && (
                    <span className="w-4 h-4 rounded-full bg-forest-950/80 text-[10px] font-bold flex items-center justify-center">
                      {activeGroup.orders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: TABLE-BY-TABLE SECTIONS (Table 4, Table 5, etc.) */}
        {/* ======================================================== */}
        {viewMode === 'tables' ? (
          displayedTableGroups.length === 0 ? (
            <div className="text-center py-20 bg-[#143122]/40 rounded-3xl border border-dashed border-forest-800 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-forest-800/80 text-olive-300 flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                No active table orders
              </h3>
              <p className="text-xs text-cream-200/60 max-w-sm mx-auto">
                When Table 4, Table 5, or any other table scans and orders, each table will have its own dedicated section with a running bill.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedTableGroups.map(group => {
                return (
                  <div
                    key={group.key}
                    className={`rounded-3xl border transition-all overflow-hidden shadow-xl ${
                      group.hasPending
                        ? 'bg-[#163826] border-amber-500/60 shadow-amber-500/10'
                        : group.hasPreparing
                        ? 'bg-[#133221] border-olive-500/60'
                        : 'bg-[#10271b] border-forest-800'
                    }`}
                  >
                    {/* Table Section Header */}
                    <div className="p-4 sm:p-5 bg-[#0f281b] border-b border-forest-800 flex flex-wrap items-center justify-between gap-4">
                      
                      {/* Left: Table Title & Status */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-forest-800 text-olive-300 flex items-center justify-center text-xl font-bold shadow-inner">
                          {group.isTakeaway ? '🛍️' : '🍽️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                              {group.label}
                            </h2>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              group.hasPending ? 'bg-amber-400 text-amber-950 animate-pulse' :
                              group.hasPreparing ? 'bg-olive-400 text-forest-950' :
                              'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                            }`}>
                              {group.hasPending ? 'New Order' : group.hasPreparing ? 'In Kitchen' : 'All Served'}
                            </span>
                          </div>
                          <p className="text-xs text-cream-200/70 mt-0.5">
                            {group.orders.length} order{group.orders.length !== 1 ? 's' : ''} placed • {group.totalCount} items total • Latest at {group.latestTime}
                          </p>
                        </div>
                      </div>

                      {/* Right: Running Bill & Table Actions */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] text-cream-200/60 uppercase tracking-widest">
                            Running Table Bill
                          </p>
                          <p className="font-serif text-2xl font-bold text-olive-300">
                            ₹{group.totalAmount}
                          </p>
                        </div>

                        {/* Print Entire Table Bill */}
                        <button
                          onClick={() => handlePrintTable(group)}
                          className="px-3 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-semibold flex items-center gap-1.5 border border-forest-700 transition-all shadow-sm"
                          title="Print Full Running Bill for Table"
                        >
                          <Printer className="w-4 h-4 text-olive-300" />
                          <span className="hidden sm:inline">Print Table Bill</span>
                        </button>

                        {/* Quick Table Status Progression */}
                        {group.hasPending && (
                          <button
                            onClick={() => handleTableStatusChange(group, 'preparing')}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                          >
                            <UtensilsCrossed className="w-3.5 h-3.5" />
                            <span>Start All Cooking</span>
                          </button>
                        )}

                        {!group.hasPending && !group.allServed && (
                          <button
                            onClick={() => handleTableStatusChange(group, 'served')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Table Served</span>
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Table Orders Breakdown (Nested Sub-Orders) */}
                    <div className="p-4 sm:p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.orders.map((ord, idx) => {
                          const isOrdPending = ord.status === 'pending';
                          const isOrdPreparing = ord.status === 'preparing';
                          const isOrdServed = ord.status === 'served';

                          return (
                            <div
                              key={ord.id}
                              className="p-4 rounded-2xl bg-[#0e2117]/90 border border-forest-800/80 flex flex-col justify-between space-y-3"
                            >
                              {/* Order Sub-Header */}
                              <div>
                                <div className="flex items-center justify-between text-xs pb-2 border-b border-forest-800/60">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-white">#{ord.id}</span>
                                    <span className="text-[10px] text-gray-400">Order #{idx + 1}</span>
                                  </div>
                                  <span className="font-mono text-[11px] text-olive-300 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {ord.formattedTime}
                                  </span>
                                </div>

                                {/* Items in this order */}
                                <div className="space-y-1.5 pt-2.5">
                                  {ord.items.map((it, iIdx) => (
                                    <div key={iIdx} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-forest-800 text-olive-300 font-bold flex items-center justify-center text-[10px]">
                                          {it.quantity}x
                                        </span>
                                        <span className="font-medium text-white">{it.name}</span>
                                        {it.size && <span className="text-[10px] text-olive-300">({it.size})</span>}
                                      </div>
                                      <span className="text-gray-300 font-mono text-[11px]">
                                        ₹{it.price * it.quantity}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {ord.notes && (
                                  <div className="mt-2.5 p-2 rounded-lg bg-forest-950/70 border border-forest-800 text-[11px] text-amber-300 italic">
                                    Note: {ord.notes}
                                  </div>
                                )}
                              </div>

                              {/* Order Sub-Actions */}
                              <div className="pt-2 border-t border-forest-800/60 flex items-center justify-between gap-2">
                                <span className="font-serif font-bold text-white text-sm">
                                  ₹{ord.totalAmount}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handlePrintSlip(ord)}
                                    className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-cream-200"
                                    title="Print Slip for this order"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>

                                  {isOrdPending && (
                                    <button
                                      onClick={() => handleStatusChange(ord.id, 'preparing')}
                                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-[11px]"
                                    >
                                      Cook
                                    </button>
                                  )}

                                  {isOrdPreparing && (
                                    <button
                                      onClick={() => handleStatusChange(ord.id, 'served')}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-[11px]"
                                    >
                                      Served
                                    </button>
                                  )}

                                  {isOrdServed && (
                                    <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-forest-900 border border-emerald-900">
                                      ✓ Done
                                    </span>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* ======================================================== */
          /* VIEW 2: INDIVIDUAL CHRONOLOGICAL SLIPS STREAM            */
          /* ======================================================== */
          displayedOrders.length === 0 ? (
            <div className="text-center py-20 bg-[#143122]/40 rounded-3xl border border-dashed border-forest-800 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-forest-800/80 text-olive-300 flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                No orders in this queue
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayedOrders.map((order) => {
                const isPending = order.status === 'pending';
                const isPreparing = order.status === 'preparing';
                const isServed = order.status === 'served';

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border transition-all flex flex-col justify-between shadow-lg overflow-hidden ${
                      isPending
                        ? 'bg-[#183929] border-amber-500/50 shadow-amber-500/5'
                        : isPreparing
                        ? 'bg-[#153524] border-olive-500/50 shadow-olive-500/5'
                        : 'bg-[#10271b] border-forest-800 opacity-80'
                    }`}
                  >
                    {/* Slip Header */}
                    <div className={`p-4 border-b ${
                      isPending ? 'border-amber-500/20 bg-amber-500/10' :
                      isPreparing ? 'border-olive-500/20 bg-olive-500/10' :
                      'border-forest-800 bg-forest-900/40'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">
                            #{order.id}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isPending ? 'bg-amber-400 text-amber-950 animate-pulse' :
                            isPreparing ? 'bg-olive-400 text-forest-950' :
                            'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                          }`}>
                            {isPending ? 'New Order' : isPreparing ? 'Cooking' : 'Served'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-gray-300 font-mono flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-olive-300" />
                            {order.formattedTime}
                          </span>
                        </div>
                      </div>

                      {/* Table / Order Type Banner */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">
                            {order.diningMode === 'takeaway' ? '🛍️' : '🍽️'}
                          </span>
                          <span className="font-serif font-bold text-white text-base">
                            {order.diningMode === 'takeaway'
                              ? 'Takeaway Order'
                              : order.tableNumber
                              ? `Table #${order.tableNumber}`
                              : 'Dine-In (Table Unspecified)'}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-olive-300 text-base">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="p-4 space-y-2.5 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-cream-200/60 font-semibold">
                        Items Ordered ({order.totalCount})
                      </p>

                      <div className="space-y-1.5 divide-y divide-forest-800/40">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-forest-800 text-olive-300 font-bold flex items-center justify-center text-[11px]">
                                {item.quantity}
                              </span>
                              <span className="font-medium text-white">
                                {item.name}
                              </span>
                              {item.size && (
                                <span className="text-[10px] text-olive-300 font-semibold">
                                  ({item.size})
                                </span>
                              )}
                            </div>
                            <span className="text-cream-200/70 font-mono text-[11px]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-[#0e2117] border border-forest-700/60 text-xs">
                          <span className="text-[10px] font-bold text-amber-300 block uppercase">
                            Kitchen Instruction:
                          </span>
                          <p className="text-cream-100 italic mt-0.5">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Slip Action Buttons */}
                    <div className="p-3 bg-[#0e2117] border-t border-forest-800 flex items-center gap-2">
                      <button
                        onClick={() => handlePrintSlip(order)}
                        className="p-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 border border-forest-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
                        title="Print KOT Slip (Thermal 58/80mm)"
                      >
                        <Printer className="w-3.5 h-3.5 text-olive-300" />
                        <span className="hidden sm:inline">Print</span>
                      </button>

                      {isPending && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'preparing')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          <span>Start Cooking</span>
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'served')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark as Served</span>
                        </button>
                      )}

                      {isServed && (
                        <div className="flex-1 py-2 px-3 rounded-xl bg-forest-900/60 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1 border border-forest-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )
        )}

      </main>

    </div>
  );
}
