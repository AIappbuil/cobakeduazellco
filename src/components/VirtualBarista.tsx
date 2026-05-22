import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';
import { Coffee, Compass, ArrowRight, RotateCcw, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export default function VirtualBarista() {
  const [flavorPreference, setFlavorPreference] = useState<string | null>(null);
  const [intensityPreference, setIntensityPreference] = useState<string | null>(null);
  const [temperaturePreference, setTemperaturePreference] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [items, setItems] = useState<MenuItem[]>([]);
  
  useEffect(() => {
    async function fetchItems() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from('menu_items')
            .select('*')
            .order('id', { ascending: true });
          
          if (data && data.length > 0) {
            const mapped: MenuItem[] = data.map((item: any) => ({
              id: item.id.toString(),
              name: item.name,
              category: item.category,
              price: Number(item.price),
              description: item.description,
              tastingNotes: Array.isArray(item.tasting_notes) 
                ? item.tasting_notes 
                : (typeof item.tasting_notes === 'string' 
                    ? JSON.parse(item.tasting_notes) 
                    : []),
              intensity: Number(item.intensity || 0),
              acidity: item.acidity || 'None',
              origin: item.origin || '',
              imageUrl: item.image_url || item.imageUrl || '',
              isHotAvailable: item.is_hot_available ?? true,
              isIceAvailable: item.is_ice_available ?? true,
            }));
            setItems(mapped);
            return;
          }
        } catch (e) {
          console.error('Error loading menu items in Matchmaker:', e);
        }
      }
      setItems(MENU_ITEMS);
    }
    fetchItems();
  }, []);

  const getPool = () => items.length > 0 ? items : MENU_ITEMS;

  // Filter recommendations based on answers
  const matchedRecommendedDrink = (): MenuItem => {
    const pool = getPool();
    
    // helper to find item safely by name keywords
    const findByKeyword = (kw: string) => {
      const found = pool.find(item => item.name.toLowerCase().includes(kw));
      return found;
    };

    if (flavorPreference === 'fruity') {
      if (temperaturePreference === 'ice') {
        const matches = pool.filter(item => item.category === 'specialty' && (item.tastingNotes.some(note => note.toLowerCase().includes('lemon') || note.toLowerCase().includes('blackberry'))));
        if (matches.length > 0) return matches[0];
        return findByKeyword('lavender') || pool[2] || pool[0];
      } else {
        return findByKeyword('geisha') || findByKeyword('panama') || pool[6] || pool[0];
      }
    }

    if (flavorPreference === 'chocolate') {
      if (intensityPreference === 'high') {
        return findByKeyword('piccolo') || pool[3] || pool[0];
      } else {
        return findByKeyword('creme') || findByKeyword('zellco') || pool[0];
      }
    }

    if (flavorPreference === 'bold') {
      if (temperaturePreference === 'hot') {
        return findByKeyword('flat') || findByKeyword('spiced') || pool[4] || pool[0];
      } else {
        return findByKeyword('shakerato') || pool[5] || pool[0];
      }
    }

    if (flavorPreference === 'sweet') {
      return findByKeyword('babka') || pool.find(item => item.category === 'pastry') || pool[9] || pool[0];
    }

    // safe fallback
    return pool[0];
  };

  const handleReset = () => {
    setFlavorPreference(null);
    setIntensityPreference(null);
    setTemperaturePreference(null);
    setStep(1);
  };

  const selectedMatched = matchedRecommendedDrink();

  return (
    <section id="barista" className="py-24 bg-stone-900 border-t border-b border-stone-850/60 relative overflow-hidden text-white">
      {/* Visual glowing blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-950/20 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
            interactive virtual matchmaking
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            Cari Cangkir Kopi Ideal Anda
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-400 font-sans text-sm md:text-base font-light max-w-xl mx-auto">
            Gunakan asisten pintar racikan sensorik barista Zellco untuk mencocokkan kondisi emosi dan selera lidah Anda saat ini dengan seduhan kopi terbaik kami.
          </p>
        </div>

        {/* Dynamic Card Container */}
        <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
            {[1, 2, 3, 'Hasil'].map((item, idx) => {
              const itemStep = idx + 1;
              const isComp = step > itemStep || (item === 'Hasil' && step === 4);
              const isCurr = step === itemStep || (item === 'Hasil' && step === 4);
              return (
                <div key={idx} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                    isComp ? 'bg-amber-600 text-stone-950 border-amber-600' :
                    isCurr ? 'bg-amber-950 text-amber-500 border-2 border-amber-600 scale-110' :
                    'bg-stone-900 text-stone-500 border border-stone-800'
                  }`}>
                    {isComp ? <Check className="w-4 h-4" /> : item}
                  </div>
                  {idx < 3 && (
                    <div className={`h-[1px] w-8 md:w-16 ${
                      step > itemStep ? 'bg-amber-600' : 'bg-stone-800'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: FLAVOR PROFILE */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="font-serif text-lg md:text-xl font-bold mb-2">1. Profil aroma apa yang lidah Anda cari hari ini?</h3>
                  <p className="text-stone-400 font-sans text-xs md:text-sm font-light">PILIH SATU OPSI DASAR:</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    { id: 'fruity', title: 'Segar, Asam Buah & Bunga', desc: 'Suka sensasi raspberry berry, teh herba jasmine, jeruk sitrus cerah.' },
                    { id: 'chocolate', title: 'Cokelat, Almond & Karamel', desc: 'Nyaman dengan aroma manis mentega legit, cokelat panggang, kacang renyah.' },
                    { id: 'bold', title: 'Pekat & Berempah', desc: 'Menginginkan sensasi bumi basah, kayumanis herba, pahit pekat berkelas.' },
                    { id: 'sweet', title: 'Manis Gurih (Non-Kopi / Pastry)', desc: 'Sedang tidak ingin kopi, mencari roti lembut bersalut mentega murni.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setFlavorPreference(opt.id);
                        setStep(2);
                      }}
                      className="text-left bg-stone-900 border border-stone-800 hover:border-amber-600/60 p-5 rounded-2xl transition-all hover:bg-stone-900/50 cursor-pointer text-stone-300 hover:text-white"
                    >
                      <span className="font-serif font-semibold text-sm md:text-base block mb-1 text-amber-500">{opt.title}</span>
                      <span className="font-sans text-xs font-light leading-relaxed block text-stone-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: INTENSITY / BODY */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <button onClick={() => setStep(1)} className="text-xs text-amber-500 font-mono hover:underline mb-2 hover:text-amber-400">← KEMBALI KE LANGKAH SEBELUMNYA</button>
                  <h3 className="font-serif text-lg md:text-xl font-bold mb-2">2. Bagaimana tingkat kepahitan / tekstur kepekatan cairan yang Anda hargai?</h3>
                  <p className="text-stone-400 font-sans text-xs md:text-sm font-light">KETEBALAN CAIRAN KOPI (BODY):</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {[
                    { id: 'low', title: 'Sangat Enteng / Ringan', desc: 'Menyerupai teh, bening transparan tanpa ampas, sangat nyaman di lambung.' },
                    { id: 'medium', title: 'Seimbang, Lembut & Susu', desc: 'Tekstur creamy susu gandum, lumer lembut menutupi lidah menyeluruh.' },
                    { id: 'high', title: 'Tinggi, Lekat & Sangat Pekat', desc: 'Tembakan ristretto murni ganda yang menekan kuat pangkal lidah Anda.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setIntensityPreference(opt.id);
                        setStep(3);
                      }}
                      className="text-left bg-stone-900 border border-stone-800 hover:border-amber-600/60 p-5 rounded-2xl transition-all hover:bg-stone-900/50 cursor-pointer text-stone-300 hover:text-white"
                    >
                      <span className="font-serif font-semibold text-xs md:text-sm block mb-1 text-amber-500">{opt.title}</span>
                      <span className="font-sans text-[11px] font-light leading-relaxed block text-stone-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: ICE / HOT */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <button onClick={() => setStep(2)} className="text-xs text-amber-500 font-mono hover:underline mb-2 hover:text-amber-400">← KEMBALI KE LANGKAH SEBELUMNYA</button>
                  <h3 className="font-serif text-lg md:text-xl font-bold mb-2">3. Terakhir, apa preferensi temperatur Anda saat ini?</h3>
                  <p className="text-stone-400 font-sans text-xs md:text-sm font-light">SUASANA DAN TEMPERATUR:</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg mx-auto">
                  {[
                    { id: 'hot', title: 'Sajian Hangat Klasik', desc: 'Menyeruput asap hangat perlahan, ritual menenangkan yang intim.' },
                    { id: 'ice', title: 'Es Dingin Menyegarkan', desc: 'Pereda dahaga yang bertenaga ceria menghadapi siang terik.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setTemperaturePreference(opt.id);
                        setStep(4);
                      }}
                      className="text-left bg-stone-900 border border-stone-800 hover:border-amber-600/60 p-5 rounded-2xl transition-all hover:bg-stone-900/50 cursor-pointer text-stone-300 hover:text-white"
                    >
                      <span className="font-serif font-semibold text-sm block mb-1 text-amber-500">{opt.title}</span>
                      <span className="font-sans text-xs font-light leading-relaxed block text-stone-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RESULT */}
            {step === 4 && selectedMatched && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs font-mono uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kopi Anda Ditemukan!</span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">
                  Barista Menyukai Ini Untuk Anda:
                </h3>

                {/* Matchmaking Result Show Card */}
                <div className="bg-stone-900 border border-stone-850 p-6 md:p-8 rounded-3xl max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-6 items-center text-left">
                  
                  {/* Item Image */}
                  <div className="sm:col-span-5 aspect-square rounded-2xl overflow-hidden border border-stone-800 bg-stone-950">
                    <img
                      src={selectedMatched.imageUrl}
                      alt={selectedMatched.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item text info */}
                  <div className="sm:col-span-7 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase">
                        Kategori: {selectedMatched.category.toUpperCase()}
                      </span>
                      <h4 className="font-serif text-lg md:text-xl font-bold text-white leading-tight">
                        {selectedMatched.name}
                      </h4>
                      <p className="text-amber-500 font-serif font-bold text-xs">
                        IDR {new Intl.NumberFormat('id-ID').format(selectedMatched.price)}
                      </p>
                    </div>

                    <p className="text-stone-400 font-sans text-xs md:text-sm font-light leading-relaxed">
                      {selectedMatched.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {selectedMatched.tastingNotes.map((note, idx) => (
                        <span key={idx} className="bg-stone-950 border border-stone-850 px-2 py-0.5 rounded text-[9px] font-mono text-amber-400 font-semibold">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Custom feedback explanation */}
                <div className="text-stone-400 font-sans text-xs md:text-sm leading-relaxed max-w-xl mx-auto p-4 rounded-xl bg-amber-950/10 border border-amber-900/10 italic font-light">
                  "Barista Note: Karena Anda memilih aroma rasa{' '}
                  <span className="text-amber-500 font-semibold font-mono">
                    {flavorPreference === 'fruity' ? 'Buah Segar' : flavorPreference === 'chocolate' ? 'Cokelat Karamel' : flavorPreference === 'bold' ? 'Rempah Pekat' : 'Kekayaan Roti'}
                  </span>{' '}
                  dengan intensitas tingkat{' '}
                  <span className="text-amber-500 font-semibold font-mono">
                    {intensityPreference === 'low' ? 'Enteng' : intensityPreference === 'medium' ? 'Seimbang' : 'Pekat Tinggi'}
                  </span>{' '}
                  dan dihidangkan{' '}
                  <span className="text-amber-500 font-semibold font-mono">
                    {temperaturePreference === 'ice' ? 'Dingin' : 'Hangat'}
                  </span>
                  , minuman di atas akan memanjakan syaraf sensoris Anda secara presisi tanpa merusak ekspektasi rasa."
                </div>

                {/* Reset / restart matchmaking */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-850 hover:text-white border border-stone-800 transition-all font-sans text-xs text-stone-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ulangi Tes Barista</span>
                  </button>
                  <button
                    onClick={() => {
                      const element = document.getElementById('booking');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-sans font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Pesan Meja Di Slow Bar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
