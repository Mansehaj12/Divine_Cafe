import React from 'react';
import { Leaf, Pizza, Heart, Coffee, Sparkles, ChefHat } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

const iconMap = {
  Leaf: Leaf,
  Pizza: Pizza,
  Heart: Heart,
  Coffee: Coffee
};

export default function Highlights() {
  return (
    <section id="highlights" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-cream-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-forest-700 bg-forest-100/60 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Our Kitchen Values
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
            Crafted with Care & Pure Ingredients
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
            At Divine Cafe, we believe food should nourish your body and brighten your mood. Every item is 100% vegetarian, made fresh to order.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cafeConfig.highlights.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-cream-300/70 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 mb-5 group-hover:bg-forest-800 group-hover:text-cream-100 transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-forest-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Notice of Pure Vegetarian Commitment */}
        <div className="mt-10 sm:mt-12 bg-forest-900 rounded-2xl p-6 sm:p-8 text-cream-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-forest-800">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-forest-800 border border-forest-700 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <span className="veg-badge scale-125">
                <span className="veg-dot"></span>
              </span>
            </div>
            <div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
                100% Vegetarian Kitchen
              </h4>
              <p className="text-xs sm:text-sm text-cream-300 mt-0.5">
                No meat, fish, or eggs. Wholesome vegetarian comfort prepared in clean, hygienic surroundings.
              </p>
            </div>
          </div>
          <a
            href="#menu"
            className="shrink-0 px-6 py-2.5 rounded-full bg-cream-100 hover:bg-white text-forest-950 font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            Browse All Categories
          </a>
        </div>

      </div>
    </section>
  );
}
