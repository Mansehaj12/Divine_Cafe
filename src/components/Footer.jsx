import React from 'react';
import { Leaf, Heart, Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

export default function Footer({ onOpenMenuScans, onOpenOwnerNotes, onOpenKitchen }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0e201a] text-cream-200 pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 border border-forest-700 flex items-center justify-center text-olive-300">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  {cafeConfig.brandName}
                </span>
                <p className="text-xs text-olive-300 tracking-wider uppercase font-medium">
                  {cafeConfig.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream-300/80 font-light leading-relaxed max-w-sm">
              A conscious pure vegetarian café offering handcrafted thin-crust pizzas, fresh sandwiches, wholesome breakfasts, aromatic teas, and cooling sips.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-olive-400 font-medium">
              <span className="veg-badge scale-90"><span className="veg-dot"></span></span>
              <span>100% Pure Vegetarian Kitchen</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-cream-300/80">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#highlights" className="hover:text-white transition-colors">Our Values</a>
              </li>
              <li>
                <a href="#favourites" className="hover:text-white transition-colors">Customer Favourites</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">Digital Menu (52 Items)</a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">Visit Divine Cafe</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact & WhatsApp</a>
              </li>
            </ul>
          </div>

          {/* Menu Categories Summary */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Menu Transparency
            </h4>
            <p className="text-xs text-cream-300/80 leading-relaxed">
              Every dish name, description, and price is digitized straight from Divine Cafe's original physical menu.
            </p>
            
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onOpenMenuScans}
                className="inline-flex items-center gap-2 text-xs text-olive-300 hover:text-white transition-colors text-left"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Original Scanned Menu Cards</span>
              </button>

              <button
                onClick={onOpenOwnerNotes}
                className="inline-flex items-center gap-2 text-xs text-olive-300 hover:text-white transition-colors text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Menu Accuracy & Owner Clarifications</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400/60 text-center sm:text-left">
          <p>© {currentYear} {cafeConfig.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-4 justify-center">
            {onOpenKitchen && (
              <button
                onClick={onOpenKitchen}
                className="text-cream-400/60 hover:text-olive-300 transition-colors flex items-center gap-1 text-[11px]"
              >
                <span>🔐</span>
                <span>Staff & Kitchen Desk</span>
              </button>
            )}
            <p className="flex items-center gap-1.5 justify-center">
              <span>Designed with love & cozy elegance for</span>
              <span className="text-cream-200 font-medium">{cafeConfig.brandName}</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
