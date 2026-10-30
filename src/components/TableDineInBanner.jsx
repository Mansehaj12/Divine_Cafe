import React, { useState } from 'react';
import { UtensilsCrossed, ShoppingBag, Edit3, X, Check } from 'lucide-react';
import { useCart } from '../context/useCart';

export default function TableDineInBanner() {
  const { tableNumber, updateTableNumber, diningMode, updateDiningMode } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(tableNumber || '');

  const handleSave = (e) => {
    e?.preventDefault();
    updateTableNumber(inputVal);
    setIsEditing(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#1b3f2c] text-cream-100 border-b border-forest-700/60 text-xs py-2 px-4 shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-olive-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-olive-400"></span>
            </span>

            {diningMode === 'dine-in' ? (
              <div className="flex items-center gap-1.5 truncate">
                <UtensilsCrossed className="w-3.5 h-3.5 text-olive-300 shrink-0" />
                <span className="text-gray-300">Dining In:</span>
                <span className="font-bold text-white tracking-wide">
                  {tableNumber ? `Table #${tableNumber}` : 'Table not set'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 truncate">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="font-bold text-white tracking-wide">
                  Takeaway / Pickup Order
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {diningMode === 'dine-in' && (
              <button
                onClick={() => {
                  setInputVal(tableNumber || '');
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-800 hover:bg-forest-700 text-cream-200 hover:text-white border border-forest-600/60 text-[11px] font-medium transition-colors"
              >
                <Edit3 className="w-3 h-3 text-olive-300" />
                <span>{tableNumber ? 'Change Table' : 'Set Table #'}</span>
              </button>
            )}

            <button
              onClick={() => updateDiningMode(diningMode === 'dine-in' ? 'takeaway' : 'dine-in')}
              className="text-[11px] underline text-cream-300 hover:text-white transition-colors"
            >
              Switch to {diningMode === 'dine-in' ? 'Takeaway' : 'Dine-In'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Table Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-xs shadow-2xl border border-cream-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-forest-800" />
                <h3 className="font-serif text-base font-bold text-forest-950">
                  Select Your Table
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
              Enter the table number printed on your table tent or QR standee (1 - 99):
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value.slice(0, 2))}
                  placeholder="e.g. 4"
                  autoFocus
                  className="w-full text-center text-2xl font-bold font-serif py-3 rounded-xl border border-cream-300 bg-cream-50/50 text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* Quick Select Buttons */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5 text-center">
                  Quick Select
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setInputVal(String(num))}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        inputVal === String(num)
                          ? 'bg-forest-800 text-white border-forest-900 shadow-xs'
                          : 'bg-white hover:bg-cream-100 text-forest-950 border-cream-200'
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
                  className="flex-1 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-olive-300" />
                  <span>Confirm Table</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
