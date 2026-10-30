import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle, HelpCircle, X } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

export default function OwnerNotesBadge({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-cream-300">
        
        {/* Header */}
        <div className="p-5 bg-[#143826] text-cream-100 flex items-center justify-between border-b border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Menu Data Audit & Owner Clarifications
              </h3>
              <p className="text-xs text-olive-200">
                Transparent verification of all 5 scanned menu sheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-forest-800 text-cream-200 hover:text-white hover:bg-forest-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-[#FAF7F2]">
          <p className="text-xs text-gray-600 leading-relaxed">
            During our precise digitization of the 5 scanned menu sheets, we flagged the following minor print/scanning ambiguities for owner confirmation:
          </p>

          <div className="space-y-3">
            {cafeConfig.menuClarifications.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white border border-cream-300/80 shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-forest-950">
                    {item.item}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Flagged for Review
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  <strong className="text-gray-700">Observed in Scan:</strong> {item.issue}
                </p>
                <p className="text-xs text-forest-900 bg-forest-50 p-2 rounded-lg border border-forest-100">
                  <strong className="text-forest-950">Current Website Handling:</strong> {item.presumedValue}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-forest-900 text-cream-100 text-xs space-y-1">
            <p className="font-bold text-white">✓ Central Data Structure:</p>
            <p className="text-cream-300">
              All items, prices, descriptions, and sizes reside in <code className="bg-forest-950 px-1.5 py-0.5 rounded text-olive-300">src/data/menuData.js</code> and cafe contact info in <code className="bg-forest-950 px-1.5 py-0.5 rounded text-olive-300">src/data/cafeConfig.js</code>, enabling instant updates at any time.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-cream-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-forest-800 text-cream-100 text-xs font-semibold hover:bg-forest-700 transition-colors"
          >
            Close Notes
          </button>
        </div>

      </div>
    </div>
  );
}
