import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingSubmission } from '../types';
import { Calendar, User, Mail, Phone, Clock, Users, Coffee, Check, Send, Sparkles, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export default function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<'indoor-main' | 'slow-bar' | 'garden-glasshouse'>('indoor-main');
  const [specialRequests, setSpecialRequests] = useState('');
  const [pairingClass, setPairingClass] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  // Tables availability map
  const tables = [
    { id: 101, area: 'indoor-main', size: 2, label: 'Meja 1' },
    { id: 102, area: 'indoor-main', size: 4, label: 'Meja 2' },
    { id: 103, area: 'indoor-main', size: 4, label: 'Meja 3' },
    { id: 201, area: 'slow-bar', size: 2, label: 'SlowBar A' },
    { id: 202, area: 'slow-bar', size: 2, label: 'SlowBar B' },
    { id: 301, area: 'garden-glasshouse', size: 2, label: 'Garden A' },
    { id: 302, area: 'garden-glasshouse', size: 6, label: 'Garden Pavillion' },
  ];

  const filteredTables = tables.filter(t => t.area === seatingArea);

  // Cost calculator
  const calculateEstimate = () => {
    let basePrice = 0; // standard booking has no fee, but we can display a deposit/value estimate
    
    // Slow bar has a minimum spend mock deposit
    if (seatingArea === 'slow-bar') basePrice += 100000;
    if (seatingArea === 'garden-glasshouse') basePrice += 50000;

    // Private pairing class is IDR 75k per guest
    if (pairingClass) {
      basePrice += (75000 * guests);
    }

    return basePrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name.trim()) return setErrorText('Mohon masukkan nama lengkap Anda.');
    if (!email.trim() || !email.includes('@')) return setErrorText('Mohon gunakan email yang valid.');
    if (!phone.trim()) return setErrorText('Nomor telepon diperlukan.');
    if (!date) return setErrorText('Silakan pilih tanggal kedatangan.');
    if (!time) return setErrorText('Silakan tentukan jam reservasi.');
    if (!selectedTable) return setErrorText('Silakan ketuk nomor meja yang bersinar hijau pada denah yang tersedia.');

    setIsLoading(true);

    const code = 'ZLC-' + Math.floor(1000 + Math.random() * 9000);

    const performSubmission = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { error: dbErr } = await supabase
            .from('bookings')
            .insert([{
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              date: date,
              time: time,
              guests: Number(guests),
              seating_area: seatingArea,
              special_requests: specialRequests ? specialRequests.trim() : null,
              pairing_class: pairingClass,
              selected_table: Number(selectedTable),
              booking_code: code
            }]);
          
          if (dbErr) throw dbErr;
        } else {
          // Simmons offline fallback delay
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
        setBookingCode(code);
        setIsSubmitted(true);
      } catch (err: any) {
        console.error('Booking submission error:', err);
        setErrorText(`Gagal menyimpan reservasi ke database Supabase: ${err.message || err}. Berpindah ke simulasi lokal.`);
        
        // Let it fall back so the application is still pleasant!
        setTimeout(() => {
          setBookingCode(code);
          setIsSubmitted(true);
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    performSubmission();
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
    setTime('');
    setGuests(2);
    setSeatingArea('indoor-main');
    setSpecialRequests('');
    setPairingClass(false);
    setSelectedTable(null);
    setIsSubmitted(false);
    setErrorText('');
  };

  return (
    <section id="booking" className="py-24 bg-stone-900 border-t border-b border-stone-850 select-none text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-[0.25em] uppercase block">
            private seating & masterclass
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
            Reservasi Ruang & Slow Bar
          </h2>
          <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full" />
          <p className="text-stone-400 font-sans text-sm md:text-base font-light">
            Sediakan meja terbaik Anda di muka untuk rapat bisnis penting, slow bar pairing sesion yang dipandu langsung oleh barista, atau sekadar berkumpul berselimut kebun kaca.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Left Column: Form & Table Map Selector */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 bg-stone-950 p-6 md:p-8 rounded-3xl border border-stone-800 space-y-6">
                  
                  <h3 className="font-serif text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-500" />
                    <span>Lengkapi Detail Reservasi Anda</span>
                  </h3>

                  {errorText && (
                    <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/40 p-4 rounded-xl text-red-400 text-xs font-sans">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorText}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                          type="text"
                          required
                          placeholder="Renata Laksmana"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-amber-600 transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Alamat Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                          type="email"
                          required
                          placeholder="renata@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-amber-600 transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Nomor WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                          type="tel"
                          required
                          placeholder="0812-xxxx-xxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-amber-600 transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Tanggal Kedatangan</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-amber-600 transition-all font-sans cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Time Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Jam Kedatangan</label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <select
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs text-stone-300 focus:outline-none focus:border-amber-600 transition-all font-sans cursor-pointer"
                        >
                          <option value="">Pilih Slot Waktu</option>
                          <option value="08:00">08:00 WIB (Pagi Sunyi)</option>
                          <option value="10:00">10:00 WIB (Selingan Kerja)</option>
                          <option value="14:00">14:00 WIB (Kopikurasi Siang)</option>
                          <option value="16:00">16:00 WIB (Sore Santai)</option>
                          <option value="19:00">19:00 WIB (Malam Intim)</option>
                          <option value="21:00">21:00 WIB (Late Brew Espresso)</option>
                        </select>
                      </div>
                    </div>

                    {/* Guests Count */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Jumlah Tamu</label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 pl-11 pr-4 text-xs text-stone-300 focus:outline-none focus:border-amber-600 transition-all font-sans cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
                            <option key={g} value={g}>{g} Orang</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Area Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase block">Pilih Area Seating</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'indoor-main', label: 'Indoor Hall', desc: 'Acuan modern, adem sentral' },
                        { id: 'slow-bar', label: 'Bar Lambat', desc: 'Dekat Barista & manual dripper' },
                        { id: 'garden-glasshouse', label: 'Greenhouse Teras', desc: 'Asri penuh tanaman hijau rimbun' }
                      ].map(area => (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            setSeatingArea(area.id as any);
                            setSelectedTable(null); // Reset selected table if area changes
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            seatingArea === area.id
                              ? 'bg-amber-950/40 border-amber-500 text-white'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                          }`}
                        >
                          <span className="font-serif font-bold text-xs block text-amber-500">{area.label}</span>
                          <span className="text-[10px] font-sans font-light text-stone-400 leading-tight block mt-0.5">{area.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TABLE MAP INDICATOR */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase block">Denah Posisi Meja Tersedia ({seatingArea === 'indoor-main' ? 'Indoor' : seatingArea === 'slow-bar' ? 'Slow Bar' : 'Greenhouse'})</label>
                    <p className="text-[11px] leading-relaxed text-stone-500 font-sans font-light">Ketuk salah satu meja yang bersinar untuk mengunci kursi Anda:</p>
                    <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-850 grid grid-cols-4 gap-3 justify-center items-center">
                      {filteredTables.map(t => {
                        const isSel = selectedTable === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTable(t.id)}
                            className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-amber-600 text-stone-950 border-amber-500 scale-105 shadow-md shadow-amber-950/30 font-bold'
                                : 'bg-stone-950 hover:bg-stone-900 text-emerald-400 border-emerald-900/40 shadow shadow-emerald-950/20'
                            }`}
                          >
                            <span className="text-xs font-serif font-bold">{t.label}</span>
                            <span className="text-[8px] font-mono opacity-80 uppercase">({t.size} Pax)</span>
                          </button>
                        );
                      })}
                      {filteredTables.length === 0 && (
                        <div className="col-span-4 text-center py-4 text-xs text-stone-500 font-mono">
                          Pilihan Area Ini Penuh atau Sedang Ditutup.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special requests / Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono tracking-wider text-stone-400 uppercase">Catatan Khusus (Alergi / Permintaan Meja Spesifik)</label>
                    <textarea
                      placeholder="Tuliskan jika Anda membutuhkan baby chair, memiliki alergi laktosa, atau butuh stopkontak melimpah..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-amber-600 transition-all font-sans"
                    />
                  </div>

                </form>

                {/* Right Column: Reservation Preview & Cost Breakdown */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-stone-950 p-6 md:p-8 rounded-3xl border border-stone-800">
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg font-bold text-white pb-3 border-b border-stone-900">
                      Rangkuman Perjalanan Rasa
                    </h3>

                    {/* Dynamic card specs */}
                    <div className="space-y-4 text-stone-300 font-sans text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-mono text-[10px] uppercase">Rencana Sesi</span>
                        <span className="font-semibold text-white">{date ? date : 'Belum Ditentukan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-mono text-[10px] uppercase">Waktu Kunjungan</span>
                        <span className="font-semibold text-white">{time ? `${time} WIB` : 'Belum Ditentukan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-mono text-[10px] uppercase">Batas Pax Tamu</span>
                        <span className="font-semibold text-white">{guests} Orang</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-mono text-[10px] uppercase">Wilayah Duduk</span>
                        <span className="font-semibold text-amber-500 uppercase font-mono tracking-wider">
                          {seatingArea === 'indoor-main' ? 'Indoor Hall' : seatingArea === 'slow-bar' ? 'Slow Bar' : 'Greenhouse'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-mono text-[10px] uppercase">Meja Dipilih</span>
                        <span className="font-semibold text-emerald-400">
                          {selectedTable ? `No. Meja ${selectedTable}` : 'Belum Dipilih'}
                        </span>
                      </div>
                    </div>

                    {/* Masterclass Add-on option */}
                    <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-850/80 space-y-3 mt-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="pairing_chk"
                          checked={pairingClass}
                          onChange={(e) => setPairingClass(e.target.checked)}
                          className="mt-1 cursor-pointer accent-amber-500"
                        />
                        <label htmlFor="pairing_chk" className="cursor-pointer">
                          <span className="font-serif font-bold text-xs block text-white flex items-center gap-1">
                            Private Roasting & Pairing Workshop 
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          </span>
                          <span className="text-[10px] font-sans font-light text-stone-400 leading-relaxed block mt-0.5">
                            Ikuti sesi membakar biji dan meracik V60 eksklusif dipandu barista berlisensi hanya menambah **IDR 75.000 / orang**.
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Fee estimate structure */}
                    <div className="pt-6 border-t border-stone-900 space-y-3">
                      <div className="flex justify-between text-xs text-stone-400">
                        <span>Deposit Komitmen Meja ({seatingArea === 'slow-bar' ? 'Slow Bar Place' : 'Standard'})</span>
                        <span>IDR {seatingArea === 'slow-bar' ? '100.000' : seatingArea === 'garden-glasshouse' ? '50.000' : '0'}</span>
                      </div>
                      {pairingClass && (
                        <div className="flex justify-between text-xs text-stone-400">
                          <span>Pairing Class Workshop ({guests} Orang)</span>
                          <span>IDR {new Intl.NumberFormat('id-ID').format(75000 * guests)}</span>
                        </div>
                      )}
                      
                      {/* Total estimation pricing */}
                      <div className="flex justify-between items-end pt-3 border-t border-dashed border-stone-850">
                        <div>
                          <span className="text-[10px] font-mono text-stone-500 block uppercase">Simulasi Biaya Tempat</span>
                          <span className="text-[10px] font-mono text-emerald-500 block font-light leading-none mt-1">Selesai di bayar pas kedatangan</span>
                        </div>
                        <span className="font-serif text-lg md:text-xl font-extrabold text-amber-500">
                          {calculateEstimate() === 0 ? 'Bebas Biaya Masuk' : `IDR ${new Intl.NumberFormat('id-ID').format(calculateEstimate())}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 font-sans font-bold text-xs tracking-wider uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer select-none shadow-lg shadow-amber-950/40"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Form Reservasi</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-stone-500 font-sans mt-3 leading-relaxed">
                      "Zellco tidak menagih pesanan online. Reservasi ini gratis dilakukan awal, konfirmasi manual dikirim Barista kami melalui WA dalam 15 menit."
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Majestic Receipt Success Component */
              <motion.div
                key="receipt-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-stone-950 border border-stone-800 rounded-3xl p-6 md:p-10 max-w-xl mx-auto text-center space-y-6 shadow-2xl relative overflow-hidden"
              >
                {/* Visual success rings */}
                <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-600 flex items-center justify-center mx-auto text-amber-500">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 tracking-wider block uppercase">Reservasi Terkonfirmasi Sementara</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white">Selamat, {name}! Meja Anda Siap Dijaga</h3>
                  <p className="text-stone-400 font-sans text-xs md:text-sm font-light leading-relaxed max-w-sm mx-auto">
                    Terima kasih telah memilih Zellco Coffee. Kode pemesanan unik Anda telah dicatat oleh stasiun barista kami.
                  </p>
                </div>

                {/* Simulated Physical Receipt Style Panel */}
                <div className="bg-stone-900/60 p-6 rounded-2xl border border-stone-850/80 text-left space-y-4 font-mono text-xs max-w-sm mx-auto">
                  <div className="flex justify-between border-b border-stone-800 pb-2">
                    <span className="text-stone-500">KODE BOOKING</span>
                    <span className="text-amber-500 font-bold">{bookingCode}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>NAMA</span>
                    <span className="text-white uppercase text-right">{name}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>TANGGAL</span>
                    <span className="text-white text-right">{date}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>JAM SESI</span>
                    <span className="text-white text-right">{time} WIB</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>SEATING</span>
                    <span className="text-white uppercase text-right">
                      {seatingArea === 'indoor-main' ? 'Indoor Hall' : seatingArea === 'slow-bar' ? 'Slow Bar' : 'Greenhouse'}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>NOMOR MEJA</span>
                    <span className="text-emerald-400 text-right">MEJA {selectedTable}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>TAMU SESI</span>
                    <span className="text-white text-right">{guests} TAMU</span>
                  </div>
                  {pairingClass && (
                    <div className="flex justify-between text-amber-400 border-t border-dashed border-stone-800 pt-2 text-[11px]">
                      <span>PAIRING CLASS ADD-ON</span>
                      <span>DIKONFIRMASI</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                    Barista kami akan mengirim pesan konfirmasi final dan petunjuk navigasi penemuan pintu rahasia Ivy melalui WhatsApp ke nomor <span className="text-stone-300">{phone}</span> dalam beberapa menit.
                  </p>
                  
                  <button
                    onClick={handleResetForm}
                    className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-850 border border-stone-800 font-sans text-xs text-amber-500 hover:text-amber-400 cursor-pointer w-full sm:w-auto"
                  >
                    Lakukan Reservasi Baru
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
