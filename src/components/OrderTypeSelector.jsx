import React, { useState } from 'react';
import { UtensilsCrossed, ShoppingBag, X, Check } from 'lucide-react';
import { useCart } from '../context/useCart';

export default function OrderTypeSelector() {
  const { tableNumber, updateTableNumber, diningMode, updateDiningMode } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(tableNumber || '');

  const handleSave = (e) => {
    e?.preventDefault();
    updateTableNumber(inputVal);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-1 sm:my-1.5">
      {/* Compact Half-Height Segmented Dual Box Switcher */}
      <div className="bg-[#122e1f]/95 p-1 rounded-xl border border-forest-700/80 shadow-sm grid grid-cols-2 gap-1">
        
        {/* BOX 1: DINE-IN */}
        <button
          type="button"
          onClick={() => {
            updateDiningMode('dine-in');
            if (!tableNumber) {
              setInputVal('');
              setIsEditing(true);
            }
          }}
          className={`relative py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            diningMode === 'dine-in'
              ? 'bg-[#1b4931] text-white shadow-xs border border-olive-400/40 ring-1 ring-olive-400/30'
              : 'text-gray-300 hover:text-white hover:bg-forest-900/50 border border-transparent'
          }`}
        >
          {diningMode === 'dine-in' && (
            <span className="w-1.5 h-1.5 rounded-full bg-olive-400 shrink-0 animate-pulse"></span>
          )}

          <UtensilsCrossed className={`w-3.5 h-3.5 shrink-0 ${diningMode === 'dine-in' ? 'text-olive-300' : 'text-gray-400'}`} />

          <div className="flex items-center gap-1 truncate text-left">
            <span className="font-bold text-xs">Dine-In</span>
            <span className="text-[10px] text-cream-200/90 font-medium">
              {tableNumber ? `#${tableNumber}` : '(Set #)'}
            </span>
            {diningMode === 'dine-in' && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setInputVal(tableNumber || '');
                  setIsEditing(true);
                }}
                className="text-[9px] underline text-olive-300 hover:text-white font-semibold cursor-pointer"
              >
                Edit
              </span>
            )}
          </div>
        </button>

        {/* BOX 2: TAKEAWAY */}
        <button
          type="button"
          onClick={() => updateDiningMode('takeaway')}
          className={`relative py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 ${
            diningMode === 'takeaway'
              ? 'bg-[#1b4931] text-white shadow-xs border border-olive-400/40 ring-1 ring-olive-400/30'
              : 'text-gray-300 hover:text-white hover:bg-forest-900/50 border border-transparent'
          }`}
        >
          {diningMode === 'takeaway' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse"></span>
          )}

          <ShoppingBag className={`w-3.5 h-3.5 shrink-0 ${diningMode === 'takeaway' ? 'text-amber-300' : 'text-gray-400'}`} />

          <div className="flex items-center gap-1 truncate text-left">
            <span className="font-bold text-xs">Takeaway</span>
            <span className="text-[10px] text-cream-200/80 font-normal hidden sm:inline">
              (Pickup)
            </span>
          </div>
        </button>

      </div>

      {/* Table Selection Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-xs shadow-2xl border border-cream-300 space-y-4 text-forest-950">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-forest-800" />
                <h3 className="font-serif text-base font-bold text-forest-950">
                  Select Table Number
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Enter or choose the table number where you are seated (1 - 99):
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value.slice(0, 2))}
                  placeholder="Table #"
                  autoFocus
                  className="w-full text-center text-3xl font-bold font-serif py-3 rounded-2xl border border-cream-300 bg-cream-50 text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* Quick Select Table Chips */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5 text-center">
                  Quick Select Table
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setInputVal(String(num))}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        inputVal === String(num)
                          ? 'bg-forest-800 text-white border-forest-900 shadow-sm'
                          : 'bg-white hover:bg-cream-100 text-forest-900 border-cream-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-olive-300" />
                  <span>Confirm Table Selection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
