import React, { useState, useEffect } from 'react';
import { Store, ShoppingBasket, BookOpen, Receipt } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
  const { 
    totalCount, 
    totalAmount,
    isDrawerOpen, 
    setIsDrawerOpen, 
    drawerTab, 
    setDrawerTab, 
    orderHistory 
  } = useCart();

  const [activeTab, setActiveTab] = useState('home');

  // Track active section on scroll when drawer is closed
  useEffect(() => {
    const handleScroll = () => {
      if (isDrawerOpen) return;

      const scrollPos = window.scrollY;
      const menuEl = document.getElementById('menu');
      
      if (menuEl) {
        const menuTop = menuEl.offsetTop - 150;
        const menuBottom = menuTop + menuEl.offsetHeight;

        if (scrollPos >= menuTop && scrollPos < menuBottom) {
          setActiveTab('menu');
          return;
        }
      }

      if (scrollPos < 350) {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDrawerOpen]);

  // Sync active tab when drawer opens or changes tab
  useEffect(() => {
    if (isDrawerOpen) {
      if (drawerTab === 'history') {
        setActiveTab('orders');
      } else {
        setActiveTab('cart');
      }
    } else {
      // Re-evaluate based on scroll
      const menuEl = document.getElementById('menu');
      if (menuEl && window.scrollY >= menuEl.offsetTop - 200) {
        setActiveTab('menu');
      } else {
        setActiveTab('home');
      }
    }
  }, [isDrawerOpen, drawerTab]);

  const handleNavClick = (tabKey) => {
    setActiveTab(tabKey);

    if (tabKey === 'home') {
      if (isDrawerOpen) setIsDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabKey === 'menu') {
      if (isDrawerOpen) setIsDrawerOpen(false);
      const menuEl = document.getElementById('menu');
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tabKey === 'cart') {
      setDrawerTab('cart');
      setIsDrawerOpen(true);
    } else if (tabKey === 'orders') {
      setDrawerTab('history');
      setIsDrawerOpen(true);
    }
  };

  const navItems = [
    {
      key: 'home',
      label: 'Home',
      icon: Store,
      badge: null,
    },
    {
      key: 'cart',
      label: 'Cart',
      icon: ShoppingBasket,
      badge: totalCount > 0 ? totalCount : null,
      badgeColor: 'bg-emerald-600',
    },
    {
      key: 'menu',
      label: 'Menu',
      icon: BookOpen,
      badge: null,
    },
    {
      key: 'orders',
      label: 'My Orders',
      icon: Receipt,
      badge: orderHistory.length > 0 ? orderHistory.length : null,
      badgeColor: 'bg-forest-800',
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.07)] md:hidden transition-all duration-300"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 max-w-md mx-auto items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item.key)}
              className="relative flex flex-col items-center justify-center h-full w-full py-1 text-center transition-all active:scale-95 group focus:outline-none"
            >
              {/* Active Top Indicator Line (matching user reference screenshot) */}
              {isActive && (
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-[#143826] rounded-b-full animate-in fade-in zoom-in-75 duration-200" 
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive 
                      ? 'text-[#143826] scale-110 stroke-[2.2]' 
                      : 'text-gray-500 group-hover:text-gray-700 stroke-[1.8]'
                  }`} 
                />

                {/* Badge (Items in Cart or Number of Past Orders) */}
                {item.badge !== null && (
                  <span 
                    className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-xs animate-in zoom-in duration-150 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label underneath */}
              <span 
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors duration-200 ${
                  isActive 
                    ? 'text-[#143826] font-bold' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
