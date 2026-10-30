import os

os.makedirs('public/dishes', exist_ok=True)

def make_dish_svg(filename, title, subtitle, bg1, bg2, accent, icon_symbol):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="400" height="350">
  <defs>
    <linearGradient id="grad_{filename}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg1}" />
      <stop offset="100%" stop-color="{bg2}" />
    </linearGradient>
    <filter id="shadow_{filename}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="rgba(0,0,0,0.15)" />
    </filter>
  </defs>

  <!-- Card Background -->
  <rect width="400" height="350" rx="28" fill="url(#grad_{filename})" />
  
  <!-- Subtle circular frame -->
  <circle cx="200" cy="145" r="95" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-dasharray="6 6" />
  <circle cx="200" cy="145" r="80" fill="rgba(255,255,255,0.15)" filter="url(#shadow_{filename})" />

  <!-- Pure Veg Badge Top Left -->
  <g transform="translate(24, 24)">
    <rect width="30" height="30" rx="6" fill="#ffffff" />
    <rect x="3" y="3" width="24" height="24" rx="4" fill="none" stroke="#15803d" stroke-width="2" />
    <circle cx="15" cy="15" r="6" fill="#15803d" />
  </g>

  <!-- Tagline Top Right -->
  <text x="376" y="44" text-anchor="end" fill="rgba(255,255,255,0.85)" font-family="system-ui, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">DIVINE CAFE</text>

  <!-- Center Graphic Icon -->
  <text x="200" y="160" text-anchor="middle" dominant-baseline="middle" font-size="76">{icon_symbol}</text>

  <!-- Bottom Title Label Platter -->
  <rect x="24" y="255" width="352" height="70" rx="18" fill="#ffffff" filter="url(#shadow_{filename})" />
  <text x="200" y="286" text-anchor="middle" fill="#143826" font-family="Georgia, serif" font-size="20" font-weight="bold">{title}</text>
  <text x="200" y="308" text-anchor="middle" fill="{accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1">{subtitle}</text>
