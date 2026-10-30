import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Plus, Check } from 'lucide-react';
import { menuItems } from '../data/menuData';
import { useCart } from '../context/useCart';

export default function HeroBestsellerTicker() {
  const { addToCart } = useCart();
  const [justAddedId, setJustAddedId] = useState(null);

  // Top customer favourite items
  const bestsellers = [
    {
      id: "pz-3",
      name: "Paneer Makhni Pizza",
      tag: "Customer Favorite",
      price: "From ₹240",
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
      itemRef: menuItems.find(i => i.id === "pz-3")
    },
    {
      id: "bf-1",
      name: "Mix Veg Poha",
      tag: "Breakfast Special",
      price: "₹120",
      image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80",
      itemRef: menuItems.find(i => i.id === "bf-1")
    },
    {
      id: "mj-5",
      name: "Blue Lagoon Mojito",
      tag: "Cooler",
      price: "₹120",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
      itemRef: menuItems.find(i => i.id === "mj-5")
    },
    {
      id: "ps-4",
      name: "Mix Sauce Pasta",
      tag: "Cheesy & Spicy",
      price: "From ₹150",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      itemRef: menuItems.find(i => i.id === "ps-4")
    },
    {
      id: "bg-2",
      name: "Royal Paneer Burger",
      tag: "Grilled Special",
      price: "₹90",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      itemRef: menuItems.find(i => i.id === "bg-2")
    },
    {
      id: "ch-2",
      name: "Organic Masala Chai",
      tag: "Simmered Spices",
      price: "₹50",
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
      itemRef: menuItems.find(i => i.id === "ch-2")
    }
  ];

  // Auto carousel index for highlighted item
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bestsellers.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [bestsellers.length]);

  const activeItem = bestsellers[currentIndex];

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    if (item.itemRef) {
      addToCart(item.itemRef);
      setJustAddedId(item.id);
      setTimeout(() => setJustAddedId(null), 1200);
    }
  };

  return (
    <div className="w-full my-4 space-y-3">
      {/* 1. Moving Micro-Card (Spotlight Carousel) */}
      <div 
        onClick={() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="group relative bg-[#122e1f]/90 hover:bg-[#122e1f] backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-forest-600/70 shadow-lg cursor-pointer transition-all duration-300 hover:border-olive-400/50 hover:shadow-xl"
      >
        <div className="flex items-center gap-3.5">
          {/* Animated Moving Dish Photo with Glow */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-forest-950 shrink-0 border border-forest-600 shadow-md">
            <img
              key={activeItem.id}
              src={activeItem.image}
              alt={activeItem.name}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
            />
            {/* Pure Veg Badge on Image */}
            <div className="absolute top-1 left-1 bg-white/95 rounded p-0.5 shadow-xs">
              <span className="veg-badge scale-75">
                <span className="veg-dot"></span>
              </span>
            </div>
          </div>

          {/* Dish Information */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-olive-300 bg-forest-800/80 px-2 py-0.5 rounded-full border border-forest-700">
                <Sparkles className="w-2.5 h-2.5 text-olive-400 animate-spin" />
                <span>{activeItem.tag}</span>
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                • Tap to view
              </span>
            </div>

            <h4 className="font-serif text-base sm:text-lg font-bold text-white truncate group-hover:text-cream-200 transition-colors">
              {activeItem.name}
            </h4>

            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="font-serif font-bold text-sm text-olive-300">
                {activeItem.price}
              </span>

              {/* 1-Tap Add to Bag */}
              <button
                type="button"
                onClick={(e) => handleQuickAdd(e, activeItem)}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
                  justAddedId === activeItem.id
                    ? 'bg-olive-600 text-white'
                    : 'bg-cream-100 hover:bg-white text-forest-950 hover:scale-105 active:scale-95'
                }`}
              >
                {justAddedId === activeItem.id ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators / Mini Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-forest-800/80">
          {bestsellers.map((item, idx) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-6 bg-olive-400'
                  : 'w-1.5 bg-forest-700 hover:bg-forest-600'
              }`}
              aria-label={`Go to ${item.name}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Continuous Scrolling Photo Strip below */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max pb-1">
          <span className="text-[10px] uppercase font-bold text-olive-300 tracking-wider shrink-0 pr-1">
            Top Picks:
          </span>
          {bestsellers.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs transition-all border shrink-0 ${
                currentIndex === idx
                  ? 'bg-forest-800 text-white border-olive-400/50 shadow-sm'
                  : 'bg-forest-900/60 text-gray-300 hover:text-white border-forest-800/80 hover:bg-forest-800'
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-5 h-5 rounded-md object-cover"
              />
              <span className="font-medium text-[11px] truncate max-w-[120px]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
