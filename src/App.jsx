import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import PopularPicks from './components/PopularPicks';
import DigitalMenu from './components/DigitalMenu';
import LocationSection from './components/LocationSection';
import ContactWhatsApp from './components/ContactWhatsApp';
import Footer from './components/Footer';
import WhatsAppCartDrawer from './components/WhatsAppCartDrawer';
import FloatingMenuNavigator from './components/FloatingMenuNavigator';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-forest-950 font-sans selection:bg-[#234438] selection:text-[#FAF7F2]">
        
        {/* Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <DigitalMenu 
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <PopularPicks />
          <LocationSection />
          <ContactWhatsApp />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Quick Menu Navigator (Mobile & Desktop bottom right) */}
        <FloatingMenuNavigator 
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* WhatsApp Cart Drawer */}
        <WhatsAppCartDrawer />

      </div>
    </CartProvider>
  );
}
