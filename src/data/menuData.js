/**
 * Divine Cafe - Central Menu Data
 * 
 * Sourced directly from the official physical menu cards.
 * All prices are in Indian Rupees (₹).
 * Curated with delicious, true-to-name food photography for every dish.
 */

export const menuCategories = [
  { id: "all", name: "All Items", icon: "UtensilsCrossed", count: 52 },
  { id: "breakfast", name: "Breakfast", icon: "Sunrise", count: 5 },
  { id: "smoothies", name: "Smoothies", icon: "Sparkles", count: 1 },
  { id: "sandwiches", name: "Sandwiches", icon: "Sandwich", count: 4 },
  { id: "thin-crust-pizzas", name: "Thin-Crust Pizzas", icon: "Pizza", subtitle: "Pizza dough and sauces made in house", count: 6 },
  { id: "pasta", name: "Pasta", icon: "Soup", count: 4 },
  { id: "noodles-and-maggi", name: "Noodles & Maggi", icon: "Flame", count: 6 },
  { id: "snacks", name: "Snacks", icon: "Cookie", count: 3 },
  { id: "burgers", name: "Burgers", icon: "Layers", count: 4 },
  { id: "vegetarian-wraps", name: "Vegetarian Wraps", icon: "WrapIcon", count: 4 },
  { id: "chai-and-tea", name: "Chai & Tea", icon: "CupSoda", count: 9 },
  { id: "coffee", name: "Coffee", icon: "Coffee", count: 5 },
  { id: "milkshakes", name: "Milkshakes", icon: "Milk", count: 5 },
  { id: "mojito-drinks", name: "Mojito Drinks", icon: "Wine", count: 7 }
];