</svg>"""
    with open(os.path.join('public/dishes', filename), 'w', encoding='utf-8') as f:
        f.write(svg)

# 1. Snacks (fixing user's exact issue: Spring Roll had ribs, Momos had grass)
make_dish_svg('spring-roll.svg', 'Crispy Spring Rolls', 'VEG SPRING ROLLS', '#78350f', '#d97706', '#b45309', '🥢')
make_dish_svg('tandoori-momos.svg', 'Tandoori Momos', 'CHARRED VEG DUMPLINGS', '#991b1b', '#ea580c', '#c2410c', '🥟')
make_dish_svg('french-fries.svg', 'French Fries', 'CRISPY POTATO FRIES', '#854d0e', '#eab308', '#ca8a04', '🍟')

# 2. Breakfast & Smoothies
make_dish_svg('poha.svg', 'Mix Veg Poha', 'TRADITIONAL TEMPERED POHA', '#a16207', '#eab308', '#854d0e', '🥣')
make_dish_svg('besan-cheela.svg', 'Organic Besan Cheela', 'SAVORY GRAM FLOUR PANCAKE', '#b45309', '#ca8a04', '#a16207', '🥞')
make_dish_svg('nachos.svg', "Tandoori Nacho's", 'CRUNCHY SPICED TORTILLAS', '#c2410c', '#f97316', '#ea580c', '🧀')
make_dish_svg('smoothie.svg', 'Banana Nut Smoothie', 'CHIA, OATS, NUTS & BERRIES', '#4c1d95', '#8b5cf6', '#6d28d9', '🫐')

# 3. Individual Pizza Flavors
make_dish_svg('margherita-pizza.svg', 'Margherita Pizza', 'CLASSIC CHEESE & TOMATO', '#991b1b', '#ef4444', '#b91c1c', '🍕')
make_dish_svg('paneer-makhni-pizza.svg', 'Paneer Makhni Pizza', 'MAKHANI SAUCE & DOUBLE CHEESE', '#9a3412', '#f97316', '#c2410c', '🍕')
make_dish_svg('farm-fresh-pizza.svg', 'Farm Fresh Pizza', 'LOADED FARM VEGGIES & CORN', '#14532d', '#22c55e', '#16a34a', '🍕')
make_dish_svg('cheesy-cream-pizza.svg', 'Cheesy Cream Pizza', 'ITALIAN SAUCE, CORN & CHEESE', '#854d0e', '#facc15', '#ca8a04', '🍕')
make_dish_svg('spicy-paneer-pizza.svg', 'Spicy Paneer Pizza', 'SPICED PANEER & CAPSICUM', '#9a3412', '#ea580c', '#c2410c', '🍕')
make_dish_svg('single-topping-pizza.svg', 'Single Topping Pizza', 'FRESH TOPPING ON IN-HOUSE DOUGH', '#713f12', '#eab308', '#a16207', '🍕')

# 4. Individual Pasta Flavors
make_dish_svg('white-sauce-pasta.svg', 'White Sauce Pasta', 'EXTRA CREAMY BECHAMEL & CHEESE', '#713f12', '#d97706', '#a16207', '🍝')
make_dish_svg('red-sauce-pasta.svg', 'Red Sauce Pasta', 'ZESTY TOMATO & HERBS', '#991b1b', '#ef4444', '#b91c1c', '🍝')
make_dish_svg('tandoori-pasta.svg', 'Tandoori Cream Pasta', 'SMOKY TANDOORI VEG PENNE', '#9a3412', '#ea580c', '#c2410c', '🍝')
make_dish_svg('mix-sauce-pasta.svg', 'Mix Sauce Pasta', 'CREAMY PINK SAUCE FUSION', '#831843', '#ec4899', '#be185d', '🍝')

# 5. Burgers
make_dish_svg('double-decker-burger.svg', 'Double Decker Burger', 'DUAL VEG PATTIES & MELTED CHEESE', '#78350f', '#d97706', '#b45309', '🍔')
make_dish_svg('royal-paneer-burger.svg', 'Royal Paneer Burger', 'MARINATED GRILLED PANEER SLAB', '#9a3412', '#f97316', '#c2410c', '🍔')
make_dish_svg('salsa-burger.svg', 'Spicy Salsa Burger', 'CRISPY PATTY & ZESTY SALSA', '#991b1b', '#ef4444', '#b91c1c', '🍔')
make_dish_svg('classic-burger.svg', 'Classic Veg Burger', 'HERB PATTY & CRISP GREENS', '#14532d', '#22c55e', '#15803d', '🍔')

# 6. Wraps
make_dish_svg('grill-paneer-wrap.svg', 'Grill Paneer Wrap', 'WHOLE WHEAT SPICED PANEER', '#7c2d12', '#ea580c', '#c2410c', '🌯')
make_dish_svg('crispy-wrap.svg', 'Veg Crispy Wrap', 'WHOLE WHEAT CRISPY ROLL', '#713f12', '#ca8a04', '#a16207', '🌯')
make_dish_svg('cheese-corn-wrap.svg', 'Cheese & Corn Wrap', 'MELTED CHEESE & SWEET CORN', '#854d0e', '#facc15', '#ca8a04', '🌯')
make_dish_svg('makhani-wrap.svg', 'Paneer Wrap Makhani', 'CRISPY PANEER & MAKHANI GRAVY', '#9a3412', '#f97316', '#c2410c', '🌯')

# 7. Sandwiches
make_dish_svg('grilled-sandwich.svg', 'Grilled Sandwich', 'GOLDEN TOASTED VEG SANDWICH', '#78350f', '#d97706', '#b45309', '🥪')
make_dish_svg('cream-cold-sandwich.svg', 'Cream Cold Sandwich', 'CHILLED CREAMY VEG SPREAD', '#1e3a8a', '#3b82f6', '#2563eb', '🥪')
make_dish_svg('paneer-corn-sandwich.svg', 'Paneer Cheese Corn Sandwich', 'LOADED PANEER & SWEET CORN', '#854d0e', '#f59e0b', '#b45309', '🥪')
make_dish_svg('pasta-pizza-sandwich.svg', 'Pasta Pizza Sandwich', 'FUSION PASTA & MELTED CHEESE', '#991b1b', '#ef4444', '#b91c1c', '🥪')

# 8. Maggi & Noodles
make_dish_svg('masala-maggi.svg', 'Classic Veg Masala Maggi', 'FRESH VEGGIES & SPECIAL MASALA', '#a16207', '#eab308', '#ca8a04', '🍜')
make_dish_svg('butter-garlic-maggi.svg', 'Butter Garlic Maggi', 'RICH BUTTER & ROASTED GARLIC', '#854d0e', '#facc15', '#a16207', '🍜')
make_dish_svg('cheese-corn-maggi.svg', 'Spicy Cheese & Corn Maggi', 'FIERY SPICE, SWEET CORN & CHEESE', '#9a3412', '#f97316', '#c2410c', '🍜')
make_dish_svg('makhani-maggi.svg', 'Makhani Paneer Maggi', 'VELVETY MAKHANI GRAVY & PANEER', '#7c2d12', '#ea580c', '#c2410c', '🍜')
make_dish_svg('hakka-noodles.svg', 'Hakka Noodles', 'WOK-TOSSED SHREDDED VEGGIES', '#14532d', '#22c55e', '#16a34a', '🥢')
make_dish_svg('chilli-garlic-noodles.svg', 'Chilli Garlic Noodles', 'FIERY CHILI & MINCED GARLIC', '#991b1b', '#ef4444', '#b91c1c', '🥢')

# 9. Chai, Teas & Coffees
make_dish_svg('masala-chai.svg', 'Organic Masala Chai', 'WHOLE SPICES, GINGER & CARDAMOM', '#78350f', '#b45309', '#92400e', '☕')
make_dish_svg('adrak-chai.svg', 'Organic Adrak Chai', 'POUNDED SPICY FRESH GINGER', '#7c2d12', '#c2410c', '#9a3412', '☕')
make_dish_svg('elaichi-chai.svg', 'Organic Elaichi Chai', 'GREEN CARDAMOM INFUSED TEA', '#065f46', '#10b981', '#059669', '☕')
make_dish_svg('jaggery-chai.svg', 'Organic Jaggery Chai', 'PURE ORGANIC GUR SWEETENED', '#713f12', '#a16207', '#854d0e', '☕')
make_dish_svg('rose-chai.svg', 'Organic Rose Chai', 'DELICATE ROSE PETAL INFUSION', '#831843', '#f43f5e', '#be185d', '☕')
make_dish_svg('green-tea.svg', 'Organic Green Tea', 'ANTIOXIDANT RICH BREW', '#14532d', '#22c55e', '#16a34a', '🍵')
make_dish_svg('lemon-tea.svg', 'Lemon Tea', 'ZESTY FRESH LEMON BREW', '#854d0e', '#facc15', '#ca8a04', '🍋')
make_dish_svg('haldi-milk.svg', 'Haldi Milk', 'GOLDEN TURMERIC IMMUNITY LATTE', '#a16207', '#eab308', '#ca8a04', '🥛')
make_dish_svg('cold-coffee.svg', 'Cold Coffee', 'CHILLED FROTHY BLENDED BREW', '#451a03', '#92400e', '#78350f', '🥤')
make_dish_svg('caramel-coffee.svg', 'Caramel Hot Coffee', 'STEAMED COFFEE & BUTTERY CARAMEL', '#78350f', '#d97706', '#b45309', '☕')
make_dish_svg('hot-chocolate.svg', 'Hot Chocolate', 'MOLTEN RICH COCOA INDULGENCE', '#3b0764', '#7e22ce', '#6b21a8', '🍫')
make_dish_svg('black-coffee.svg', 'Black Coffee', 'BOLD ESPRESSO EXTRACTION', '#1c1917', '#44403c', '#292524', '☕')

# 10. Shakes & Mojitos
make_dish_svg('chocolate-shake.svg', 'Chocolate Milk Shake', 'RICH BLENDED COCOA & ICE CREAM', '#381c0c', '#78350f', '#522510', '🥤')
make_dish_svg('strawberry-shake.svg', 'Strawberry Milk Shake', 'FRESH BERRY & ICE CREAM BLEND', '#831843', '#f43f5e', '#be185d', '🍓')
make_dish_svg('butterscotch-shake.svg', 'Butterscotch Shake', 'BUTTERSCOTCH CRUNCH & ICE CREAM', '#854d0e', '#facc15', '#ca8a04', '🍨')
make_dish_svg('rose-shake.svg', 'Organic Rose Shake', 'ORGANIC ROSE & VANILLA BLEND', '#9d174d', '#f472b6', '#db2777', '🌸')
make_dish_svg('oreo-shake.svg', 'Oreo Milk Shake', 'OREO COOKIES & CREAM INDULGENCE', '#18181b', '#3f3f46', '#27272a', '🍪')
make_dish_svg('mint-lemonade.svg', 'Minty Lemonade', 'FRESH GARDEN MINT & FIZZ', '#065f46', '#10b981', '#059669', '🍸')
make_dish_svg('masala-lemonade.svg', 'Masala Lemonade', 'ROASTED JEERA & ROCK SALT', '#854d0e', '#ca8a04', '#a16207', '🍹')
make_dish_svg('chilli-guava.svg', 'Chilli Guava Mojito', 'GUAVA NECTAR & CHILI SPICE RIM', '#991b1b', '#ef4444', '#b91c1c', '🌶️')
make_dish_svg('watermelon-masala.svg', 'Watermelon Masala', 'JUICY WATERMELON & MINT LEAVES', '#9f1239', '#fb7185', '#e11d48', '🍉')
make_dish_svg('blue-lagoon.svg', 'Blue Lagoon Mojito', 'VIBRANT CURACAO & CITRUS SODA', '#0c4a6e', '#0284c7', '#0369a1', '🍹')
make_dish_svg('blueberry-breeze.svg', 'Blueberry Breeze Mojito', 'WILD BLUEBERRY & FRESH MINT', '#312e81', '#6366f1', '#4338ca', '🫐')
make_dish_svg('green-apple.svg', 'Green Apple Mojito', 'CRISP TART GREEN APPLE SPLASH', '#14532d', '#22c55e', '#16a34a', '🍏')

print('All 52 dish SVGs generated successfully in public/dishes/')
