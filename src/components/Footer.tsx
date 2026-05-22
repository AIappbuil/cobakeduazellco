import { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Compass, Clock, Copy, Check } from 'lucide-react';

export default function Footer() {
  const [copyStatus, setCopyStatus] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan, 12190');
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <footer className="bg-stone-950 text-white pt-24 pb-12 border-t border-stone-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-900">
          
          {/* Column 1: Brand Concept */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-950/40 border border-amber-600/50 flex items-center justify-center text-amber-500 font-serif font-bold text-lg">
                Z
              </div>
              <div>
                <span className="font-serif text-lg md:text-xl font-bold tracking-widest block">
                  ZELLCO COFFEE
                </span>
                <span className="text-[9px] font-mono tracking-[0.25em] text-amber-500 uppercase block">
                  senopati sanctuary
                </span>
              </div>
            </div>

            <p className="text-stone-400 font-sans text-xs md:text-sm leading-relaxed font-light">
              Bukan sekadar tempat minum kopi, Zellco adalah pelarian intim bagi penikmat rasa presisi tinggi di tengah kepenatan megapolitan Jakarta.
            </p>

            {/* Social handles */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">Ikuti Akun Resmi Kami</span>
              <div className="flex items-center gap-3">
                <a href="#instagram" className="w-8 h-8 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-400 hover:text-amber-500 hover:border-amber-900/40 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#journey" className="w-8 h-8 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-400 hover:text-amber-500 hover:border-amber-900/40 transition-colors">
                  <Compass className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Hours / Operations schedules */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-amber-500">
              Jam Operasional & Seduh
            </h4>
            
            <ul className="space-y-4 font-sans text-xs font-light text-stone-400 leading-relaxed">
              <li className="flex justify-between border-b border-stone-900 pb-2">
                <span>Senin - Kamis (Slow Brew)</span>
                <span className="text-white font-mono">07:00 - 22:00</span>
              </li>
              <li className="flex justify-between border-b border-stone-900 pb-2">
                <span>Jumat - Sabtu (Midnight Lounge)</span>
                <span className="text-white font-mono">07:00 - 24:00</span>
              </li>
              <li className="flex justify-between border-b border-stone-900 pb-2">
                <span>Minggu (Morning Vibe)</span>
                <span className="text-white font-mono">06:00 - 22:00</span>
              </li>
              <li className="text-[11px] text-stone-500 italic">
                *Stasiun espresso tutup 15 menit sebelum jam operasional berakhir. Manual brew slow bar melayani sepanjang waktu.
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details & Simulated Map interactive */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-amber-500">
              Koordinat Lokasi & Peta
            </h4>

            {/* Simulated premium black minimap */}
            <div className="bg-stone-900 rounded-2xl border border-stone-850/80 p-4 relative overflow-hidden group">
              <div className="w-full h-32 rounded-xl bg-stone-950/80 border border-stone-900 relative overflow-hidden flex flex-col justify-center items-center">
                {/* Abstract grid representation of Senopati No 42 */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Visual streets */}
                <div className="absolute top-1/2 left-0 w-full h-3 bg-stone-900/40 -translate-y-1/2" />
                <div className="absolute top-0 left-1/3 w-3 h-full bg-stone-900/40" />

                <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-amber-500 rounded-full animate-ping opacity-60" />
                <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-amber-600 rounded-full border border-white flex items-center justify-center z-10" />

                <div className="absolute bottom-2 left-3 text-[9px] font-mono text-stone-500">
                  KEBAYORAN BARU, SOUTH JAKARTA
                </div>
                <div className="absolute top-2 right-3 text-[10px] font-serif tracking-widest text-amber-500 font-bold uppercase">
                  ZELLCO MAPS
                </div>
              </div>

              {/* Interaction parameters */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-stone-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>Jl. Senopati No. 42 (Pintu Tanaman Ivy)</span>
                  </span>
                  <p className="font-sans text-[11px] text-stone-500 leading-tight">
                    Tepat di samping halte Senopati, cari gerbang tanaman ivy hijau privat di sisi kiri jalan.
                  </p>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-950 hover:bg-stone-850 transition-colors border border-stone-800 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer hover:text-white text-stone-300 self-start sm:self-center"
                >
                  {copyStatus ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick direct contacts info */}
            <div className="grid grid-cols-2 gap-4 text-xs font-light text-stone-400">
              <a href="tel:+6281234567890" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </a>
              <a href="mailto:sanctuary@zellco.coffee" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>sanctuary@zellco.coffee</span>
              </a>
            </div>

          </div>

        </div>

        {/* Lower row: Copy, operational flags, developer credentials */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-stone-500 leading-relaxed border-t border-stone-950">
          <div>
            © 2026 ZELLCO COFFEE PREMIUM RESORT. SELURUH HAK CIPTA DILINDUNGI.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>SCA ROASTER REGISTERED: #7728</span>
            </span>
            <span className="text-stone-400">INDONESIAN SPECIALTY ACCORD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
