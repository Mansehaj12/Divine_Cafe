import React, { useEffect } from 'react';
import { Leaf, ArrowLeft, UtensilsCrossed, MapPin, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cafeConfig } from '../data/cafeConfig';

export default function NotFoundPage() {
  const { navigateTo } = useCart();

  useEffect(() => {
    document.title = "Page Not Found (404) | Divine Cafe";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "The page you are looking for does not exist or has moved. Explore our fresh vegetarian menu or return to Divine Cafe's homepage."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-forest-950 flex flex-col justify-between font-sans px-4 py-8">
      {/* Top Brand Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#EBE4D8]">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-full bg-[#143826] flex items-center justify-center text-white shadow-md">
            <Leaf className="w-5 h-5 text-olive-300" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#143826]">
              {cafeConfig.brandName}
            </span>
            <p className="text-[11px] uppercase tracking-wider text-forest-600 font-medium">
              {cafeConfig.tagline}
            </p>
          </div>
        </button>

        <button
          onClick={() => navigateTo('menu')}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-[#143826] text-white hover:bg-forest-800 transition"
        >
          View Menu
        </button>
      </header>

      {/* Main 404 Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#143826] to-[#234438] flex items-center justify-center text-white shadow-xl shadow-forest-900/15">
          <Leaf className="w-10 h-10 text-olive-300" />
        </div>

        <p className="text-xs uppercase tracking-widest font-bold text-forest-700 mb-2">
          Error 404
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-950 mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-forest-700/80 max-w-md mx-auto mb-8 leading-relaxed">
          Looks like you've wandered off the garden path! The page you are looking for doesn't exist, has moved, or the link may have an error.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#143826] text-white font-semibold text-sm hover:bg-forest-800 transition shadow-lg shadow-forest-900/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => navigateTo('menu')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-cream-100 border border-cream-300 text-forest-900 font-semibold text-sm hover:bg-cream-200 transition"
          >
            <UtensilsCrossed className="w-4 h-4 text-forest-700" />
            <span>Browse Full Menu</span>
          </button>
        </div>

        {/* Helpful Descriptive Internal Links */}
        <div className="pt-6 border-t border-cream-200 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-forest-700">
          <a
            href={cafeConfig.address.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-forest-950 hover:underline"
          >
            <MapPin className="w-3.5 h-3.5 text-forest-600" />
            <span>Baradari Garden Directions</span>
          </a>
          <span>•</span>
          <a
            href={`https://wa.me/${cafeConfig.whatsappNumber}?text=Hi%20Divine%20Cafe,%20I%20need%20help%20with%20your%20menu`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-forest-950 hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5 text-forest-600" />
            <span>Message on WhatsApp</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-forest-600/70 py-4">
        <p>Divine Cafe — 100% Pure Vegetarian Kitchen • Mall Rd, inside Baradari Garden, Patiala</p>
      </footer>
    </div>
  );
}