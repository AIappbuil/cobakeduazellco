import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';
import { Search, Flame, Droplets, Compass, ThermometerSun, Snowflake, SlidersHorizontal, ArrowUpDown, X, Check, Heart, HelpCircle, HardDrive, Wifi, CloudLightning, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'specialty' | 'espresso' | 'manual' | 'pastry'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'intensity-desc'>('default');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isFavorite, setIsFavorite] = useState<Record<string, boolean>>({});

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'specialty', label: 'Zellco Signature' },
    { id: 'espresso', label: 'Espresso-Based' },
    { id: 'manual', label: 'Manual Brew (V60 & Syphon)' },
    { id: 'pastry', label: 'Patisserie & Pastry' },
  ];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('menu_items')
          .select('*')
          .order('id', { ascending: true });
        
        if (fetchErr) throw fetchErr;

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
        } else {
          setItems(MENU_ITEMS);
        }
      } else {
        // Fallback to local static data
        setItems(MENU_ITEMS);
      }
    } catch (err: any) {
      console.error('Supabase fetch error:', err);
      setError(`Gagal memuat data dari Supabase: ${err.message || err}. Menampilkan demo lokal.`);
      setItems(MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.origin.toLowerCase().includes(query) ||
        item.tastingNotes.some(note => note.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'intensity-desc') {
      result.sort((a, b) => b.intensity - a.intensity);
    }

    return result;
  }, [items, selectedCategory, searchQuery, sortBy]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section id="menu" className="py-24 bg-stone-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Supabase Status Indicator Banner */}
        <div className="flex justify-center mb-8">
          {isSupabaseConfigured ? (
            <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Terkoneksi (Supabase) • Storage ZellCo</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-950/40 border border-amber-900/40 rounded-full px-4 py-1.5 text-xs text-amber-400 font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Demo Mode (Data Lokal) • Konfigurasi Supabase untuk Sinkronisasi</span>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
            curated selection
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Menu Kopi & Pastry Seniman Kami
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-400 font-sans text-sm md:text-base font-light">
            Klik salah satu suguhan untuk melihat visual detail, kadar keasaman, intensitas panggang, resep barista, serta pasangan makanan idealnya.
          </p>
        </div>

        {/* Error Alert Bar */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/40 text-red-200 p-4 rounded-xl mb-8 flex items-center gap-3 text-xs md:text-sm font-sans">
            <CloudLightning className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-grow">
              <strong>Info Supabase:</strong> {error}
            </div>
            <button 
              onClick={fetchMenu} 
              className="px-3 py-1.5 bg-red-900 hover:bg-red-850 rounded-lg text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Search, Filter, & Sorting Interface */}
        <div className="bg-stone-900/60 p-4 md:p-6 rounded-2xl border border-stone-850/80 mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                placeholder="Cari kopi, aroma rasa, atau daerah asal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs md:text-sm text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Combo */}
            <div className="relative md:col-span-6 flex items-center gap-2 justify-end">
              <div className="flex items-center gap-1.5 text-stone-400 font-mono text-xs whitespace-nowrap">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
                <span>Urutkan:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-950 border border-stone-800 text-stone-300 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-sans cursor-pointer min-w-[160px]"
              >
                <option value="default">Default Kurasi</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="intensity-desc">Sensasi Paling Pekat</option>
              </select>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-850">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-amber-600 text-stone-950 font-semibold shadow-md shadow-amber-950/40'
                    : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-850'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="aspect-[4/3] w-full bg-stone-950" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <div className="h-5 bg-stone-800 rounded-md w-1/2" />
                    <div className="h-5 bg-stone-800 rounded-md w-1/4" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-stone-800 rounded-md w-full" />
                    <div className="h-3.5 bg-stone-800 rounded-md w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-stone-800 rounded-md w-16" />
                    <div className="h-6 bg-stone-800 rounded-md w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 border border-stone-850/80 rounded-2xl max-w-xl mx-auto">
            <Search className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <p className="text-stone-400 font-sans text-sm font-light">Tidak ada menu yang sesuai dengan pencarian Anda.</p>
          </div>
        ) : (
          /* Menu Grid */
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(item)}
                className="bg-stone-900 border border-stone-800 hover:border-amber-900/40 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between shadow-lg transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-amber-900/10"
              >
                {/* Product Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-70" />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md text-[10px] font-mono tracking-widest text-amber-500 py-1 px-2.5 rounded-md border border-amber-900/30 uppercase">
                    {item.category === 'specialty' ? 'Signature' : item.category}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-850 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Hot/Cold availability icons */}
                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {item.isHotAvailable && (
                      <span className="bg-amber-950/70 border border-amber-800/40 p-1.5 rounded-full text-amber-500" title="Hot available">
                        <ThermometerSun className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {item.isIceAvailable && (
                      <span className="bg-blue-950/70 border border-blue-900/40 p-1.5 rounded-full text-blue-400" title="Ice available">
                        <Snowflake className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-amber-500 font-serif font-semibold text-sm md:text-base whitespace-nowrap">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <p className="text-stone-400 font-sans text-xs md:text-sm line-clamp-2 md:line-clamp-3 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-stone-850 text-xs text-stone-400">
                    <div className="flex gap-1 flex-wrap">
                      {item.tastingNotes.map((note, idx) => (
                        <span key={idx} className="bg-stone-950 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-stone-850">
                          {note}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                      <span>ASAL: {item.origin}</span>
                      <span className="flex items-center gap-1">
                        Intensitas: 
                        <span className="text-white font-bold">{item.intensity}/5</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

        {/* --- MENU DETAIL ACCORDION MODAL --- */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
              >
                {/* Header Picture Inside Modal */}
                <div className="relative aspect-[16/9] w-full flex-shrink-0 bg-stone-950">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900" />
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-amber-600 text-stone-950 text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                      {selectedItem.category.toUpperCase()} SPECIALIST
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                      {selectedItem.name}
                    </h3>
                  </div>
                </div>

                {/* Details Scroll Content */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-stone-300 font-sans text-sm font-light leading-relaxed">
                  
                  <div className="flex justify-between items-center bg-stone-950 p-4 rounded-xl border border-stone-850">
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 block uppercase">Harga Spesial</span>
                      <span className="font-serif text-lg font-bold text-amber-500">{formatPrice(selectedItem.price)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-stone-500 block uppercase">Metode Asal Biji</span>
                      <span className="text-xs text-stone-300 font-medium block mt-0.5">{selectedItem.origin}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-white text-xs md:text-sm tracking-wide uppercase">Deskripsi Rasa & Karakteristik</h4>
                    <p>{selectedItem.description}</p>
                  </div>

                  {/* Technical Sensor Spec sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-850">
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 block uppercase mb-1">Kadar Keasaman (Acidity)</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                          selectedItem.acidity === 'High' ? 'bg-red-950/50 text-red-400 border border-red-900/40' :
                          selectedItem.acidity === 'Medium' ? 'bg-amber-950/50 text-amber-400 border border-amber-900/40' :
                          selectedItem.acidity === 'Low' ? 'bg-green-950/50 text-green-400 border border-green-905/40' :
                          'bg-stone-900 text-stone-500 border border-stone-800'
                        }`}>
                          {selectedItem.acidity} Acidity
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-stone-500 block uppercase mb-1">Profil Intensitas Seduh (1-5)</span>
                      <div className="flex items-center gap-1.5 pt-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2.5 w-6 rounded-sm ${
                              idx < selectedItem.intensity ? 'bg-amber-500' : 'bg-stone-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recipes / Infographics */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-white text-xs md:text-sm tracking-wide uppercase">Spesifikasi Seduh Zellco Barista</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-stone-400 bg-stone-950/30 p-4 rounded-xl border border-stone-850">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Saran Penyajian: {selectedItem.isHotAvailable ? 'Panas' : ''} {selectedItem.isHotAvailable && selectedItem.isIceAvailable ? 'atau' : ''} {selectedItem.isIceAvailable ? 'Dingin' : ''}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Rasio Seduh: 1:15 Presisi Air Mineral</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Suhu Air: 91 - 93 derajat Celsius</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Rekomendasi Food Pairing: {selectedItem.category === 'pastry' ? 'Kopi Hitam Manual Brew' : 'Artisan Butter Croissant'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="w-full bg-stone-950 hover:bg-stone-850 text-amber-500 hover:text-amber-400 border border-stone-800 text-center font-semibold text-xs py-3.5 rounded-xl cursor-pointer"
                    >
                      Tutup Detail Kopi
                    </button>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
