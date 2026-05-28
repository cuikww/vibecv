// src/app/dashboard/ats/page.tsx
'use client';

import { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Copy, Check, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

export default function AtsPage() {
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;

  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; missingKeywords: string[]; coverLetter: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return alert("Masukkan Job Description terlebih dahulu.");
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/ats-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, language }),
      });
      
      const data = await res.json();
      if (res.ok) setResult(data);
      else alert("Gagal melakukan analisis ATS.");
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (result?.coverLetter) {
      navigator.clipboard.writeText(result.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto opacity-0 animate-slide-up delay-100 pb-12">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.backToDash}
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2 flex items-center gap-3">
          <Target className="text-indigo-600" size={32} /> {t.atsTitle}
        </h1>
        <p className="text-zinc-500 font-medium text-sm">{t.atsDesc}</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 mb-8">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={t.jobDescPlaceholder}
          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-5 py-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400 resize-none leading-relaxed mb-6"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription}
            className="w-full md:w-auto flex justify-center items-center gap-2 bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
            {isAnalyzing ? t.analyzing : t.analyzeBtn}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 text-center flex flex-col items-center justify-center">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">{t.matchScore}</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-100" />
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={402} 
                    strokeDashoffset={402 - (402 * result.score) / 100}
                    className={result.score > 75 ? "text-emerald-500" : result.score > 50 ? "text-amber-500" : "text-rose-500"} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-zinc-900 tracking-tighter">{result.score}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" /> {t.missingKeywords}
              </h3>
              {result.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="bg-amber-50 text-amber-700 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-100/50">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} /> CV Anda sudah sangat relevan!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
              <h3 className="font-bold text-zinc-900">{t.coverLetter}</h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? t.copiedBtn : t.copyBtn}
              </button>
            </div>
            <div className="text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap bg-zinc-50 p-6 rounded-xl border border-zinc-200/60 min-h-[300px]">
              {result.coverLetter}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}