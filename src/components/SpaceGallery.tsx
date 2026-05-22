import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';
import { Maximize2, X, Compass, ArrowRight, CloudLightning, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export default function SpaceGallery() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'indoor' | 'outdoor' | 'slowbar'>('all');
  const [zoomedImage, setZoomedImage] = useState<GalleryItem | null>(null);

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'Seluruh Sudut Kafe' },
    { id: 'slowbar', label: 'Slow Bar Seduh Intim' },
    { id: 'indoor', label: 'Ruang Dalam (Study Space)' },
    { id: 'outdoor', label: 'Kebun Kaca (Greenhouse)' },
  ];

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('gallery_items')
          .select('*')
          .order('id', { ascending: true });
        
        if (fetchErr) throw fetchErr;

        if (data && data.length > 0) {
          const mapped: GalleryItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            description: item.description,
            imageUrl: item.image_url ?? item.imageUrl ?? '',
            category: item.category
          }));
          setGallery(mapped);
        } else {
          setGallery(GALLERY_ITEMS);
        }
      } else {
        setGallery(GALLERY_ITEMS);
      }
    } catch (err: any) {
      console.error('Supabase gallery fetch error:', err);
      setError(`Gagal memuat galeri dari Supabase: ${err.message || err}. Menampilkan demo lokal.`);
      setGallery(GALLERY_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredGallery = gallery.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  return (
    <section id="gallery" className="py-24 bg-stone-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
            architectural ambient space
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            Estetika Ruang Zellco Coffee
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-400 font-sans text-sm md:text-base font-light">
            Kami menciptakan ruang dengan kesadaran akustik peredam bising, pencahayaan alami matahari yang lembut, serta sentuhan tanaman hijau agar cangkir kopi Anda dinikmati dengan kenyamanan meditasi penuh.
          </p>
        </div>

        {/* Error Alert Bar */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/40 text-red-200 p-4 rounded-xl mb-8 flex items-center justify-between gap-3 text-xs md:text-sm font-sans max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <CloudLightning className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span><strong>Info Supabase:</strong> {error}</span>
            </div>
            <button 
              onClick={fetchGallery} 
              className="px-3 py-1.5 bg-red-900 hover:bg-red-850 rounded-lg text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Ulangi
            </button>
          </div>
        )}

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-amber-950 border-2 border-amber-600 text-amber-400 font-semibold'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-850'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 4].map((idx) => (
              <div key={idx} className="aspect-[16/10] bg-stone-900 border border-stone-850 rounded-3xl overflow-hidden shadow-lg animate-pulse relative">
                <div className="absolute inset-x-6 bottom-6 space-y-2">
                  <div className="h-3 bg-stone-800 rounded w-1/4" />
                  <div className="h-5 bg-stone-800 rounded w-1/2" />
                  <div className="h-3 bg-stone-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Gallery Grid */
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setZoomedImage(item)}
                  className="group relative aspect-[16/10] rounded-3xl overflow-hidden border border-stone-850 bg-stone-900 cursor-pointer shadow-xl hover:shadow-2xl hover:border-amber-900/40 transition-all"
                >
                  {/* Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark Shaddow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Hover Maximize Icon */}
                  <div className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-950/80 border border-stone-800 text-stone-400 group-hover:text-white group-hover:scale-110 transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Bottom detail tags */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-1">
                    <span className="text-[9px] font-mono tracking-wider text-amber-500 uppercase block">
                      {item.category === 'slowbar' ? 'Slow Bar Place' : item.category === 'indoor' ? 'Indoor Space' : 'Outdoor Space'}
                    </span>
                    <h3 className="font-serif text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-stone-300 font-sans text-xs font-light line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Spatial architecture quick bullet point benefits */}
        <div className="mt-16 bg-stone-900/40 p-8 rounded-2xl border border-stone-850/80 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wide">Desain Akustik Tenang</h4>
            <p className="text-stone-400 font-sans text-xs leading-relaxed font-light">
              Menerapkan dinding penyerap gaung untuk meredam kebisingan jalan perkotaan, menjaga obrolan intim tetap nyaman didengar.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wide">Stasiun Digital Nomad</h4>
            <p className="text-stone-400 font-sans text-xs leading-relaxed font-light">
              Dilengkapi soket listrik universal yang disisipkan rapi di bawah meja jati dan koneksi internet serat optik dedicated 100 Mbps.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wide">Pencarian Pintu Speakeasy</h4>
            <p className="text-stone-400 font-sans text-xs leading-relaxed font-light">
              Pintu masuk kami sedikit tersembunyi di balik dinding tanaman ivy rambat Senopati — sebuah pelarian privat dari kepenatan kota.
            </p>
          </div>
        </div>

        {/* Spatial Lightbox Expansion */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedImage(null)}
              className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 max-w-3xl w-full shadow-2xl space-y-4 p-4 flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
                  <img
                    src={zoomedImage.imageUrl}
                    alt={zoomedImage.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setZoomedImage(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/85 text-stone-300 hover:text-white border border-stone-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="px-3 pb-3 space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase">
                    {zoomedImage.category.toUpperCase()} SANCTUARY AREA
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {zoomedImage.title}
                  </h3>
                  <p className="text-stone-400 font-sans text-xs md:text-sm font-light leading-relaxed">
                    {zoomedImage.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
