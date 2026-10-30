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
import MenuScansModal from './components/MenuScansModal';
import OwnerNotesBadge from './components/OwnerNotesBadge';

export default function App() {
  const [isScansModalOpen, setIsScansModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
