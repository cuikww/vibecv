// src/app/dashboard/page.tsx
'use client';

import { ArrowRight, FileText, Upload, Printer } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

export default function Dashboard() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ID;

  return (
    <div className="flex-col w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-6">{t.dashTitle}</h1>
        
        {/* CALL TO ACTION WIZARD */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-[0_8px_30px_rgb(99,102,241,0.2)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">{t.buildCvTitle}</h2>
          <p className="text-indigo-100 mb-6 relative z-10 max-w-lg">
            {t.buildCvDesc}
          </p>
          <Link href="/dashboard/profile" className="inline-flex w-fit relative z-10 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-zinc-50 transition-all items-center gap-2 group">
            {t.startGuide} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* BENTO GRID ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">{t.quickLinks}</h3>
          <Link href="/dashboard/import" className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-200 hover:border-indigo-500 hover:bg-indigo-50 text-sm font-semibold text-zinc-700 transition-all">
            <span className="flex items-center gap-3"><Upload className="w-4 h-4 text-indigo-500" /> {t.importData}</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 relative z-10">{t.finishedFilling}</h3>
          <Link href="/dashboard/generator" className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-all relative z-10">
            <span className="flex items-center gap-3"><Printer className="w-4 h-4 text-yellow-400" /> {t.previewPdf}</span>
            <FileText className="w-4 h-4 text-zinc-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}