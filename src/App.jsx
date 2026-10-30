import React, { useState, useEffect } from 'react';
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
import MenuScansModal from './components/MenuScansModal';
import OwnerNotesBadge from './components/OwnerNotesBadge';
import KitchenDashboard from './components/KitchenDashboard';

export default function App() {
  const [isScansModalOpen, setIsScansModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [currentView, setCurrentView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (params.get('view') === 'orders' || hash === '#orders' || path === '/orders') {
        return 'kitchen';
      }
      return 'customer';
    } catch {
      return 'customer';
    }
  });

  // Watch URL changes for /orders or #orders
  useEffect(() => {
    const handleLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (params.get('view') === 'orders' || hash === '#orders' || path === '/orders') {
        setCurrentView('kitchen');
      } else {
        setCurrentView('customer');
      }
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  const openKitchenView = () => {
    window.location.hash = 'orders';
    setCurrentView('kitchen');
  };

  const closeKitchenView = () => {
    window.location.hash = '';
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    setCurrentView('customer');
  };

  // If in Kitchen / Staff Slip Desk Mode
  if (currentView === 'kitchen') {
    return (
      <CartProvider>
        <KitchenDashboard onBackToWebsite={closeKitchenView} />
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-forest-950 font-sans selection:bg-[#234438] selection:text-[#FAF7F2]">
        
        {/* Navigation */}
        <Navbar 
          onOpenMenuScans={() => setIsScansModalOpen(true)}
          onOpenOwnerNotes={() => setIsNotesModalOpen(true)}
        />

        {/* Main Content Sections: MENU AS FIRST PRIORITY */}
        <main className="flex-1">
          <Hero />
          <DigitalMenu 
            onOpenMenuScans={() => setIsScansModalOpen(true)}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <PopularPicks />
          <LocationSection />
          <ContactWhatsApp />
        </main>

        {/* Footer */}
        <Footer 
          onOpenMenuScans={() => setIsScansModalOpen(true)}
          onOpenOwnerNotes={() => setIsNotesModalOpen(true)}
          onOpenKitchen={openKitchenView}
        />

        {/* Floating Quick Menu Navigator (Mobile & Desktop bottom right) */}
        <FloatingMenuNavigator 
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Floating / Interactive Modals and Drawers */}
        <WhatsAppCartDrawer />
        <MenuScansModal 
          isOpen={isScansModalOpen} 
          onClose={() => setIsScansModalOpen(false)} 
        />
        <OwnerNotesBadge 
          isOpen={isNotesModalOpen} 
          onClose={() => setIsNotesModalOpen(false)} 
        />

      </div>
    </CartProvider>
  );
}
