import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill progress bar over 1.4s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    // Trigger fade-out after 1.6s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1600);

    // Completely unmount after 2.1s
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2100);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 bg-[#0B1E14] text-white cursor-pointer select-none transition-all duration-500 ease-out overflow-hidden ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="App Splash Screen - Tap to enter"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-olive-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* Subtle organic radial grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d5dcc3_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Top Bar Hint */}
      <div className="w-full pt-4 flex justify-between items-center text-[11px] text-cream-200/50 uppercase tracking-widest font-mono">
        <span>Baradari Garden</span>
        <span className="text-[10px] text-olive-300/80 bg-forest-900/60 px-2 py-0.5 rounded-full border border-forest-700/50">
          Tap to skip
        </span>
      </div>

      {/* Center Cinematic Emblem & Typography */}
      <div className="flex flex-col items-center text-center max-w-sm px-4 space-y-6 animate-in zoom-in-95 fade-in duration-700">
        
        {/* Glowing Logo Medallion */}
        <div className="relative">
          {/* Outer Pulsing Aura */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-olive-400/30 via-emerald-500/20 to-olive-400/30 blur-md animate-pulse" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-forest-800 to-[#0e271b] border-2 border-olive-400/50 shadow-2xl flex items-center justify-center p-4">
            {/* SVG Steam + Leaf Emblem */}
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
              {/* Animated Steam */}
              <path d="M40 25 C42 18 38 12 40 5" stroke="#F5E6B3" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
              <path d="M50 22 C52 14 48 8 50 2" stroke="#F5E6B3" strokeWidth="2.8" strokeLinecap="round" className="animate-pulse" style={{ animationDuration: '1.8s' }} />
              <path d="M60 25 C62 18 58 12 60 5" stroke="#F5E6B3" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDuration: '1.6s' }} />
              
              {/* Cup */}
              <path d="M25 40 L75 40 C72 65 65 80 50 82 C35 80 28 65 25 40 Z" fill="#FAF8F5" />
              <path d="M74 48 C85 48 85 65 72 70" stroke="#FAF8F5" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="50" cy="85" rx="35" ry="5" fill="#D4AF37" />

              {/* Sprout in center */}
              <path d="M50 50 C45 35 55 35 50 50 Z" fill="#84CC16" />
              <path d="M50 62 C43 52 57 52 50 62 Z" fill="#65A30D" />
            </svg>
          </div>
        </div>

        {/* Brand Name with Gold Shimmer */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-amber-100 to-white">
            {cafeConfig.brandName}
          </h1>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-forest-900/80 border border-forest-700/70 text-olive-300 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-olive-400 animate-ping" />
            <span>Pure Vegetarian Café</span>
          </div>

          <p className="font-serif italic text-sm text-cream-200/90 pt-1 tracking-wide">
            "{cafeConfig.tagline}"
          </p>
        </div>

      </div>

      {/* Bottom Loading Progress Line */}
      <div className="w-full max-w-xs pb-4 space-y-2">
        <div className="w-full h-1 bg-forest-900/90 rounded-full overflow-hidden border border-forest-800/60">
          <div
            className="h-full bg-gradient-to-r from-olive-400 to-emerald-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(163,230,53,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-cream-300/60 font-mono tracking-wider">
          <span>Preparing fresh recipes</span>
          <span>{progress}%</span>
        </div>
      </div>

    </div>
  );
}
