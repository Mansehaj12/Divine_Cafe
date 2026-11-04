import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function HeroBestsellerTicker() {
  const { openDishInMenu } = useCart();

  const bestsellers = [
    {
      id: "pz-3",
      categoryId: "thin-crust-pizzas",
      name: "Paneer Makhni Pizza",
      tag: "Customer Favorite",
      price: "From ₹240",
      description: "Onion, paneer, rich butter sauce & double cheese",
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1000&q=85"
    },
    {
      id: "bf-1",
      categoryId: "breakfast",
      name: "Mix Veg Poha",
      tag: "Breakfast Special",
      price: "₹120",
      description: "Tossed with colorful fresh vegetables & roasted nuts",
      image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=1000&q=85"
    },
    {
      id: "mj-5",
      categoryId: "mojito-drinks",
      name: "Blue Lagoon Mojito",
      tag: "Signature Cooler",
      price: "₹120",
      description: "Vibrant curacao flavor with bubbly citrus soda & lime",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85"
    },
    {
      id: "ps-4",
      categoryId: "pasta",
      name: "Mix Sauce Pasta",
      tag: "Cheesy & Spicy",
      price: "From ₹150",
      description: "Creamy white + tangy red mixed pink sauce",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=85"
    },
    {
      id: "bg-2",
      categoryId: "burgers",
      name: "Royal Paneer Burger",
      tag: "Grilled Special",
      price: "₹90",
      description: "Marinated grilled paneer slab with fresh veggies",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=85"
    },
    {
      id: "ch-2",
      categoryId: "chai-and-tea",
      name: "Organic Masala Chai",
      tag: "Simmered Spices",
      price: "₹50",
      description: "Whole spices, fresh ginger & aromatic cardamom",
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=85"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bestsellers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bestsellers.length]);

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? bestsellers.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % bestsellers.length);
  };

  const active = bestsellers[currentIndex];

  const handleOpenDish = () => {
    openDishInMenu(active.id, active.categoryId);
  };

  return (
    <div className="w-full my-4">
      {/* Big Visual Photo Slider — Clicking opens the exact dish on Menu */}
      <div 
        onClick={handleOpenDish}
        className="group relative w-full h-56 sm:h-64 md:h-72 rounded-3xl overflow-hidden shadow-2xl border-2 border-forest-600/70 cursor-pointer bg-forest-950 transition-all hover:border-olive-400"
        title={`View ${active.name} on menu`}
      >
        {/* Full-bleed Photo with Smooth Cross-fade Animation */}
        <img
          key={active.id}
          src={active.image}
          alt={active.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 animate-in fade-in zoom-in-95 duration-700"
          loading="eager"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Pure Veg Badge Top Left */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10">
          <span className="veg-badge scale-90">
            <span className="veg-dot"></span>
          </span>
          <span className="text-[11px] font-bold text-forest-950 uppercase tracking-wider">
            Pure Veg
          </span>
        </div>

        {/* Bestseller Category Tag Top Right */}
        <div className="absolute top-3 right-3 bg-forest-900/90 text-olive-300 border border-olive-400/40 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider z-10">
          <Sparkles className="w-3.5 h-3.5 text-olive-400" />
          <span>{active.tag}</span>
        </div>

        {/* Bottom Dish Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md truncate group-hover:text-olive-200 transition-colors">
              {active.name}
            </h3>
            <p className="text-xs text-cream-200/90 font-light mt-0.5 line-clamp-1 drop-shadow-sm">
              {active.description}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-serif font-bold text-base sm:text-xl text-olive-300 drop-shadow-md">
              {active.price}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDish();
              }}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/95 hover:bg-olive-500 text-cream-100 hover:text-forest-950 border border-olive-400/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <span>View on Menu</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Manual Left/Right Slide Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 z-20"
          aria-label="Previous bestseller photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 z-20"
          aria-label="Next bestseller photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Progress Dots at Bottom */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {bestsellers.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 bg-olive-400'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
