import { motion } from 'motion/react';
import { Coffee, Compass, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface HeroProps {
  onActionClick: (sectionId: string) => void;
}

export default function Hero({ onActionClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] bg-stone-950 flex items-center justify-center overflow-hidden py-16 px-4 md:px-8"
    >
      {/* Visual Ambient Background Underlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,60,20,0.18),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(80,40,10,0.15),transparent_40%)]" />

      {/* Grid subtle texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left column: Text Content */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-center text-center lg:text-left">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-500 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>THE PEAK OF NORDIC-COZY SENSORY EXPERIENCE</span>
          </motion.div>

          {/* Majestic Hero Headings */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            >
              Rasa Sempurna Dari{' '}
              <span className="text-amber-500 relative inline-block">
                Konsistensi Presisi
                <svg className="absolute left-0 bottom-[-8px] w-full h-[6px] text-amber-600/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-stone-300 font-sans text-sm md:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
            >
              Selamat datang di Zellco Coffee. Kami tidak sekadar melayani kopi; kami mempertemukan mikro-lot biji kopi pilihan bersertifikasi kualifikasi internasional (SCA 82+) dengan temperatur seduh saksama dan air bermineral seimbang demi membebaskan spektrum rasa yang ajaib.
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={() => onActionClick('menu')}
              className="group w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-stone-950 font-sans font-semibold text-xs tracking-wider uppercase px-7 py-4 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-amber-900/40 cursor-pointer"
            >
              <span>Explore Menu Specialty</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </button>
            <button
              onClick={() => onActionClick('barista')}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-850 text-amber-500 hover:text-amber-400 font-sans font-medium text-xs tracking-wider uppercase px-7 py-4 rounded-full border border-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Virtual Barista Matchmaker</span>
            </button>
          </motion.div>

          {/* Key Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 border-t border-stone-900 grid grid-cols-3 gap-4"
          >
            <div className="flex flex-col items-center lg:items-start space-y-1">
              <span className="text-amber-500 font-serif text-xl md:text-2xl font-semibold">100%</span>
              <span className="text-white font-sans text-[10px] md:text-xs text-stone-400 font-light tracking-wider">Arabika Single Origin</span>
            </div>
            <div className="flex flex-col items-center lg:items-start space-y-1">
              <span className="text-amber-500 font-serif text-xl md:text-2xl font-semibold">SCA 82+</span>
              <span className="text-white font-sans text-[10px] md:text-xs text-stone-400 font-light tracking-wider">Skor Sertifikasi Biji</span>
            </div>
            <div className="flex flex-col items-center lg:items-start space-y-1">
              <span className="text-amber-500 font-serif text-xl md:text-2xl font-semibold">91.4°C</span>
              <span className="text-white font-sans text-[10px] md:text-xs text-stone-400 font-light tracking-wider">Suhu Ekstraksi Presisi</span>
            </div>
          </motion.div>
        </div>

        {/* Right column: Artistic Image Display with Floating Card Accents */}
        <div className="lg:col-span-5 relative w-full flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 group"
          >
            {/* The primary hero image of slow bar extraction */}
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
              alt="Premium V60 Coffee extraction Zellco Coffee"
              className="absolute inset-0 w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark glass cover */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30" />

            {/* Float badge inside the layout */}
            <div className="absolute bottom-6 left-6 right-6 bg-stone-900/90 backdrop-blur-md p-4 rounded-xl border border-stone-800 shadow-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-amber-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-mono text-[9px] tracking-widest uppercase">Penyajian Higienis & Terlatih</span>
              </div>
              <p className="text-stone-300 font-sans text-xs font-light leading-relaxed">
                "Setiap tetesan air dipantau TDS-nya, memastikan cangkir Anda bebas cacat rasa."
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>BARISTA IN-HOUSE: LEVEL 3 SCA</span>
                <span>IDR 40K - 120K</span>
              </div>
            </div>
          </motion.div>

          {/* Decorative floating rings */}
          <div className="absolute -z-10 -right-16 -bottom-16 w-64 h-64 rounded-full border border-stone-900/50" />
          <div className="absolute -z-10 -left-16 -top-16 w-64 h-64 rounded-full border border-stone-900/50" />
        </div>
      </div>
    </section>
  );
}
