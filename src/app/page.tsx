// src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; // 1. Import komponen Image Next.js
import { ArrowRight } from 'lucide-react'; // Bersihkan 'Layers' karena sudah tidak dipakai
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ID;

  return (
    <div className="relative min-h-screen flex flex-col pt-6 px-4 md:px-8">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Floating Navbar */}
      <nav className="max-w-5xl mx-auto w-full bg-white/70 backdrop-blur-md border border-zinc-200/60 rounded-full px-6 py-3 flex justify-between items-center shadow-sm z-50 animate-fade-in">
        <div className="font-extrabold text-xl tracking-tight text-zinc-900 flex items-center gap-2">
            <Image 
              src="/logo.png" // FIX: Menggunakan absolute path ke folder public
              alt="VibeCV Logo" 
              width={28} 
              height={28} 
              className="object-contain"
              priority 
            /> 
            VibeCV
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link href="/login" className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-zinc-800 transition-all hover:-translate-y-0.5">
            {t.loginBtn}
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center mt-20 md:mt-32 max-w-4xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-8 animate-slide-up">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-bold text-zinc-600 tracking-wide uppercase">{t.tagline}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] text-zinc-900 mb-6 animate-slide-up delay-100">
          {t.heroTitle1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-400">{t.heroTitle2}</span>
        </h1>
        
        <p className="text-lg text-zinc-500 mb-10 max-w-2xl leading-relaxed font-medium animate-slide-up delay-200">
          {t.heroDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-slide-up delay-300">
          <Link href="/login" className="group bg-zinc-900 text-white px-8 py-4 rounded-full font-bold text-base shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            {t.startBtn} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}