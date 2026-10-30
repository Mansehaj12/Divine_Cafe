import React, { useState } from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { menuItems } from '../data/menuData';
import { useCart } from '../context/CartContext';

export default function PopularPicks() {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState({});

  // Curated sample of featured items across diverse categories
  const featuredItems = menuItems.filter(item => item.isPopular);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section id="favourites" className="py-16 sm:py-20 bg-white border-b border-cream-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-olive-700 bg-olive-50 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-olive-200/60">
              Handpicked Selections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Customer Favourites
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 font-normal">
              A curated selection of beloved café dishes, thin-crust specials, and comforting sips.
            </p>
          </div>

          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-800 hover:text-forest-600 transition-colors"
          >
            <span>View Complete Menu (52 Items)</span>
            <span>→</span>
          </a>
        </div>

        {/* Popular Picks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredItems.map((item) => {
            const hasMultipleSizes = Boolean(item.sizes && item.sizes.length > 1);
            const defaultPrice = hasMultipleSizes ? item.sizes[0].price : item.price;
            const isAdded = addedIds[item.id];

            return (
              <div
                key={item.id}
                className="group flex flex-col bg-cream-50/50 rounded-2xl overflow-hidden border border-cream-300/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-cream-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      if (item.fallbackImage) {
                        e.currentTarget.src = item.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  {/* Pure Veg indicator top left */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                    <span className="veg-badge"><span className="veg-dot"></span></span>
                    <span className="text-[10px] font-semibold text-forest-900 tracking-wide">Pure Veg</span>
                  </div>

                  {/* Price Tag top right */}
                  <div className="absolute top-3 right-3 bg-forest-900/90 text-cream-100 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-xs font-bold font-serif tracking-tight border border-forest-700/60">
                    {hasMultipleSizes ? `From ₹${defaultPrice}` : `₹${defaultPrice}`}
                  </div>

                  {/* Category tag bottom left */}
                  {item.tags && item.tags[0] && (
                    <div className="absolute bottom-3 left-3 bg-black/50 text-white backdrop-blur-sm text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium">
                      {item.tags[0]}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-forest-950 group-hover:text-forest-800 transition-colors">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-gray-600 font-light line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Size Choices Notice or Quick Add */}
                  <div className="mt-4 pt-3 border-t border-cream-200/80 flex items-center justify-between">
                    <div>
                      {hasMultipleSizes ? (
                        <span className="text-[11px] text-gray-500 font-medium">
                          Sizes: {item.sizes.map(s => `${s.label} ₹${s.price}`).join(' • ')}
                        </span>
                      ) : (
                        <span className="text-sm font-serif font-bold text-forest-900">
                          ₹{item.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(item)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isAdded
                          ? 'bg-olive-600 text-white'
                          : 'bg-forest-800 hover:bg-forest-700 text-cream-100 shadow-sm active:scale-95'
                      }`}
                      title="Add to WhatsApp Order Bag"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
