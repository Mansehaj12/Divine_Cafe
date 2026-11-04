import React, { useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cafeConfig } from '../data/cafeConfig';
import DigitalMenu from './DigitalMenu';
import Footer from './Footer';
import FloatingMenuNavigator from './FloatingMenuNavigator';
import WhatsAppCartDrawer from './WhatsAppCartDrawer';

export default function MenuPage({ selectedCategory, onSelectCategory }) {
  const { navigateTo, totalCount, totalAmount, setIsDrawerOpen, setDrawerTab } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-forest-950 font-sans selection:bg-[#234438] selection:text-[#FAF7F2]">
      
      {/* Top Header for Menu Page with Back to Home button */}
      <header className="sticky top-0 z-40 bg-[#143826] text-cream-100 shadow-md border-b border-forest-700/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Back to Home Button */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-forest-800/90 hover:bg-forest-700 text-cream-100 border border-forest-600/60 text-xs sm:text-sm font-semibold transition-all active:scale-95 group shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-olive-300 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Brand Name Center */}
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-forest-800 border border-forest-600/60 flex items-center justify-center text-forest-200">
              <Leaf className="w-4 h-4 text-olive-300" />
            </div>
            <div className="text-left hidden xs:block">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white block leading-tight">
                {cafeConfig.brandName}
              </span>
              <span className="text-[10px] text-olive-300 uppercase font-medium tracking-wider">
                Full Digital Menu
              </span>
            </div>
          </button>

          {/* Cart Bag Icon with live total */}
          <button
            onClick={() => {
              setDrawerTab('cart');
              setIsDrawerOpen(true);
            }}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-forest-800/90 hover:bg-forest-700 text-cream-100 border border-forest-600/60 transition-all shadow-xs active:scale-95"
            title="Open order bag"
          >
            <ShoppingBag className="w-4 h-4 text-olive-300" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {totalCount > 0 ? `₹${totalAmount}` : 'Bag'}
            </span>
            {totalCount > 0 && (
              <span className="bg-olive-500 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Main Menu Content (All 52 dishes, search, categories) */}
      <main className={`flex-1 ${totalCount > 0 ? 'pb-20 sm:pb-8' : 'pb-6'}`}>
        <DigitalMenu 
          activeCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating category navigator for quick jumping across menu dishes */}
      <FloatingMenuNavigator 
        activeCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Full-screen WhatsApp Cart Drawer */}
      <WhatsAppCartDrawer />

      {/* NOTE: BottomNav is strictly OMITTED here as requested by user! */}
    </div>
  );
}
