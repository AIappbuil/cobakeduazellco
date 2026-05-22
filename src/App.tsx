import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import MenuSection from './components/MenuSection';
import VirtualBarista from './components/VirtualBarista';
import SpaceGallery from './components/SpaceGallery';
import BookingForm from './components/BookingForm';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import { Sparkles, Calendar, Coffee, ChevronUp, Info } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scrolling to highlight navbar pills & show Back-to-Top trigger
  useEffect(() => {
    const handleScroll = () => {
      // Toggle back to top button visibility
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Highlight sections accurately based on their current viewing bounds
      const sections = ['hero', 'philosophy', 'menu', 'barista', 'gallery', 'booking', 'reviews'];
      const scrollPosition = window.scrollY + 120; // safe padding offset for upper navbar

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // approximate navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 selection:bg-amber-850 selection:text-amber-100 font-sans">
      
      {/* Upper Floating Navbar */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Sections Stack */}
      <main className="relative">
        
        {/* Informative Floating Alert Bar regarding non-ecommerce presentation standard */}
        <div className="bg-stone-900 border-b border-stone-800 text-stone-400 py-3 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                <strong>Informasi Kafe:</strong> Zellco Coffee adalah kafe fisik premium. Website ini berfungsi sebagai portal informasi kurasi menu & sarana reservasi meja secara real-time (Tidak ada sistem transaksi pembelian/pembayaran online).
              </span>
            </div>
            <button 
              onClick={() => handleScrollToSection('menu')}
              className="text-amber-500 hover:text-amber-400 font-semibold tracking-wide whitespace-nowrap text-[11px] underline"
            >
              Lihat Menu Kopi →
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <Hero onActionClick={handleScrollToSection} />

        {/* Philosophy / Story Section */}
        <Philosophy />

        {/* Interactive Menu Section */}
        <MenuSection />

        {/* Interactive Virtual Barista (Matchmaker) */}
        <VirtualBarista />

        {/* Interactive Gallery Section */}
        <SpaceGallery />

        {/* Seating Reservation Form */}
        <BookingForm />

        {/* Testimonials & Critics Section */}
        <Reviews />

      </main>

      {/* Sophisticated Coords footer */}
      <Footer />

      {/* Elegant Back to Top floating arrow */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-amber-600 hover:bg-amber-700 text-stone-950 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-amber-950/50 cursor-pointer"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </button>
      )}

    </div>
  );
}
