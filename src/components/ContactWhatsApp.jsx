import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, ShoppingBag, Leaf } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';
import { useCart } from '../context/CartContext';

export default function ContactWhatsApp() {
  const { cart, totalCount, totalAmount, getWhatsAppMessage, setIsDrawerOpen } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [targetDesk, setTargetDesk] = useState("primary");
  const [submitted, setSubmitted] = useState(false);

  const isConfigured = cafeConfig.isWhatsappProvided;

  const handleSendEnquiry = (e) => {
    e.preventDefault();

    if (!isConfigured) {
      alert("WhatsApp number is not configured.");
      return;
    }

    const desk = cafeConfig.desks?.[targetDesk] || {
      number: cafeConfig.whatsappNumber,
      label: "Billing Desk"
    };

    let messageText = `Hi Divine Cafe! I am visiting your website.\n\n*Name:* ${customerName || 'Guest'}\n*Enquiry:* ${customerNote || 'General enquiry'}`;
    if (cart.length > 0) {
      messageText = decodeURIComponent(getWhatsAppMessage(`Customer: ${customerName}\n${customerNote}`));
    }

    const whatsappUrl = `https://wa.me/${desk.number}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#143826] text-cream-100 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-olive-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/90 border border-forest-600/60 text-olive-300 text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect Directly</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Have a Question or Craving? Reach Out.
            </h2>

            <p className="text-sm sm:text-base text-cream-200/90 font-light leading-relaxed">
              Whether you want to enquire about today's fresh specials, check group dining availability, or ask about ingredients, we are just a message away.
            </p>

            {/* Quick Feature Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-cream-200">
                <CheckCircle2 className="w-4 h-4 text-olive-400 shrink-0" />
                <span>Instant WhatsApp communication with café staff</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-cream-200">
                <CheckCircle2 className="w-4 h-4 text-olive-400 shrink-0" />
                <span>Quickly curate your favourite items and send order enquiries</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-cream-200">
                <CheckCircle2 className="w-4 h-4 text-olive-400 shrink-0" />
                <span>Honest, pure vegetarian culinary preparations</span>
              </div>
            </div>

            {/* Bag Status Summary Banner if user added items */}
            {totalCount > 0 && (
              <div className="p-4 rounded-2xl bg-forest-800/80 border border-forest-600/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-olive-300">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {totalCount} item{totalCount > 1 ? 's' : ''} in your Order Bag
                    </p>
                    <p className="text-[11px] text-cream-300">
                      Total: ₹{totalAmount}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-cream-100 hover:bg-white text-forest-950 font-bold text-xs transition-all shadow-sm"
                >
                  Review Items
                </button>
              </div>
            )}

            {/* Config notice if WhatsApp is in placeholder mode */}
            {!isConfigured && (
              <div className="p-3.5 rounded-xl bg-forest-900/90 border border-forest-700/80 text-[11px] text-olive-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Config Note:</strong> WhatsApp ordering is configured and ready. When the owner provides their phone number, adding it to <code className="bg-forest-950 px-1 py-0.5 rounded text-white">src/data/cafeConfig.js</code> will instantly activate 1-click WhatsApp messaging.
                </span>
              </div>
            )}
          </div>

          {/* Right Interactive Form Box */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 text-forest-950 shadow-2xl border border-cream-200">
            <h3 className="font-serif text-2xl font-bold text-forest-950 mb-1">
              Start a WhatsApp Enquiry
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Fill in your query below and tap to open WhatsApp with your pre-formatted note.
            </p>

            <form onSubmit={handleSendEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Ananya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/40 text-forest-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Your Enquiry or Custom Request
                </label>
                <textarea
                  rows="3"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={
                    cart.length > 0
                      ? "Any customization or instructions for your order enquiry..."
                      : "Ask about timings, directions, or party requirements..."
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/40 text-forest-950 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
                  Send Enquiry / Order To
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetDesk('primary')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      targetDesk === 'primary'
                        ? 'bg-[#143826] text-white border-[#143826]'
                        : 'bg-cream-50 text-gray-700 border-cream-300 hover:border-forest-600'
                    }`}
                  >
                    <div className="text-xs font-bold">👤 Desk 1 (Owner)</div>
                    <div className={`text-[10px] ${targetDesk === 'primary' ? 'text-olive-200' : 'text-gray-500'}`}>
                      +91 99889 59413
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetDesk('secondary')}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      targetDesk === 'secondary'
                        ? 'bg-[#143826] text-white border-[#143826]'
                        : 'bg-cream-50 text-gray-700 border-cream-300 hover:border-forest-600'
                    }`}
                  >
                    <div className="text-xs font-bold">🛎️ Desk 2 (Counter)</div>
                    <div className={`text-[10px] ${targetDesk === 'secondary' ? 'text-olive-200' : 'text-gray-500'}`}>
                      +91 98143 77760
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Bag attachment reminder */}
              {cart.length > 0 ? (
                <div className="text-[11px] text-forest-800 bg-forest-50 p-2.5 rounded-lg border border-forest-200 flex items-center justify-between">
                  <span>✓ Your {totalCount} selected dishes will be automatically attached!</span>
                  <span className="font-bold">₹{totalAmount}</span>
                </div>
              ) : (
                <div className="text-[11px] text-gray-500 bg-cream-100/60 p-2.5 rounded-lg">
                  💡 Tip: You can also add items from our digital menu above to send a complete order enquiry!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#1b4931] hover:bg-[#143826] text-cream-100 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <Send className="w-4 h-4 text-olive-300" />
                <span>
                  {cart.length > 0
                    ? `Send Order Enquiry via WhatsApp (₹${totalAmount})`
                    : "Send Enquiry via WhatsApp"}
                </span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