export const menuItems = [
  // ================= 1. BREAKFAST =================
  {
    id: "bf-1",
    categoryId: "breakfast",
    name: "Mix Veg Poha",
    price: 120,
    description: "flattened rice (poha) tossed with a colorful medley of fresh vegetables, roasted nuts, and traditional tempering spice",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80",
    tags: ["Traditional", "Breakfast Special"],
    isPopular: true
  },
  {
    id: "bf-2",
    categoryId: "breakfast",
    name: "Organic Besan Cheela",
    price: 100,
    description: "a popular North Indian savory pancake made from gram flour (chickpea flour or besan), water, spices, and finely chopped veges.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    tags: ["High Protein", "Organic Gram Flour"],
    isPopular: false
  },
  {
    id: "bf-3",
    categoryId: "breakfast",
    name: "Corn Masala Salad",
    price: 80,
    description: "Sweet, crunchy, tangy, and fresh",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    tags: ["Light & Tangy"],
    isPopular: false
  },
  {
    id: "bf-4",
    categoryId: "breakfast",
    name: "Sprouted Salad",
    price: 120,
    description: "Seeds, beans, or grains tossed with fresh vegetables, herbs, and a light dressing",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    tags: ["Wholesome", "Nutritious"],
    isPopular: false
  },
  {
    id: "bf-5",
    categoryId: "breakfast",
    name: "Tandoori Nacho's",
    price: 150,
    description: "Seeds, beans, or grains tossed with fresh vegetables, herbs, and a light dressing",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80",
    tags: ["Crunchy Delight"],
    isPopular: false
  },

  // ================= 2. SMOOTHIES =================
  {
    id: "sm-1",
    categoryId: "smoothies",
    name: "Banana Nut Smoothie",
    price: 200,
    description: "Contains banana,nuts,chia seed,oats,cinnamon and berries.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80",
    tags: ["Chia & Berries", "Energy Blend"],
    isPopular: true
  },

  // ================= 3. SANDWICHES =================
  {
    id: "sw-1",
    categoryId: "sandwiches",
    name: "Grilled Sandwich",
    price: 90,
    description: "Golden grilled sandwich with fresh vegetable filling and aromatic seasoning.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    tags: ["Crispy Toasted"],
    isPopular: false
  },
  {
    id: "sw-2",
    categoryId: "sandwiches",
    name: "Cream Cold Sandwich",
    price: 70,
    description: "Chilled sandwich layered with a creamy seasoned vegetable spread.",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
    tags: ["Chilled & Fresh"],
    isPopular: false
  },
  {
    id: "sw-3",
    categoryId: "sandwiches",
    name: "Paneer Cheese and Corn Sandwich",
    price: 120,
    description: "Loaded with soft paneer cubes, sweet corn, melted cheese, and herbs.",
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&w=600&q=80",
    tags: ["Cheesy", "Chef Choice"],
    isPopular: true
  },
  {
    id: "sw-4",
    categoryId: "sandwiches",
    name: "Pasta Pizza Sandwich",
    price: 150,
    description: "Fusion sandwich packed with savory saucy pasta, pizza herbs, and melted cheese.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    tags: ["Signature Fusion"],
    isPopular: false
  },

  // ================= 4. THIN-CRUST PIZZAS =================
  {
    id: "pz-1",
    categoryId: "thin-crust-pizzas",
    name: "Single Topping Pizza",
    price: 120,
    sizes: [
      { label: "Standard", price: 120 }
    ],
    description: "Onion/capsicum/TOMATO",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    tags: ["In-House Dough"],
    isPopular: false
  },
  {
    id: "pz-2",
    categoryId: "thin-crust-pizzas",
    name: "Spicy Paneer Pizza",
    price: 200,
    sizes: [
      { label: "Small", price: 200 },
      { label: "Medium", price: 380 }
    ],
    description: "Onion,capsicum,paneer with indian spices",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    tags: ["Spiced Paneer", "Thin Crust"],
    isPopular: false
  },
  {
    id: "pz-3",
    categoryId: "thin-crust-pizzas",
    name: "Paneer Makhni Pizza",
    price: 240,
    sizes: [
      { label: "Small", price: 240 },
      { label: "Medium", price: 400 }
    ],
    description: "Onion,paneer,butter sauce & double cheese",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
    tags: ["Double Cheese", "Makhani Sauce"],
    isPopular: true
  },
  {
    id: "pz-4",
    categoryId: "thin-crust-pizzas",
    name: "Farm Fresh Pizza",
    price: 250,
    sizes: [
      { label: "Small", price: 250 },
      { label: "Medium", price: 440 }
    ],
    description: "ONION,CAPSICUM,CORN,MUSHROOM,JALAPENOS & CHERRY TOMATO",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    tags: ["Loaded Veggies", "In-House Sauce"],
    isPopular: true
  },
  {
    id: "pz-5",
    categoryId: "thin-crust-pizzas",
    name: "Margherita",
    price: 220,
    sizes: [
      { label: "Small", price: 220 },
      { label: "Medium", price: 420 }
    ],
    description: "Seeds, beans, or grains tossed with fresh vegetables, herbs, and a light dressing",
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=600&q=80",
    tags: ["Italian Classic"],
    isPopular: false
  },
  {
    id: "pz-6",
    categoryId: "thin-crust-pizzas",
    name: "Cheesy Cream Pizza",
    price: 220,
    sizes: [
      { label: "Small", price: 220 },
      { label: "Medium", price: 400 }
    ],
    description: "Italian sauce, corn, tomato and cheese",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80",
    tags: ["Extra Creamy"],
    isPopular: false
  },

  // ================= 5. PASTA =================
  {
    id: "ps-1",
    categoryId: "pasta",
    name: "White Sauce Pasta",
    price: 100,
    sizes: [
      { label: "Half", price: 100 },
      { label: "Full", price: 180 }
    ],
    description: "Extra creamy white sauce pasta with cheese and herbs.",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80",
    tags: ["Rich Bechamel", "Cheesy"],
    isPopular: true
  },
  {
    id: "ps-2",
    categoryId: "pasta",
    name: "Red Sauce Pasta",
    price: 90,
    sizes: [
      { label: "Half", price: 90 },
      { label: "Full", price: 150 }
    ],
    description: "Zesty tomato sauce pasta with herb and veggies",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    tags: ["Zesty Marinara"],
    isPopular: false
  },
  {
    id: "ps-3",
    categoryId: "pasta",
    name: "Tandoori Cream Pasta",
    price: 140,
    sizes: [
      { label: "Half", price: 140 },
      { label: "Full", price: 250 }
    ],
    description: "ONION,CAPSICUM,CORN,MUSHROOM,JALAPENOS & CHERRY TOMATO",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    tags: ["Smoky Tandoori"],
    isPopular: false
  },
  {
    id: "ps-4",
    categoryId: "pasta",
    name: "Mix Sauce Pasta",
    price: 150,
    sizes: [
      { label: "Half", price: 150 },
      { label: "Full", price: 280 }
    ],
    description: "Creamy white+ tangy red mixed (cheesy & spicy)",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    tags: ["Pink Sauce", "Bestseller"],
    isPopular: true
  },

  // ================= 6. NOODLES & MAGGI =================
  {
    id: "nd-1",
    categoryId: "noodles-and-maggi",
    name: "Classic Veggie Masala Maggie",
    price: 65,
    description: "Comforting Maggi tossed with fresh garden vegetables and aromatic masala seasoning.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    tags: ["Comfort Food"],
    isPopular: false
  },
  {
    id: "nd-2",
    categoryId: "noodles-and-maggi",
    name: "Butter Garlic Maggie",
    price: 90,
    description: "Rich butter-infused noodles with slow-roasted garlic aroma.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
    tags: ["Garlic Butter"],
    isPopular: false
  },
  {
    id: "nd-3",
    categoryId: "noodles-and-maggi",
    name: "Spicy Cheese & Corn Maggie",
    price: 120,
    description: "Fiery spiced Maggi topped with sweet golden corn and melted cheese.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    tags: ["Cheesy Corn"],
    isPopular: false
  },
  {
    id: "nd-4",
    categoryId: "noodles-and-maggi",
    name: "Makhani Paneer Maggie",
    price: 120,
    description: "Velvety Indian makhani gravy layered with paneer cubes over noodles.",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80",
    tags: ["Makhani Gravy"],
    isPopular: true
  },
  {
    id: "nd-5",
    categoryId: "noodles-and-maggi",
    name: "Hakka Noodles",
    price: 90,
    sizes: [
      { label: "Half", price: 90 },
      { label: "Full", price: 150 }
    ],
    description: "Wok-tossed noodles with shredded cabbage, crunchy capsicum, and oriental sauces.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    tags: ["Wok Tossed"],
    isPopular: false
  },
  {
    id: "nd-6",
    categoryId: "noodles-and-maggi",
    name: "Chilli Garlic Noodles",
    price: 100,
    sizes: [
      { label: "Half", price: 100 },
      { label: "Full", price: 160 }
    ],
    description: "Fiery stir-fried noodles infused with red chili flakes and minced garlic.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
    tags: ["Spicy Delight"],
    isPopular: false
  },

  // ================= 7. SNACKS =================
  {
    id: "sn-1",
    categoryId: "snacks",
    name: "French Fries",
    price: 120,
    description: "Golden crispy potato batons fried to perfection and seasoned with salt & herbs.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    tags: ["Crispy Classic"],
    isPopular: false
  },
  {
    id: "sn-2",
    categoryId: "snacks",
    name: "Spring Roll",
    price: 150,
    description: "Crisp golden fried rolls filled with seasoned shredded vegetables.",
    image: "https://images.unsplash.com/photo-1560162071-da4c4a91077a?auto=format&fit=crop&w=600&q=80",
    tags: ["Golden Crisp"],
    isPopular: false
  },
  {
    id: "sn-3",
    categoryId: "snacks",
    name: "Tandoori Momos",
    price: 120,
    description: "Juicy vegetable momos coated in rich tandoori marinade and charred to perfection.",
    image: "https://images.unsplash.com/photo-1561916719-6cd8612e4be8?auto=format&fit=crop&w=600&q=80",
    tags: ["Tandoor Glazed"],
    isPopular: true
  },

  // ================= 8. BURGERS =================
  {
    id: "bg-1",
    categoryId: "burgers",
    name: "Classic Veggie Pattie Burger",
    price: 75,
    description: "Herb-seasoned vegetable patty in a toasted bun with crisp lettuce and cafe dressing.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    tags: ["Toasted Bun"],
    isPopular: false
  },
  {
    id: "bg-2",
    categoryId: "burgers",
    name: "Royal Paneer Grilled Burger",
    price: 90,
    description: "Succulent marinated grilled paneer slab with fresh veggies and royal sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    tags: ["Grilled Paneer", "Special"],
    isPopular: true
  },
  {
    id: "bg-3",
    categoryId: "burgers",
    name: "Spicy Salsa Burger",
    price: 85,
    description: "Crispy patty crowned with tangy, zesty Mexican-style salsa and melted cheese.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    tags: ["Zesty Salsa"],
    isPopular: false
  },
  {
    id: "bg-4",
    categoryId: "burgers",
    name: "Double Decker Burger",
    price: 120,
    description: "Stacked double patty with dual layers of melted cheese, onions, and sauces.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    tags: ["Double Stack"],
    isPopular: false
  },

  // ================= 9. VEGETARIAN WRAPS =================
  {
    id: "wp-1",
    categoryId: "vegetarian-wraps",
    name: "Whole Wheat Grill. Paneer Wrap",
    price: 120,
    description: "Wholesome whole wheat tortilla loaded with spiced grilled paneer, onions, and mint dip.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
    tags: ["Whole Wheat", "Protein Rich"],
    isPopular: true
  },
  {
    id: "wp-2",
    categoryId: "vegetarian-wraps",
    name: "Whole Wheat Veg Crispy Wrap",
    price: 90,
    description: "Crispy vegetable filling wrapped in whole wheat flatbread with tangy sauces.",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
    tags: ["Whole Wheat", "Crispy Filling"],
    isPopular: false
  },
  {
    id: "wp-3",
    categoryId: "vegetarian-wraps",
    name: "Spicy Cheese and Corn Wrap",
    price: 100,
    description: "Warm melted cheese, sweet corn kernels, and jalapenos rolled into a toasted wrap.",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
    tags: ["Cheesy Melt"],
    isPopular: false
  },
  {
    id: "wp-4",
    categoryId: "vegetarian-wraps",
    name: "Crispy Paneer Wrap Makhani",
    price: 150,
    description: "Crispy coated cottage cheese cubes doused in creamy makhani gravy in a hearty wrap.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    tags: ["Signature Makhani"],
    isPopular: false
  },

  // ================= 10. CHAI & TEA =================
  {
    id: "ch-1",
    categoryId: "chai-and-tea",
    name: "Organic CTC Tea",
    price: 40,
    description: "Freshly brewed classic Indian CTC black tea with milk.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    tags: ["Classic Kadak"],
    isPopular: false
  },
  {
    id: "ch-2",
    categoryId: "chai-and-tea",
    name: "Organic Masala Chai",
    price: 50,
    description: "Simmered with traditional whole spices, ginger, and aromatic cardamoms.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    tags: ["Spiced Brew", "Comforting"],
    isPopular: true
  },
  {
    id: "ch-3",
    categoryId: "chai-and-tea",
    name: "Organic Adrak Chai",
    price: 45,
    description: "Infused with freshly pounded spicy Indian ginger.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    tags: ["Fresh Ginger"],
    isPopular: false
  },
  {
    id: "ch-4",
    categoryId: "chai-and-tea",
    name: "Organic Elaichi Chai",
    price: 60,
    description: "Fragrant chai infused with natural green cardamom pods.",
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80",
    tags: ["Green Cardamom"],
    isPopular: false
  },
  {
    id: "ch-5",
    categoryId: "chai-and-tea",
    name: "Organic Jaggery Chai",
    price: 50,
    description: "Sweetened naturally with wholesome organic jaggery (gur).",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    tags: ["Natural Jaggery"],
    isPopular: false
  },
  {
    id: "ch-6",
    categoryId: "chai-and-tea",
    name: "Organic Rose Chai",
    price: 60,
    description: "Subtly fragrant milk tea infused with delicate edible rose petals.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    tags: ["Floral Notes"],
    isPopular: false
  },
  {
    id: "ch-7",
    categoryId: "chai-and-tea",
    name: "Organic Green Tea",
    price: 40,
    description: "Soothing hot brewed organic green tea leaves rich in antioxidants.",
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80",
    tags: ["Antioxidant Rich"],
    isPopular: false
  },
  {
    id: "ch-8",
    categoryId: "chai-and-tea",
    name: "Lemon Tea",
    price: 30,
    description: "Zesty freshly squeezed lemon in brewed tea with sweet balancing notes.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
    tags: ["Tangy & Light"],
    isPopular: false
  },
  {
    id: "ch-9",
    categoryId: "chai-and-tea",
    name: "Haldi Milk",
    price: 80,
    description: "Traditional golden turmeric milk simmered with warming spices.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    tags: ["Golden Latte", "Immunity"],
    isPopular: false
  },

  // ================= 11. COFFEE =================
  {
    id: "cf-1",
    categoryId: "coffee",
    name: "Hot Coffee",
    price: 75,
    description: "Richly brewed aromatic hot coffee with frothy steamed milk.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    tags: ["Frothy Brew"],
    isPopular: false
  },
  {
    id: "cf-2",
    categoryId: "coffee",
    name: "Caramel Hot Coffee",
    price: 90,
    description: "Hot brewed coffee laced with smooth, buttery caramel syrup.",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    tags: ["Sweet Caramel"],
    isPopular: true
  },
  {
    id: "cf-3",
    categoryId: "coffee",
    name: "Hot Chocolate",
    price: 100,
    description: "Velvety warm molten cocoa indulgence topped with gentle froth.",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80",
    tags: ["Rich Cocoa"],
    isPopular: false
  },
  {
    id: "cf-4",
    categoryId: "coffee",
    name: "Cold Coffee",
    price: 100,
    description: "Chilled blended coffee with milk, sweetness, and thick froth.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    tags: ["Chilled Classic"],
    isPopular: true
  },
  {
    id: "cf-5",
    categoryId: "coffee",
    name: "Black Coffee",
    price: 80,
    description: "Pure bold espresso roast extraction without milk.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    tags: ["Bold Roast"],
    isPopular: false
  },

  // ================= 12. MILKSHAKES =================
  {
    id: "ms-1",
    categoryId: "milkshakes",
    name: "Chocolate Milk Shake",
    price: 120,
    description: "Rich, cold, and creamy beverage made by blending milk, ice cream, and chocolate syrup or cocoa powder",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    tags: ["Ice Cream Blend"],
    isPopular: true
  },
  {
    id: "ms-2",
    categoryId: "milkshakes",
    name: "Strawberry Milk Shake",
    price: 120,
    description: "Cold, sweet, and creamy beverage made by blending milk, ice cream, and fresh or frozen strawberries",
    image: "https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80",
    tags: ["Real Berry Sweet"],
    isPopular: false
  },
  {
    id: "ms-3",
    categoryId: "milkshakes",
    name: "Butterscotch Milk Shake",
    price: 140,
    description: "Cold, and indulgent dessert drink made by blending milk, butterscotch ice cream, and butterscotch",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80",
    tags: ["Crunchy Caramel"],
    isPopular: false
  },
  {
    id: "ms-4",
    categoryId: "milkshakes",
    name: "Organic Rose Milk Shake",
    price: 100,
    description: "Blending chilled milk,ORGANIC rose syrup, and vanilla ice cream",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80",
    tags: ["Organic Rose", "Dessert Sip"],
    isPopular: false
  },
  {
    id: "ms-5",
    categoryId: "milkshakes",
    name: "Oreo Milk Shake",
    price: 140,
    description: "Blending milk, vanilla (or chocolate) ice cream, and Oreo chocolate sandwich cookies",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    tags: ["Oreo Cookie Crunch"],
    isPopular: true
  },

  // ================= 13. MOJITO DRINKS =================
  {
    id: "mj-1",
    categoryId: "mojito-drinks",
    name: "Minty Lemonade",
    price: 80,
    description: "Refreshing cooler with crushed fresh garden mint, lemon juice, and fizz.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    tags: ["Fresh Mint & Lime"],
    isPopular: false
  },
  {
    id: "mj-2",
    categoryId: "mojito-drinks",
    name: "Masala Lemonade",
    price: 100,
    description: "Tangy fresh lemonade spiced with roasted cumin and Indian rock salt.",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80",
    tags: ["Desi Spiced"],
    isPopular: false
  },
  {
    id: "mj-3",
    categoryId: "mojito-drinks",
    name: "Chilli Guava Mojito",
    price: 120,
    description: "Sweet guava nectar with a hint of chili spice rim and sparkling soda.",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
    tags: ["Sweet & Spicy"],
    isPopular: true
  },
  {
    id: "mj-4",
    categoryId: "mojito-drinks",
    name: "Watermelon Masala",
    price: 120,
    description: "Juicy watermelon cooler touched with black salt and mint leaves.",
    image: "https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=600&q=80",
    tags: ["Juicy Hydration"],
    isPopular: false
  },
  {
    id: "mj-5",
    categoryId: "mojito-drinks",
    name: "Blue Lagoon Mojito",
    price: 120,
    description: "Vibrant curacao flavor with bubbly citrus soda and fresh lime.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    tags: ["Signature Blue"],
    isPopular: true
  },
  {
    id: "mj-6",
    categoryId: "mojito-drinks",
    name: "Blueberry Breeze Mojito",
    price: 120,
    description: "Lush wild blueberry compote muddling with fresh mint and soda.",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80",
    tags: ["Wild Berry"],
    isPopular: false
  },
  {
    id: "mj-7",
    categoryId: "mojito-drinks",
    name: "Green Apple Mojito",
    price: 120,
    description: "Crisp green apple syrup, mint sprigs, and crushed ice splash.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
    tags: ["Crisp & Tart"],
    isPopular: false
  }
];

// Reference to scanned menu image assets for verification gallery
export const menuCards = [
  {
    title: "Breakfast, Smoothie & Sandwiches",
    image: "/menu/WhatsApp Image 2026-10-28 at 2.36.13 PM.jpeg"
  },
  {
    title: "Thin-Crust Pizzas & Pastas",
    image: "/menu/WhatsApp Image 2026-10-28 at 2.36.16 PM.jpeg"
  },
  {
    title: "Noodles, Maggi, Snacks, Burgers & Wraps",
    image: "/menu/WhatsApp Image 2026-10-28 at 2.36.17 PM.jpeg"
  },
  {
    title: "Chai, Chuski & Coffee Sips",
    image: "/menu/WhatsApp Image 2026-10-28 at 2.36.18 PM.jpeg"
  },
  {
    title: "Milkshakes & Mojito Drinks",
    image: "/menu/WhatsApp Image 2026-10-28 at 2.36.21 PM.jpeg"
  }
];
