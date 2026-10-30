import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/useCart';

export default function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const hasMultipleSizes = Boolean(item.sizes && item.sizes.length > 1);
  const [selectedSize, setSelectedSize] = useState(
    hasMultipleSizes ? item.sizes[0].label : null
  );
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);

  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  // Compute active price
  const activePrice = hasMultipleSizes
    ? item.sizes.find(s => s.label === selectedSize)?.price || item.sizes[0].price
    : item.price;

  const handleAdd = () => {
    addToCart(item, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex items-start justify-between gap-4">
      
      {/* Left Column: Food Details (Veg Icon, Title, Price, Description, Size Selector) */}
      <div className="flex-1 min-w-0 flex flex-col justify-start">
        
        {/* Pure Veg Green Icon (Standard Indian FSSAI symbol) */}
        <div className="flex items-center gap-2 mb-1">
          <span className="veg-badge scale-90">
            <span className="veg-dot"></span>
          </span>
          {item.isPopular && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-olive-700 bg-olive-50 px-2 py-0.5 rounded-full border border-olive-200/60">
              Popular Pick
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h4 className="font-serif text-base sm:text-lg font-bold text-forest-950 leading-snug">
          {item.name}
        </h4>

        {/* Price */}
        <div className="text-sm sm:text-base font-serif font-bold text-forest-900 mt-0.5">
          ₹{activePrice}
        </div>

        {/* Description strictly from menu */}
        {item.description && (
          <p className="mt-1 text-xs text-gray-500 font-light leading-relaxed line-clamp-2 pr-2">
            {item.description}
          </p>
        )}

        {/* Size Selector Pills (if item has multiple sizes) */}
        {hasMultipleSizes && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {item.sizes.map((size) => {
              const isSelected = selectedSize === size.label;
              return (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size.label)}
                  className={`px-2.5 py-0.5 text-xs rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-forest-800 text-white font-semibold shadow-xs'
                      : 'bg-cream-100/80 text-forest-900 hover:bg-cream-200 border border-cream-200'
                  }`}
                >
                  <span>{size.label}</span>
                  <span className="ml-1 opacity-75 text-[10px]">₹{size.price}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Dish Image + Overlapping ADD Button (Swiggy / Zomato Style) */}
      <div className="relative shrink-0 flex flex-col items-center">
        {/* Dish Photo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 shadow-xs">
          <img
            src={imgSrc}
            alt={item.name}
            onError={() => {
              if (item.fallbackImage && imgSrc !== item.fallbackImage) {
                setImgSrc(item.fallbackImage);
              }
            }}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Floating Overlapping ADD Button */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 w-[88px] sm:w-[96px]">
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md border transition-all active:scale-95 flex items-center justify-center gap-1 ${
              justAdded
                ? 'bg-forest-800 text-white border-forest-900'
                : 'bg-white text-forest-800 hover:bg-forest-50 border-cream-300 hover:border-forest-600'
            }`}
            title="Add to WhatsApp Order Bag"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-olive-300" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <span>ADD</span>
                <Plus className="w-3.5 h-3.5 text-forest-700" />
              </>
            )}
          </button>
        </div>

        {/* "Customisable" subtle note below the button if multiple sizes */}
        {hasMultipleSizes && (
          <span className="text-[10px] text-gray-400 mt-3 font-medium">
            Customisable
          </span>
        )}
      </div>

    </div>
  );
}
