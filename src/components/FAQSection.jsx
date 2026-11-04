import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Leaf, MapPin, Sparkles } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

const FAQS = [
  {
    id: 'pure-veg',
    question: 'Is Divine Cafe 100% pure vegetarian?',
    answer:
      'Yes, absolutely. Our entire kitchen is strictly 100% pure vegetarian. Every pizza dough, gourmet sauce, salad, and beverage is prepared fresh with mindful, wholesome vegetarian ingredients.'
  },
  {
    id: 'location-entry',
    question: 'Where is Divine Cafe located inside Baradari Garden?',
    answer:
      'We are situated on Mall Road, inside Baradari Garden, opposite Peer Baba Ji Dargah near Lahori Gate, Patiala (Punjab 147001). Click the "Visit Us" link in navigation for exact 1-click Google Maps driving and walking directions.'
  },
  {
    id: 'ordering-process',
    question: 'How do I place an order for Dine-In or Takeaway?',
    answer:
      'You can browse our full 52-dish digital menu online, select your items, and send your order directly to our team via WhatsApp. When dining at the café, simply scan the table QR standee to select your table number and order instantly without waiting.'
  },
  {
    id: 'bestsellers',
    question: 'What are your signature bestsellers and specialties?',
    answer:
      'Our guests highly recommend our handcrafted thin-crust Farm Fresh Pizza, Paneer Makhani Pizza, Crispy Paneer Wrap, Double Decker Burger, artisan Cold Coffee, and comforting Adrak/Elaichi Chai.'
  },
  {
    id: 'events-bookings',
    question: 'Can I host small gatherings, birthdays, or place bulk orders?',
    answer:
      'Yes! We welcome intimate celebrations, family get-togethers, and kitty parties. Message us directly on WhatsApp or call +91 99889 59413 to discuss customized food arrangements and seating.'
  }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState('pure-veg');

  const toggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] border-t border-forest-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/10 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-forest-700" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-forest-700/80 max-w-xl mx-auto">
            Everything you need to know about our pure vegetarian café, Baradari Garden location, and ordering experience.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-cream-200 shadow-sm transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-forest-900 pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? 'bg-forest-900 text-white rotate-180' : 'bg-cream-100 text-forest-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-forest-800/85 leading-relaxed border-t border-cream-100 mt-2 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-[#143826] text-cream-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-forest-950/10">
          <div>
            <h4 className="font-serif text-lg font-bold text-white">Still have a question?</h4>
            <p className="text-xs text-cream-200/80 mt-1">Our team is happy to assist you directly on WhatsApp or over a quick call.</p>
          </div>
          <a
            href={`https://wa.me/${cafeConfig.whatsappNumber}?text=Hi%20Divine%20Cafe,%20I%20have%20a%20question%20about%20your%20cafe`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-full bg-cream-50 text-forest-950 text-xs font-bold hover:bg-white transition shadow-sm"
          >
            Chat on WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
}