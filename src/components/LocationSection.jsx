import React from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink, CheckCircle2 } from 'lucide-react';
import { cafeConfig } from '../data/cafeConfig';

export default function LocationSection() {
  const isConfigured = cafeConfig.isAddressProvided;

  return (
    <section id="location" className="py-16 sm:py-24 bg-white border-b border-cream-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-olive-700 bg-olive-50 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-olive-200/60">
            Come Dine With Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
            Visit Divine Cafe
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
            Experience our cozy café ambience in person. Wholesome bites, relaxing atmosphere, and friendly warmth.
          </p>
        </div>

        {/* Location Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Information Card */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-cream-300/80 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[11px] font-semibold mb-2">
                  <CheckCircle2 className="w-3 h-3 text-olive-600" />
                  <span>Google Maps Location Verified</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest-950">
                  {cafeConfig.brandName}
                </h3>
                <p className="text-xs text-olive-700 font-medium uppercase tracking-wider mt-0.5">
                  {cafeConfig.tagline}
                </p>
              </div>

              {/* Address Block */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-cream-200">
                <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-olive-300" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Café Location
                  </h4>
                  <div className="text-sm text-forest-950 font-medium mt-1 space-y-0.5">
                    <p className="font-semibold text-forest-900">{cafeConfig.address.line1}</p>
                    <p className="text-xs text-gray-700 font-normal">{cafeConfig.address.line2}</p>
                    <p className="text-xs text-forest-800 font-medium">{cafeConfig.address.city}, {cafeConfig.address.state} {cafeConfig.address.pincode}</p>
                  </div>
                  <a
                    href={cafeConfig.address.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-olive-700 hover:text-olive-900 font-semibold mt-2.5 group"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Opening Hours Block */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-cream-200">
                <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-olive-300" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Operating Hours
                  </h4>
                  {cafeConfig.isHoursProvided ? (
                    <div className="text-sm text-forest-950 font-medium mt-1">
                      <p>{cafeConfig.hours.days}</p>
                      <p className="text-xs text-gray-600">{cafeConfig.hours.timings}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 mt-1">
                      Open daily for breakfast, lunch, high-tea, and dinner.
                    </p>
                  )}
                </div>
              </div>

              {/* Phone / Contact if available */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-cream-200">
                <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-olive-300" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Direct Contact
                  </h4>
                  {cafeConfig.isPhoneProvided ? (
                    <a
                      href={`tel:${cafeConfig.phoneNumber}`}
                      className="text-sm text-forest-900 hover:text-forest-700 font-medium mt-1 block"
                    >
                      {cafeConfig.phoneNumber}
                    </a>
                  ) : (
                    <a
                      href="#contact"
                      className="text-xs text-forest-800 hover:text-forest-950 font-medium mt-1 block"
                    >
                      Connect via WhatsApp Enquiry below ↓
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Directions Action */}
            <div className="mt-8 pt-6 border-t border-cream-200 space-y-2">
              <a
                href={cafeConfig.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-forest-800 hover:bg-forest-700 text-cream-100 font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Navigation className="w-4 h-4 text-olive-300" />
                <span>Get Driving Directions</span>
              </a>
              <p className="text-[11px] text-center text-gray-400">
                Opens directly in Google Maps for live turn-by-turn navigation
              </p>
            </div>

          </div>

          {/* Interactive Map Visual Container */}
          <div className="lg:col-span-7 bg-cream-100 rounded-3xl overflow-hidden border border-cream-300/80 min-h-[400px] sm:min-h-[460px] flex flex-col relative shadow-md">
            
            {/* Embedded Map */}
            <div className="relative flex-1 w-full h-full min-h-[340px]">
              <iframe
                title="Divine Cafe Google Map"
                src={cafeConfig.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[340px] rounded-t-3xl"
              />

              {/* Overlay quick-launch action button */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <a
                  href={cafeConfig.address.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md text-forest-900 border border-cream-300 shadow-md hover:bg-white text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>

            {/* Bottom Map Bar with Live Directions */}
            <div className="bg-forest-900 text-cream-100 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-9 h-9 rounded-full bg-forest-800 flex items-center justify-center text-olive-300 shrink-0">
                  <MapPin className="w-5 h-5 text-olive-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white">Divine Cafe (Baradari Garden, Patiala)</p>
                  <p className="text-[11px] text-cream-300">Mall Rd, opposite Peer Baba Ji Dargah</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={cafeConfig.address.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-100 hover:bg-white text-forest-950 text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <span>Start Navigation</span>
                  <Navigation className="w-3.5 h-3.5 text-forest-800" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
