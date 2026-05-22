import { motion } from 'motion/react';
import { Eye, Droplet, Flame, Compass } from 'lucide-react';

export default function Philosophy() {
  const pillars = [
    {
      icon: <Eye className="w-6 h-6 text-amber-500" />,
      title: 'Transparansi Penuh Biji Kopi',
      subtitle: 'Sourcing Langsung & Adil',
      description: 'Kami bekerja sama langsung dengan kelompok petani mikro di Kerinci, Solok, Flores, dan Gayo. Membayar hingga 40% di atas harga pasar Fairtrade demi kualitas biji kopi teratas dan masa depan pertanian berkelanjutan.',
    },
    {
      icon: <Droplet className="w-6 h-6 text-amber-500" />,
      title: 'Presisi Kimia Air (RO & TDS)',
      subtitle: 'Filter 5-Tahap Khusus',
      description: 'Air menyusun 98% cangkir Anda. Zellco menerapkan filtrasi Reverse Osmosis yang dimonitor terus-menerus, lalu memformulasi ulang mineral kalsium dan magnesium pada tingkat 120 - 150 TDS khusus untuk kepekatan terekstraksi tinggi.',
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      title: 'Penyangraian Mikro Artisanal',
      subtitle: 'Hanya Batches Berbobot Kecil',
      description: 'Disangrai in-house menggunakan mesin roasting kustom berkapasitas 2kg. Kontrol kurva suhu sensorik yang ultra sensitif melepaskan gula karamelisasi alamiah tanpa membakar minyak volatil di dalam biji.',
    },
  ];

  return (
    <section id="philosophy" className="py-24 bg-stone-900 border-t border-b border-stone-900/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section with modern letter-spacing and font combinations */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
            filosofi seduh zellco
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Bagaimana Kami Menyunting Cita Rasa
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-400 font-sans text-sm md:text-base font-light max-w-2xl mx-auto">
            Kami percaya kopi bukanlah sekadar asupan kafein pagi hari. Ia adalah karya seni sains yang menuntut kesabaran, sensitivitas rasa, dan perkakas presisi tinggi.
          </p>
        </div>

        {/* Pillars Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-stone-950 p-8 rounded-2xl border border-stone-800 hover:border-amber-900/40 hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center transition-colors group-hover:bg-amber-900/30">
                  {pillar.icon}
                </div>
                <div className="space-y-2">
                  <span className="text-amber-500 font-mono text-[10px] tracking-wider uppercase block">
                    {pillar.subtitle}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-stone-400 font-sans text-xs md:text-sm leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              {/* Little technical coordinate as accent (Anti-AI-slop rule warning: keep it clean, but realistic details of the process) */}
              <div className="mt-8 pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] font-mono text-stone-600">
                <span>EST: 2026/SCA-APPROVED</span>
                <span>ZELLCO LABS</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-amber-950/10 via-amber-900/10 to-transparent p-6 md:p-8 rounded-2xl border border-amber-900/20 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="w-12 h-12 rounded-full bg-amber-600 flex-shrink-0 flex items-center justify-center text-stone-950 font-serif text-xl font-bold">
            “
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-stone-300 font-sans text-sm italic font-light">
              "Seduhan terbaik lahir saat kita membebaskan kopi menceritakan kisah dari tanah tempatnya tumbuh, tanpa ditutup oleh pembakaran berlebih."
            </p>
            <span className="text-[11px] font-mono tracking-wider text-amber-500 uppercase block mt-1">
              — Yuda Zellco, Head Roaster & Co-Founder
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
