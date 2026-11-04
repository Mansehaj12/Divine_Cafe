import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import PopularPicks from './components/PopularPicks';
import LocationSection from './components/LocationSection';
import ContactWhatsApp from './components/ContactWhatsApp';
import Footer from './components/Footer';
import WhatsAppCartDrawer from './components/WhatsAppCartDrawer';
import BottomNav from './components/BottomNav';
import MenuPage from './components/MenuPage';
import NotFoundPage from './components/NotFoundPage';
import CustomerReviews from './components/CustomerReviews';
import FAQSection from './components/FAQSection';
import SplashScreen from './components/SplashScreen';
import InstallPWA from './components/InstallPWA';

function AppContent() {
  const { currentView, selectedCategory, setSelectedCategory } = useCart();

  // 1. CUSTOM 404 NOT FOUND PAGE
  if (currentView === '404') {
    return <NotFoundPage />;
  }

  // 2. DEDICATED MENU PAGE (NO bottom navigator bar on this page!)
  if (currentView === 'menu') {
    return (
      <MenuPage 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    );
  }

  // 3. HOME PAGE (Features Hero, Popular Picks, Values, Reviews, FAQs, Directions, & Fixed Bottom Nav)
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-forest-950 font-sans selection:bg-[#234438] selection:text-[#FAF7F2] pb-16 md:pb-0">
      
      {/* Navigation */}
      <Navbar />

      {/* Main Home Sections */}
      <main className="flex-1">
        <Hero />
        <PopularPicks />
        <Highlights />
        <CustomerReviews />
        <FAQSection />
        <LocationSection />
        <ContactWhatsApp />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full-Screen WhatsApp Cart Drawer */}
      <WhatsAppCartDrawer />

      {/* Mobile Fixed Bottom Navigation Bar (Home, Cart, Menu, My Orders) */}
      <BottomNav />

    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('divine_splash_seen');
    } catch {
      return true;
    }
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('divine_splash_seen', 'true');
    } catch {}
  };

  return (
    <CartProvider>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <AppContent />
      <InstallPWA />
    </CartProvider>
  );
}
