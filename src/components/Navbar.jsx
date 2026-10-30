import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, MapPin, Sparkles, Phone, Leaf } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenMenuScans, onOpenOwnerNotes }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, setIsDrawerOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Favourites', href: '#favourites' },
    { name: 'Digital Menu', href: '#menu' },
    { name: 'Visit Us', href: '#location' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#143826]/95 backdrop-blur-md shadow-lg py-3 text-cream-100 border-b border-forest-700/40'
            : 'bg-[#143826] py-4 text-cream-100 border-b border-forest-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Tagline */}
            <a href="#home" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 border border-forest-600/60 flex items-center justify-center text-forest-200 shadow-inner group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-olive-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cream-200 transition-colors">
                  {cafeConfig.brandName}
                </span>
                <span className="text-[10px] sm:text-xs tracking-widest text-olive-200 uppercase font-medium">
                  {cafeConfig.tagline}
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-cream-200 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-olive-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* WhatsApp Quick Order Bag */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-forest-800/80 hover:bg-forest-700 text-cream-100 border border-forest-600/50 transition-all shadow-sm active:scale-95"
                title="Your order enquiry bag"
              >
                <ShoppingBag className="w-4 h-4 text-olive-300" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Order Bag</span>
                {totalCount > 0 && (
                  <span className="bg-olive-500 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Physical Menu Cards Button */}
              <button
                onClick={onOpenMenuScans}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full bg-cream-100/10 hover:bg-cream-100/20 text-cream-200 border border-white/10 transition-colors"
                title="View original printed menu cards"
              >
                <Sparkles className="w-3.5 h-3.5 text-olive-300" />
                <span>Original Menu</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-forest-800/80 text-cream-100 hover:bg-forest-700 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-forest-950/80 backdrop-blur-md pt-20 pb-6 px-6 flex flex-col justify-between">
          <div className="flex flex-col gap-4 mt-4">
            <div className="pb-3 border-b border-forest-800">
              <p className="font-serif text-xl font-bold text-white">{cafeConfig.brandName}</p>
              <p className="text-xs text-olive-300 tracking-wider uppercase">{cafeConfig.tagline}</p>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="text-lg font-medium text-cream-100 hover:text-olive-300 py-2 border-b border-forest-900/60 transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-forest-600">→</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-forest-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMenuScans();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-800 text-cream-100 text-sm font-medium border border-forest-700"
            >
              <Sparkles className="w-4 h-4 text-olive-300" />
              <span>View Original Printed Menu Scans</span>
            </button>

            <a
              href="#menu"
              onClick={handleLinkClick}
              className="w-full py-3 rounded-xl bg-olive-600 hover:bg-olive-500 text-white font-medium text-center text-sm shadow-md transition-colors"
            >
              Explore Full Digital Menu
            </a>
          </div>
        </div>
      )}
    </>
  );
}
