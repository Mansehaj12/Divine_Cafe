import React from 'react';
import { ArrowDown, MapPin, Sparkles, Coffee, Utensils, HeartHandshake } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#143826] via-[#1a422e] to-[#234d36] text-cream-100">
      {/* Subtle organic background foliage ornaments */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d5dcc3_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Glow circles */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-olive-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-forest-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand & Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-800/80 border border-olive-400/30 text-olive-300 text-xs sm:text-sm font-medium tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-olive-400 animate-ping"></span>
              <span className="uppercase tracking-widest text-[11px] sm:text-xs">Vegetarian Café</span>
              <span className="text-forest-500">•</span>
              <span className="font-serif italic font-normal text-cream-200">"{cafeConfig.tagline}"</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-cream-300 font-semibold">
                Welcome to {cafeConfig.brandName}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                {cafeConfig.heroHeading}
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-cream-200/90 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {cafeConfig.heroDescription}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-cream-100 hover:bg-white text-forest-900 font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Our Menu</span>
                <ArrowDown className="w-4 h-4 text-forest-800" />
              </a>

              <a
                href="#location"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-forest-800/80 hover:bg-forest-700/90 text-cream-100 border border-forest-600/70 font-medium text-sm sm:text-base transition-all duration-200 hover:border-olive-400/50"
              >
                <MapPin className="w-4 h-4 text-olive-300" />
                <span>Find Us</span>
              </a>
            </div>

            {/* Quick offerings highlights ticker */}
            <div className="pt-6 border-t border-forest-700/60 grid grid-cols-3 gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg bg-forest-800/90 border border-forest-700 flex items-center justify-center text-olive-300 shrink-0">
                  <span className="veg-badge">
                    <span className="veg-dot"></span>
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Pure Veg</p>
                  <p className="text-[10px] sm:text-xs text-cream-300">100% Vegetarian</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg bg-forest-800/90 border border-forest-700 flex items-center justify-center text-olive-300 shrink-0">
                  <Utensils className="w-4 h-4 text-olive-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Thin Crust</p>
                  <p className="text-[10px] sm:text-xs text-cream-300">In-house dough</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg bg-forest-800/90 border border-forest-700 flex items-center justify-center text-olive-300 shrink-0">
                  <Coffee className="w-4 h-4 text-olive-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">Brews & Sips</p>
                  <p className="text-[10px] sm:text-xs text-cream-300">Chai & Coolers</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Large Appetising Food Photograph */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
              {/* Outer decorative ring reminiscent of the menu design */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-olive-400/30 animate-[spin_60s_linear_infinite]"></div>
              
              {/* Main Food Photo in circular presentation with glowing shadow */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl border-4 border-[#2d5646] group">
                <img
                  src="/dishes/pizza.jpg"
                  alt="Divine Cafe Artisan Thin Crust Pizza"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "/menu/WhatsApp Image 2026-10-28 at 2.36.16 PM.jpeg";
                  }}
                />
                
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent"></div>

                {/* Floating caption on image */}
                <div className="absolute bottom-6 left-6 right-6 text-center bg-forest-950/70 backdrop-blur-md py-2.5 px-4 rounded-full border border-forest-700/60">
                  <span className="text-xs font-medium text-cream-100 flex items-center justify-center gap-2">
                    <span className="veg-badge"><span className="veg-dot"></span></span>
                    <span>Handmade Thin-Crust Pizzas & Pastas</span>
                  </span>
                </div>
              </div>

              {/* Floating aesthetic pill 1: Tagline badge */}
              <div className="absolute -top-2 -right-2 sm:top-4 sm:right-0 bg-white/95 text-forest-900 px-4 py-2 rounded-2xl shadow-xl border border-cream-200 backdrop-blur-sm flex items-center gap-2 animate-bounce [animation-duration:4s]">
                <span className="text-xl">🌿</span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold leading-none">Philosophy</p>
                  <p className="text-xs font-serif font-bold text-forest-950">You Are What You Eat</p>
                </div>
              </div>

              {/* Floating aesthetic pill 2: Pure Veg Guarantee */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-6 sm:-left-4 bg-[#143826] text-cream-100 px-4 py-2.5 rounded-2xl shadow-xl border border-forest-600/80 backdrop-blur-sm flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-forest-800 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4 text-olive-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Good Food. Great Mood.</p>
                  <p className="text-[10px] text-olive-300 mt-0.5">Freshly prepared to order</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
