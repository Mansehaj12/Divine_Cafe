# 🌿 Divine Cafe — "You Are What You Eat"

A premium, modern, installable Progressive Web Application (PWA) built for **Divine Cafe** — a conscious pure vegetarian café located inside **Baradari Garden, Patiala, Punjab**.

Designed with an aesthetic forest green & cream palette, mobile-first performance, 1-tap WhatsApp ordering, past order reordering, PWA home screen installation, and a cinematic app opening experience.

---

## 🚀 Live Website & Deployment
* **Live Web App:** [https://divinecafe-plum.vercel.app/](https://divinecafe-plum.vercel.app/)
* **GitHub Repository:** [https://github.com/Mansehaj12/Divine_Cafe](https://github.com/Mansehaj12/Divine_Cafe)

---

## ✨ Features & Architecture

### 1. 📱 Progressive Web App (PWA) — Install on Phone
* **Zero App Store Friction:** Customers can install Divine Cafe directly to their Android or iPhone home screen with 1 tap without downloading from the Play Store or App Store.
* **Full-Screen Native Feel:** Runs in standalone mode without browser address bars, with custom branding and smooth touch transitions.
* **Smart Device Detection:**
  * **Android / Chrome:** Native installation prompt with custom "Install App" bottom sheet.
  * **iPhone / iOS Safari:** Smart 2-step visual guidance (*Share ➔ Add to Home Screen*).
* **Offline Caching:** Powered by Service Worker (`sw.js`) and Web App Manifest (`manifest.json`) with high-resolution vector icon (`pwa-icon.svg`).

### 2. 🎬 Cinematic App Opening Splash Screen
* **Brand Aura:** Deep forest green backdrop with ambient glows and sacred organic motifs.
* **Animated Medallion:** Glowing tea cup with animated rising steam and vibrant green sprout emblem.
* **Brand Typography:** Gold-shimmer *"DIVINE CAFE"*, *"Pure Vegetarian Café"*, and signature motto *"You Are What You Eat"*.
* **Smart Progress Line:** Dynamic *"Preparing fresh recipes"* loading progress bar with instant **"Tap to skip"** option and session memory.

### 3. 🛍️ Seamless 1-Tap WhatsApp Ordering
* Orders are compiled into a formatted, structured WhatsApp message sent directly to Divine Cafe's official number:
  ```text
  *🍽️ DINE-IN ORDER - DIVINE CAFE*
  📍 *Table Number:* #3
  _“You Are What You Eat”_

  *Order Items:*
  1. *Farm Fresh Pizza (Medium)* × 1 = ₹250
  2. *Blue Lagoon Mojito* × 2 = ₹240

  *Total Amount:* ₹490
  *Special Instructions:* Please serve extra crispy!
  ```
* **Order Type Switcher:** Top bar pill toggle to switch between **Dine-In** (with table number) and **Takeaway** (counter pickup).

### 4. ⚡ Past Orders with 1-Tap Reorder
* Remembers customer's previous orders in `localStorage`.
* Customers can re-order their favorite meal in **1-Tap** without browsing through the menu again.
* View past order date, items, total price, and dining preference.

### 5. 📖 Dedicated Digital Menu (52 Pure Vegetarian Dishes)
* **13 Authentic Categories:**
  1. **Breakfast** — Mix Veg Poha, Organic Besan Cheela, Corn Masala Salad, Sprouted Salad, Tandoori Nachos
  2. **Smoothies** — Banana Nut Smoothie
  3. **Sandwiches** — Grilled, Cream Cold, Paneer Cheese & Corn, Pasta Pizza Sandwich
  4. **Thin-Crust Pizzas** — Handcrafted dough & sauces: Single Topping, Spicy Paneer, Paneer Makhni, Farm Fresh, Margherita, Cheesy Cream
  5. **Pasta** — White Sauce, Red Sauce, Tandoori Cream, Mix Sauce
  6. **Noodles & Maggi** — Classic Veggie Masala, Butter Garlic, Spicy Cheese & Corn, Makhani Paneer, Hakka Noodles, Chilli Garlic Noodles
  7. **Snacks** — French Fries, Spring Roll, Tandoori Momos
  8. **Burgers** — Classic Veggie Pattie, Royal Paneer Grilled, Spicy Salsa, Double Decker
  9. **Vegetarian Wraps** — Whole Wheat Grill Paneer, Whole Wheat Veg Crispy, Spicy Cheese & Corn, Crispy Paneer Wrap Makhani
  10. **Chai & Tea** — Organic CTC Tea, Organic Masala Chai, Organic Adrak Chai, Organic Elaichi Chai, Organic Jaggery Chai, Organic Rose Chai, Organic Green Tea, Lemon Tea, Haldi Milk
  11. **Coffee** — Hot Coffee, Caramel Hot Coffee, Hot Chocolate, Cold Coffee, Black Coffee
  12. **Milkshakes** — Chocolate, Strawberry, Butterscotch, Organic Rose, Oreo Shake
  13. **Mojito Drinks** — Minty Lemonade, Masala Lemonade, Chilli Guava, Watermelon Masala, Blue Lagoon, Blueberry Breeze, Green Apple
* Multi-size portions with dynamic pricing (Small / Medium pizzas, Half / Full pastas and noodles).
* Instant live dish search with quick category filter chips.

### 6. 🛒 Redesigned Mobile-First Order Bag
* Full-width mobile experience with single consolidated card layout.
* Quick quantity stepper (`-` / `+`), itemized pricing, and 1-tap delete.
* Integrated *"Add More Items"* & *"Add Instructions"* inputs.
* *"Craving More?"* quick-add recommendation carousel right inside the drawer.
* Clean, compact bottom checkout bar with estimated total and WhatsApp launch button.

### 7. 📱 Mobile Bottom Navigation Bar
* Fixed bottom navigation on mobile devices with 4 quick tabs:
  * 🏠 **Home** (Hero, values, location, contact)
  * 🛒 **Cart** (Direct drawer opener with live badge count)
  * 🍽️ **Menu** (Dedicated full digital menu page)
  * 🕒 **My Orders** (Past orders with 1-tap reordering)

### 8. 📍 Baradari Garden Location & Directions
* **Address:** Mall Rd, inside Baradari Garden, opposite Peer Baba Ji Dargah, Lahori Gate, Patiala, Punjab 147001, India.
* 1-tap Google Maps turn-by-turn navigation link for Android, iOS, and PC.

---

## 🛠️ Tech Stack

* **Frontend:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **PWA & Offline:** Web App Manifest, Service Worker Caching, Standalone Display Mode
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Context API (`CartContext`) + `localStorage` & `sessionStorage`
* **Deployment:** [Vercel](https://vercel.com/) with automated CI/CD from `main` branch

---

## 📂 Project Architecture

```text
Divine_cafe/
├── public/
│   ├── dishes/              # Optimized food imagery
│   ├── menu/                # Scanned original menu sheets
│   ├── manifest.json        # Web App Manifest for PWA installation
│   ├── pwa-icon.svg         # High-resolution vector app icon
│   └── sw.js                # Service Worker for offline caching & fast loads
├── src/
│   ├── components/
│   │   ├── SplashScreen.jsx         # Cinematic opening splash screen
│   │   ├── InstallPWA.jsx           # Smart PWA install prompt (Android & iOS)
│   │   ├── Navbar.jsx               # Header with branding & navigation
│   │   ├── BottomNav.jsx            # Mobile fixed bottom navigation bar
│   │   ├── MenuPage.jsx             # Dedicated digital menu page
│   │   ├── WhatsAppCartDrawer.jsx   # Full-screen order bag & 1-tap past orders
│   │   ├── OrderTypeSelector.jsx    # Dine-In / Takeaway toggle
│   │   ├── Hero.jsx                 # Hero section with brand motto
│   │   ├── HeroBestsellerTicker.jsx # Auto-sliding photo showcase
│   │   ├── PopularPicks.jsx         # Customer favorites showcase
│   │   ├── Highlights.jsx           # Café values & philosophy
│   │   ├── LocationSection.jsx      # Google Maps embed & directions
│   │   ├── ContactWhatsApp.jsx      # WhatsApp contact form
│   │   └── Footer.jsx               # Footer & copyright
│   ├── context/
│   │   └── CartContext.jsx          # Order state, history, dining mode & navigation
│   ├── data/
│   │   ├── cafeConfig.js            # Central café details, phone & WhatsApp config
│   │   └── menuData.js              # 52 items, prices, sizes & descriptions
│   ├── App.jsx                      # App root router & splash trigger
│   ├── index.css                    # Tailwind CSS custom layers
│   └── main.jsx                     # Entry point & service worker registration
├── index.html                       # HTML head with PWA & mobile meta tags
├── package.json
└── README.md
```

---

## ⚙️ How to Update Café Details

All café settings are located in [src/data/cafeConfig.js](src/data/cafeConfig.js):
* **WhatsApp Number:** Update `whatsappNumber` (e.g. `"919988959413"`).
* **Menu Items & Pricing:** Open [src/data/menuData.js](src/data/menuData.js) and modify item names, descriptions, sizes, or prices. Updates reflect instantly across the entire application.
* **Operating Hours / Address:** Configured in `cafeConfig.js`.

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mansehaj12/Divine_Cafe.git

# 2. Enter directory
cd Divine_Cafe

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📄 License
Created for **Divine Cafe, Baradari Garden, Patiala**. All rights reserved.
