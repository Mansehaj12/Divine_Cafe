import React, { useState, useMemo } from 'react';
import { Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import { menuCategories, menuItems } from '../data/menuData';
import MenuItemCard from './MenuItemCard';

export default function DigitalMenu({ 
  activeCategory: controlledActiveCategory,
  onSelectCategory: setControlledActiveCategory
}) {
  const [internalCategory, setInternalCategory] = useState("all");
  const activeCategory = controlledActiveCategory !== undefined ? controlledActiveCategory : internalCategory;
  const setActiveCategory = setControlledActiveCategory || setInternalCategory;

  const [searchQuery, setSearchQuery] = useState("");

  // Categories list excluding 'all'
  const realCategories = useMemo(() => {
    return menuCategories.filter(c => c.id !== "all");
  }, []);

  // Filtered items when searching
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="veg-badge"><span className="veg-dot"></span></span>
            <span>100% Vegetarian Digital Menu</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight">
            Our Handcrafted Menu
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            Sourced directly from our authentic kitchen menu cards. Handcrafted dough, fresh ingredients, and pure vegetarian recipes.
          </p>
        </div>

        {/* Search Bar only - NO horizontal category buttons as requested */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g., Poha, Makhani, Cheesy Cream, Hot Coffee)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-cream-300 text-sm text-forest-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-600/40 focus:border-forest-600 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 1. Search Results View */}
        {searchedItems ? (
          <div>
            <div className="mb-6 pb-3 border-b border-cream-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-forest-950">
                Found {searchedItems.length} dish{searchedItems.length !== 1 ? 'es' : ''} for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-forest-700 hover:text-forest-900 font-medium"
              >
                Reset Search
              </button>
            </div>

            {searchedItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                {searchedItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-cream-300/80 p-8">
                <p className="font-serif text-xl font-bold text-forest-950">No items found</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  We couldn't find any dishes matching "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-5 py-2 rounded-full bg-forest-800 text-cream-100 text-xs font-semibold"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        ) : activeCategory !== "all" ? (
          /* 2. Single Category Filter View (when selected via floating Menu button) */
          <div>
            {(() => {
              const currentCat = menuCategories.find(c => c.id === activeCategory);
              const items = menuItems.filter(i => i.categoryId === activeCategory);
              return (
                <div>
                  <div className="mb-6 pb-4 border-b border-cream-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                          {currentCat?.name || "Category"}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-semibold">
                          {items.length} items
                        </span>
                      </div>
                      {currentCat?.subtitle && (
                        <p className="text-xs text-olive-700 font-medium italic mt-1">
                          ★ {currentCat.subtitle}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveCategory("all")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-cream-100 text-forest-900 border border-cream-300 text-xs font-semibold shadow-xs self-start sm:self-auto transition-all"
                    >
                      <span>← Show Full Menu (All Categories)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* 3. Full Flowing Menu Grouped by Category */
          <div className="space-y-12 sm:space-y-16">
            {realCategories.map((category) => {
              const catItems = menuItems.filter(i => i.categoryId === category.id);
              if (catItems.length === 0) return null;

              return (
                <div 
                  key={category.id} 
                  id={`category-${category.id}`} 
                  className="scroll-mt-28"
                >
                  {/* Category Header */}
                  <div className="mb-5 pb-3 border-b border-cream-300/80 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 flex items-center gap-2">
                        <span>{category.name}</span>
                        <span className="text-xs font-sans font-medium text-gray-400">
                          ({catItems.length})
                        </span>
                      </h3>
                      {category.subtitle && (
                        <p className="text-xs text-olive-700 font-medium italic mt-0.5">
                          ★ {category.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

            {/* Category Items Grid (Clean 2-Column Desktop, 1-Column Mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
              {catItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
