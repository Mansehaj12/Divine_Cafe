# 🌿 Divine Cafe — "You Are What You Eat"

A premium, modern, fully responsive web application built for **Divine Cafe** — a conscious pure vegetarian café located inside **Baradari Garden, Patiala, Punjab**.

Built with **React 18**, **Vite**, and **Tailwind CSS**, designed with an elegant forest green and cream café aesthetic, mobile-first performance, digital menu browsing, interactive table QR ordering, and zero backend maintenance.

---

## 🚀 Live Demo & Repository
* **GitHub Repository:** [https://github.com/Mansehaj12/Divine_Cafe](https://github.com/Mansehaj12/Divine_Cafe)
* **Local Development Server:** `http://localhost:3000/`

---

## ✨ Features Overview

### 1. 🍽️ Smart "Dine-In Table QR" Mode
* **Table QR Auto-Detection:** Automatically detects table numbers from QR code URLs (e.g. `?table=4`).
* **Compact Dual-Box Switcher:** A slim, half-height toggle directly at the top of the homepage allowing guests to switch between:
  * `🍽️ Dine-In` (displays current table number with 1-tap table selector for Tables 1–10 or custom numbers).
  * `🛍️ Takeaway` (self-pickup at the counter).
* **Automated WhatsApp Order Prefixes:** Automatically formats orders sent to café staff:
  ```text
  *🍽️ DINE-IN ORDER - DIVINE CAFE*
  📍 *Table Number:* #4
  _“You Are What You Eat”_

  *Order Items:*
  1. *Paneer Makhni Pizza (Medium)* × 1 = ₹400
  2. *Blue Lagoon Mojito* × 2 = ₹240

  *Total Amount:* ₹640
  *Special Instructions:* Please serve pizza extra hot!
  ```

### 2. 🧾 Real-Time Kitchen & Billing Desk (Live KOT Dashboard)
* **Access Route:** Visit `/#orders` or click **"🔐 Staff & Kitchen Desk"** in the footer.
* **4-Digit Staff PIN Security:** Protected by staff PIN (Default: `1470`, configurable in `cafeConfig.js`). Remembers login session so staff only enter it once.
* **Realistic Two-Tone Brass Service Bell:** Synthesized via Web Audio API (zero external MP3 files, 100% reliable across all browsers & devices). Rings whenever a new order is received.
* **Thermal Slip Printing (KOT):** 1-click printer integration formatted specifically for **58mm / 80mm thermal receipt printers** and standard printers.
* **Kitchen Workflow Pipeline:** `New Order (Pending)` ➔ `🍳 Start Cooking (In Kitchen)` ➔ `✅ Mark as Served`.
* **Zero Customer Confusion:** Customer only sees a clean `[ Place Order & Send Slip to Kitchen ]` button. Both Owner and Staff can open the dashboard link on their phones simultaneously.

### 3. 📸 Auto-Sliding Bestseller Photo Showcase
* High-resolution, full-bleed visual slider replacing static text in the hero section.
* Auto-slides every **3.5 seconds** through signature dishes (*Paneer Makhni Pizza*, *Mix Veg Poha*, *Blue Lagoon Mojito*, *Mix Sauce Pasta*, *Royal Paneer Burger*, *Organic Masala Chai*).
* Features subtle cross-fading, progress dots, hover controls, and 1-tap smooth scrolling straight to that dish in the digital menu.

### 3. 📖 100% Authentic Digital Menu (52 Dishes Across 13 Categories)
* Sourced directly from Divine Cafe's 5 physical scanned menu sheets.
* Multi-size portions with dynamic pricing (Small / Medium for Pizzas, Half / Full for Pastas and Noodles).
* Standard Indian FSSAI **Pure Veg green-dot badge** on every dish.
* **13 Categories Covered:**
  1. **Breakfast** (5 items) — Mix Veg Poha, Organic Besan Cheela, Corn Masala Salad, Sprouted Salad, Tandoori Nacho's
  2. **Smoothies** (1 item) — Banana Nut Smoothie
  3. **Sandwiches** (4 items) — Grilled, Cream Cold, Paneer Cheese & Corn, Pasta Pizza Sandwich
  4. **Thin-Crust Pizzas** (6 items) — *In-house dough & sauces*. Single Topping, Spicy Paneer, Paneer Makhni Pizza, Farm Fresh, Margherita, Cheesy Cream
  5. **Pasta** (4 items) — White Sauce, Red Sauce, Tandoori Cream, Mix Sauce
  6. **Noodles & Maggi** (6 items) — Classic Veggie Masala, Butter Garlic, Spicy Cheese & Corn, Makhani Paneer, Hakka Noodles, Chilli Garlic Noodles
  7. **Snacks** (3 items) — French Fries, Spring Roll, Tandoori Momos
  8. **Burgers** (4 items) — Classic Veggie Pattie, Royal Paneer Grilled, Spicy Salsa, Double Decker
  9. **Vegetarian Wraps** (4 items) — Whole Wheat Grill Paneer, Whole Wheat Veg Crispy, Spicy Cheese & Corn, Crispy Paneer Wrap Makhani
  10. **Chai & Tea** (9 items) — Organic CTC Tea, Organic Masala Chai, Organic Adrak Chai, Organic Elaichi Chai, Organic Jaggery Chai, Organic Rose Chai, Organic Green Tea, Lemon Tea, Haldi Milk
  11. **Coffee** (5 items) — Hot Coffee, Caramel Hot Coffee, Hot Chocolate, Cold Coffee, Black Coffee
  12. **Milkshakes** (5 items) — Chocolate, Strawberry, Butterscotch, Organic Rose, Oreo Shake
  13. **Mojito Drinks** (7 items) — Minty Lemonade, Masala Lemonade, Chilli Guava, Watermelon Masala, Blue Lagoon, Blueberry Breeze, Green Apple

### 4. 🍔 Compact Swiggy / Zomato / McDonald's Style Dish Cards
* Space-efficient horizontal layout showing 3–4 dishes on a mobile screen at once.
* **Left:** Dish title, exact price in ₹, verified menu description, and size selector pills.
* **Right:** Square rounded dish photograph with an overlapping **ADD +** button centered over the bottom edge.

### 5. 🧭 Floating "Menu" Navigator
* Sleek bottom-right floating pill with spoon & knife cutlery icon.
* Opens a clean category drawer displaying dish counts and 1-tap quick navigation to any section on the page.

### 6. 📍 Pinned Google Maps Location
* **Address:** Mall Rd, inside Baradari Garden, opposite Peer Baba Ji Dargah, Lahori Gate, Patiala, Punjab 147001, India.
* Connected to verified business profile **DIVINE ORGANICS**.
* Interactive responsive map embed with universal turn-by-turn navigation links that open Google Maps on Android, iOS, and PC.

### 7. 🔒 Security & Code Integrity
* **Zero Secrets / API Keys Exposed:** 100% clean front-end code with zero leaked tokens or credentials.
* **Input Sanitization:** URL query parameters (table numbers) strictly validated to positive integers (1–99) to prevent injection attempts.
* **Production .gitignore:** Strictly excludes `node_modules/`, `dist/`, `.env`, and local caches from public commits.

---

## 🛠️ Tech Stack
* **Framework:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** React Context API (Cart, Table & Dining Mode)

---

## 📂 Project Architecture

```
Divine_cafe/
├── public/
│   ├── dishes/            # Local high-res food assets (0ms latency, zero broken images)
│   └── menu/              # High-resolution original scanned menu sheets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Sticky header with branding & mobile drawer
│   │   ├── TableDineInBanner.jsx    # Table QR Banner component
│   │   ├── OrderTypeSelector.jsx    # Compact Half-Height Dine-In / Takeaway Switcher
│   │   ├── Hero.jsx                 # Hero section with brand motto
│   │   ├── HeroBestsellerTicker.jsx # Large auto-sliding photo showcase
│   │   ├── DigitalMenu.jsx          # 52-dish digital menu with live search
│   │   ├── MenuItemCard.jsx         # Swiggy/Zomato style compact dish card
│   │   ├── FloatingMenuNavigator.jsx# Bottom-right quick category navigator
│   │   ├── PopularPicks.jsx         # Customer favourites showcase
│   │   ├── LocationSection.jsx      # Google Maps embed & driving directions
│   │   ├── ContactWhatsApp.jsx      # WhatsApp contact & order form
│   │   ├── WhatsAppCartDrawer.jsx   # Slide-over order bag tray
│   │   ├── MenuScansModal.jsx       # Physical scanned menu viewer modal
│   │   └── Footer.jsx               # Brand values & transparency links
│   ├── context/
│   │   ├── CartContext.jsx          # Order bag state & WhatsApp message generator
│   │   └── useCart.js               # Custom hook for cart access
│   ├── data/
│   │   ├── cafeConfig.js            # Central café details, location, phone & settings
│   │   └── menuData.js              # Central menu database (52 items, prices, descriptions)
│   ├── App.jsx                      # Main app layout
│   ├── index.css                    # Tailwind CSS custom layers
│   └── main.jsx                     # Vite React entry point
├── package.json
└── README.md
```

---

## ⚙️ How the Café Owner Can Update Details

All café settings are located in a single configuration file: [src/data/cafeConfig.js](src/data/cafeConfig.js).

1. **Activate 1-Click WhatsApp Ordering:**
   * Set `isWhatsappProvided: true`
   * Enter the WhatsApp phone number with country code: `whatsappNumber: "91XXXXXXXXXX"`
2. **Update Dishes / Prices:**
   * Open [src/data/menuData.js](src/data/menuData.js) and update any item price or description. Changes reflect immediately across the entire site.
3. **Add Instagram:**
   * Add the link to `socialLinks.instagram` once created.

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

Open [http://localhost:3000/](http://localhost:3000/) in your browser.

---

## 📄 License
Created for **Divine Cafe, Patiala**. All rights reserved.
