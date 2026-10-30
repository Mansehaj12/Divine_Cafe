import React, { useState, useEffect } from 'react';
import { Utensils, X, Sparkles, Check } from 'lucide-react';
import { menuCategories, menuItems } from '../data/menuData';
import { useCart } from '../context/useCart';

export default function FloatingMenuNavigator({ activeCategory, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { totalCount, isDrawerOpen } = useCart();

  // Show floating button after user scrolls slightly past hero
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute category list with accurate Divine Cafe counts
  const categoriesList = [
    {
      id: "all",
      name: "All Categories",
      count: 52,
      isSpecial: false
    },
    {
      id: "favourites",
      name: "Customer Favourites",
      count: menuItems.filter(i => i.isPopular).length,
      isSpecial: true
    },
    ...menuCategories.filter(c => c.id !== "all").map(c => ({
      id: c.id,
      name: c.name,
      count: c.count,
      isSpecial: false
    }))
  ];

  const handleCategoryClick = (catId) => {
    setIsOpen(false);
    if (catId === "favourites") {
      const favEl = document.getElementById('favourites');
      if (favEl) {
        favEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (onSelectCategory) {
        onSelectCategory(catId);
      }
      setTimeout(() => {
        const target = catId === "all" 
          ? document.getElementById('menu')
          : (document.getElementById(`category-${catId}`) || document.getElementById('menu'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  if (!isVisible || isDrawerOpen) return null;

  // Adjust bottom offset if the mobile sticky cart bar is visible
  const bottomPositionClass = totalCount > 0
    ? 'bottom-20 sm:bottom-6'
    : 'bottom-6';

  return (
    <>
      {/* Floating Menu Pill Button */}
      <div className={`fixed right-4 sm:right-6 ${bottomPositionClass} z-30 transition-all duration-300`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1b3d2b] hover:bg-[#143022] text-white shadow-xl hover:shadow-2xl border border-forest-600/50 backdrop-blur-sm active:scale-95 transition-all group"
          aria-label="Open menu categories navigator"
        >
          {/* Custom Cutlery Icon SVG matching the user screenshot */}
          <div className="flex items-center text-white">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Spoon */}
              <path d="M7 2a3 3 0 0 0-3 3c0 2.5 2 4.5 3 5.5v10a1 1 0 1 0 2 0V10.5c1-1 3-3 3-5.5a3 3 0 0 0-3-3H7z" />
              {/* Knife */}
              <path d="M17 2c-1.5 0-3 1.5-3 3.5v7.5a1 1 0 0 0 1 1h1v7a1 1 0 1 0 2 0V2h-1z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide">Menu</span>
        </button>
      </div>

      {/* Floating Category Menu Popup (Zomato/Swiggy Style) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup Card */}
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-cream-200 z-10 flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 pb-3 border-b border-cream-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-olive-700 uppercase tracking-wider">
                  Quick Navigator
                </p>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Browse by Category
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                52 Dishes
              </span>
            </div>

            {/* Scrollable Category Items List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 divide-y divide-cream-100">
              {categoriesList.map((cat) => {
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full py-3 px-3.5 rounded-xl flex items-center justify-between transition-colors text-left group ${
                      isActive
                        ? 'bg-forest-50 text-forest-950 font-bold'
                        : 'hover:bg-cream-50/80 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {cat.isSpecial ? (
                        <span className="text-olive-700 font-bold text-sm">
                          ★ {cat.name}
                        </span>
                      ) : (
                        <span className={`text-sm ${isActive ? 'font-bold text-forest-950' : 'font-medium group-hover:text-forest-900'}`}>
                          {cat.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        cat.isSpecial
                          ? 'text-olive-700 font-bold bg-olive-50'
                          : isActive
                          ? 'text-forest-900 font-semibold bg-forest-100'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}>
                        {cat.count}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-forest-800" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Bar with Close Button (matching screenshot) */}
            <div className="p-3 sm:p-4 bg-cream-50/80 border-t border-cream-200 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 italic">
                Tap category to view items
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 text-xs font-semibold shadow-sm transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
