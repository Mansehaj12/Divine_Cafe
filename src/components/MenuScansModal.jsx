import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, FileText, CheckCircle2 } from 'lucide-react';
import { menuCards } from '../data/menuData';

export default function MenuScansModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentCard = menuCards[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? menuCards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === menuCards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#143826] text-cream-100 flex items-center justify-between border-b border-forest-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-olive-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                Official Menu Scans ({currentIndex + 1} of {menuCards.length})
              </h3>
              <p className="text-xs text-olive-200 font-light truncate max-w-[200px] sm:max-w-md">
                {currentCard.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-forest-800 text-cream-200 hover:text-white hover:bg-forest-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Viewer Area */}
        <div className="flex-1 overflow-auto bg-gray-950 p-2 sm:p-6 flex items-center justify-center min-h-[300px] relative">
          <img
            src={currentCard.image}
            alt={currentCard.title}
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
          />

          {/* Previous / Next Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all"
            aria-label="Previous menu scan"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all"
            aria-label="Next menu scan"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnails Footer */}
        <div className="p-3 sm:p-4 bg-cream-100/90 border-t border-cream-300 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 mx-auto">
            {menuCards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentIndex === idx
                    ? 'bg-forest-900 text-cream-100 shadow-sm font-semibold'
                    : 'bg-white hover:bg-cream-200 text-forest-900 border border-cream-300'
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
