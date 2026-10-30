/**
 * Divine Cafe - Central Configuration
 * 
 * Edit this file to update the cafe's contact details, address, opening hours,
 * or social links. Any changes here instantly reflect across the entire website.
 */

export const cafeConfig = {
  // Brand Identity
  brandName: "Divine Cafe",
  tagline: "You Are What You Eat",
  subTagline: "Pure Vegetarian Café & Sips",
  handle: "@DIVINECAFE",
  heroHeading: "Good Food. Great Mood.",
  heroDescription: "Step into our serene, cozy green sanctuary where every recipe is crafted with mindfulness, pure vegetarian ingredients, and heartfelt care. Handcrafted thin-crust pizzas, comforting brews, gourmet sandwiches, and refreshing coolers await you.",

  // Contact & WhatsApp Ordering
  // Dual-number setup: Developer / Testing Desk & Owner Counter Desk
  isWhatsappProvided: true,
  whatsappNumber: "917888655097", // Developer primary for testing
  
  // Dual Numbers for Slip Cutting & Kitchen Orders
  desks: {
    primary: {
      id: "primary",
      label: "Developer / Billing Desk",
      shortLabel: "Desk 1 (Developer)",
      number: "917888655097",
      display: "+91 78886 55097",
      description: "Direct slip cutting & developer testing"
    },
    secondary: {
      id: "secondary",
      label: "Counter / Alternate Desk",
      shortLabel: "Desk 2 (Owner)",
      number: "919988959413",
      display: "+91 99889 59413",
      description: "Direct slip cutting & main billing"
    }
  },

  // Phone / Calling
  isPhoneProvided: true,
  phoneNumber: "+91 78886 55097",
  secondaryPhoneNumber: "+91 99889 59413",

  // Address & Google Maps
  isAddressProvided: true,
  address: {
    line1: "Mall Rd, inside Baradari Garden",
    line2: "Opposite PEER BABA JI DARGAH, Lahori Gate",
    city: "Patiala",
    state: "Punjab",
    pincode: "147001",
    country: "India",
    fullFormattedAddress: "Mall Rd, inside Baradari Garden, opposite PEER BABA JI DARGAH, Lahori Gate, Patiala, Punjab 147001, India",
    // 100% reliable embed for DIVINE ORGANICS
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=DIVINE+ORGANICS+Baradari+Garden+Patiala&t=&z=16&ie=UTF8&iwloc=&output=embed",
    // Official Place profile provided by owner
    placeUrl: "https://www.google.com/maps/place/DIVINE+ORGANICS/@30.3335748,76.3975063,17z/data=!4m6!3m5!1s0x39102986b45b6a37:0xf4b370ffbed234bf!8m2!3d30.3335748!4d76.4000812!16s%2Fg%2F11zx6f70b8",
    // 1-click directions directly to DIVINE ORGANICS
    directionsUrl: "https://www.google.com/maps/dir//DIVINE+ORGANICS,+Mall+Rd,+inside+Baradari+Garden,+opposite+PEER+BABA+JI+DARGAH,+Lahori+Gate,+Patiala,+Punjab+147001/@30.3335748,76.4000812,17z"
  },

  // Kitchen & Counter Live Orders Dashboard
  kitchen: {
    pin: "1470", // 4-digit PIN for Owner / Staff login to view live slips
    autoSoundAlert: true,
    // Optional: Firebase Realtime Database URL for multi-device cloud sync
    // e.g. "https://your-cafe-orders-default-rtdb.firebaseio.com"
    firebaseDbUrl: "",
    soundEnabledDefault: true
  },

  // Operating Hours (Kept uninvented / placeholder until provided)
  isHoursProvided: false,
  hours: {
    days: "Monday – Sunday",
    timings: "Timings upon confirmation"
  },

  // Social Links
  // Note: Cafe currently has NO Instagram profile. Strictly null to avoid broken/fake links.
  socialLinks: {
    instagram: null, // Set to URL when official account is created
    facebook: null,
    twitter: null
  },

  // Food & Beverage Highlights (100% true to Divine Cafe's authentic menu)
  highlights: [
    {
      title: "100% Pure Vegetarian",
      description: "Every preparation is strictly vegetarian, wholesome, and prepared with love.",
      icon: "Leaf"
    },
    {
      title: "In-House Pizza Dough & Sauces",
      description: "Handcrafted thin-crust pizzas with fresh dough and signature sauces prepared in-house.",
      icon: "Pizza"
    },
    {
      title: "Wholesome & Energizing",
      description: "From sprouted salads and organic cheela to wholesome shakes and herbal infusions.",
      icon: "Heart"
    },
    {
      title: "Cozy Café Ambience",
      description: "A calming green-and-cream atmosphere designed for relaxed conversations and good food.",
      icon: "Coffee"
    }
  ],

  // Menu Ambiguities Flagged for Owner Confirmation
  menuClarifications: [
    {
      item: "PA ER MAKHANI Pizza",
      issue: "Scan shows missing letters due to print smudge ('PA ER MAKHANI').",
      presumedValue: "Paneer Makhani (Small ₹240 / Medium ₹400)"
    },
    {
      item: "Margherita Pizza Description",
      issue: "Menu print repeats 'Seeds, beans, or grains tossed with fresh vegetables, herbs, and a light dressing' (sprouted salad text).",
      presumedValue: "Owner confirmation recommended for true description (e.g., 'Classic Italian tomato sauce, mozzarella cheese, and fresh basil')."
    },
    {
      item: "Tandoori Nacho's Description",
      issue: "Menu printed description repeats 'Seeds, beans, or grains tossed with fresh vegetables, herbs, and a light dressing'.",
      presumedValue: "Owner confirmation recommended for true nachos topping/sauces."
    },
    {
      item: "White Sauce Pasta typo",
      issue: "Menu reads 'Extra creamy white sauce pasta whith cheese and herbs'.",
      presumedValue: "Polished to 'with cheese and herbs'."
    }
  ]
};
