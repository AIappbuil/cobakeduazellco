import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Menu, X, Clock, MapPin, Phone } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'philosophy', label: 'Filosofi' },
    { id: 'menu', label: 'Menu Premium' },
    { id: 'barista', label: 'Virtual Barista' },
    { id: 'gallery', label: 'Galeri Ruang' },
    { id: 'booking', label: 'Special Booking' },
    { id: 'reviews', label: 'Ulasan' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of floating navbar
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
    <>
      {/* Top micro-banner for operational status */}
      <div className="bg-amber-950/90 text-amber-100 text-[10px] md:text-xs font-mono tracking-wider py-1.5 px-4 flex justify-between items-center border-b border-amber-900/30 z-50 relative">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>SETIAP HARI: 07.00 - 23.00 WIB</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Jl. Senopati No. 42, Jkt SEL</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>+62 812-3456-7890</span>
          </div>
        </div>
        <div className="text-amber-400 font-semibold tracking-widest text-[9px] md:text-[10px]">
          BREWING EXCELLENCE
        </div>
      </div>

      <header
        id="navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-900/95 backdrop-blur-md shadow-xl border-b border-stone-800 py-3'
            : 'bg-stone-950/80 backdrop-blur-sm border-b border-stone-900/50 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Elegant Branding logo with Moniker info */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => handleNavClick('hero')}
            >
              <div className="w-10 h-10 rounded-full bg-amber-900/30 border border-amber-600/50 flex items-center justify-center transition-transform group-hover:rotate-12">
                <Coffee className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-white leading-none block">
                  ZELLCO
                </span>
                <span className="text-[9px] font-mono tracking-[0.25em] text-amber-500 block uppercase leading-none">
                  coffee premium
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-amber-900/40 border border-amber-600/35 rounded-full z-0"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* CTA Reserve Fast Button */}
            <div className="hidden sm:block">
              <button
                onClick={() => handleNavClick('booking')}
                className="bg-amber-600 hover:bg-amber-700 text-stone-950 font-sans font-semibold tracking-wider text-xs px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-950/50 cursor-pointer"
              >
                Inquire Table
              </button>
            </div>

            {/* Mobile Hamburger menu */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-md transition-all cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-stone-950 border-t border-stone-800"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all ${
                        isActive
                          ? 'bg-amber-950/50 text-amber-400 border-l-4 border-amber-500 font-semibold pl-6'
                          : 'text-stone-400 hover:text-white hover:bg-stone-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
                <div className="pt-4 border-t border-stone-850">
                  <button
                    onClick={() => handleNavClick('booking')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 text-center font-semibold text-xs py-3 rounded-lg select-none"
                  >
                    Booking Slow Bar & Meja
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
