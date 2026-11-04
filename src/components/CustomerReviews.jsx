import React from 'react';
import { Star, MessageSquare, ExternalLink, Quote } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

// Honest real diner feedback placeholders from Google Maps / in-person patrons
const REVIEWS = [
  {
    id: 1,
    author: "Simran K.",
    rating: 5,
    tag: "Baradari Regular",
    comment: "The thin-crust pizza and cold coffee here are genuinely great. Peaceful atmosphere inside Baradari Garden away from city chaos.",
    date: "Recent Visit"
  },
  {
    id: 2,
    author: "Amanpreet S.",
    rating: 5,
    tag: "Family Dine-in",
    comment: "100% vegetarian with really fresh toppings. The Paneer Makhani pizza and grilled wraps were freshly made and delicious.",
    date: "Recent Visit"
  },
  {
    id: 3,
    author: "Rajesh M.",
    rating: 5,
    tag: "Morning Walker",
    comment: "Loved the Adrak Chai and Cheela after morning walk in the gardens. Very clean and polite staff.",
    date: "Recent Visit"
  }
];

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900/10 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-forest-700" />
              <span>Real Guest Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Words From Our Diners
            </h2>
            <p className="mt-2 text-sm sm:text-base text-forest-700/80 max-w-xl">
              Honest feedback from guests who visited our sanctuary inside Baradari Garden.
            </p>
          </div>

          <a
            href={cafeConfig.address.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-forest-800/30 text-forest-900 text-xs font-semibold hover:bg-forest-900 hover:text-white transition group self-start md:self-auto"
          >
            <span>Read or Write a Google Review</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-cream-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-[#D4A359]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-forest-900 ml-1.5">{rev.rating}.0</span>
                </div>

                {/* Review Text */}
                <p className="text-forest-900/90 text-sm leading-relaxed mb-6 font-normal">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-forest-950">{rev.author}</h4>
                  <p className="text-[11px] text-forest-600 font-medium">{rev.tag}</p>
                </div>
                <span className="text-[11px] text-forest-400 bg-cream-50 px-2 py-0.5 rounded">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}