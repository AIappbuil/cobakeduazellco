import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data';
import { Testimonial } from '../types';
import { Star, MessageSquareQuote, Check, CloudLightning, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export default function Reviews() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('testimonials')
          .select('*')
          .order('id', { ascending: true });
        
        if (fetchErr) throw fetchErr;

        if (data && data.length > 0) {
          const mapped: Testimonial[] = data.map((item: any) => ({
            id: item.id.toString(),
            author: item.author,
            role: item.role,
            rating: Number(item.rating || 5),
            reviewText: item.review_text ?? item.reviewText ?? '',
            favoriteDrink: item.favorite_drink ?? item.favoriteDrink ?? '',
            date: item.date || ''
          }));
          setReviews(mapped);
        } else {
          setReviews(TESTIMONIALS);
        }
      } else {
        setReviews(TESTIMONIALS);
      }
    } catch (err: any) {
      console.error('Supabase testimonials fetch error:', err);
      setError(`Gagal memuat ulasan dari Supabase: ${err.message || err}. Menampilkan demo lokal.`);
      setReviews(TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-24 bg-stone-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
            suara para penikmat rasa
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            Ulasan Kritik & Apresiasi
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-400 font-sans text-sm md:text-base font-light max-w-2xl mx-auto font-sans leading-relaxed">
            Komitmen kami menjaga kualitas rasa saksama dinilai langsung oleh Q-Grader berasosiasi, jurnalis kuliner lokal, serta pelanggan harian setia kami.
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
              onClick={fetchReviews} 
              className="px-3 py-1.5 bg-red-900 hover:bg-red-850 rounded-lg text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Ulangi
            </button>
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-stone-900 border border-stone-850 p-8 rounded-3xl animate-pulse space-y-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 bg-stone-800 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-stone-800 rounded-md w-full" />
                  <div className="h-4 bg-stone-800 rounded-md w-5/6" />
                  <div className="h-4 bg-stone-800 rounded-md w-4/5" />
                </div>
                <div className="h-10 bg-stone-800 rounded-md w-1/3 pt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-stone-900 border border-stone-850 p-8 rounded-3xl relative flex flex-col justify-between hover:border-amber-900/40 transition-all shadow-xl group"
              >
                {/* Decorative quotation icon */}
                <div className="absolute top-6 right-6 text-stone-800 group-hover:text-amber-950/45 transition-colors">
                  <MessageSquareQuote className="w-10 h-10" />
                </div>

                <div className="space-y-6 relative z-10">
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-stone-300 font-sans text-sm font-light leading-relaxed italic">
                    "{rev.reviewText}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 mt-6 border-t border-stone-850 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-white text-sm">
                      {rev.author}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-500 block uppercase pt-0.5">
                      {rev.role}
                    </span>
                  </div>
                  
                  {/* Favorite Drink Badge */}
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-amber-500 uppercase block">Favoritnya</span>
                    <span className="text-stone-300 text-[10px] block mt-0.5 font-sans font-medium">{rev.favoriteDrink}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Local coffee scores section */}
        <div className="mt-16 bg-stone-900/30 border border-stone-850/80 rounded-2xl p-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 text-center items-center divide-y sm:divide-y-0 sm:divide-x divide-stone-800">
          <div>
            <div className="text-amber-500 font-serif text-3xl font-extrabold">9.6/10</div>
            <span className="text-[10px] font-mono text-stone-500 block uppercase mt-1">Manual Brew Rating (Coffee Critix)</span>
          </div>
          <div className="pt-4 sm:pt-0">
            <div className="text-amber-500 font-serif text-3xl font-extrabold">4.9★</div>
            <span className="text-[10px] font-mono text-stone-500 block uppercase mt-1">Google Maps Customer (1.2K+ Reviews)</span>
          </div>
          <div className="pt-4 sm:pt-0">
            <div className="text-amber-500 font-serif text-3xl font-extrabold">98%</div>
            <span className="text-[10px] font-mono text-stone-500 block uppercase mt-1">Customer Re-visit Recommendation</span>
          </div>
          <div className="pt-4 sm:pt-0">
            <div className="text-amber-500 font-serif text-3xl font-extrabold">Zero</div>
            <span className="text-[10px] font-mono text-stone-500 block uppercase mt-1">Defect Rate on Roasting Standards</span>
          </div>
        </div>

      </div>
    </section>
  );
}
