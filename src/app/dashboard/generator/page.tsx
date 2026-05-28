// src/app/dashboard/generator/page.tsx
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  ModernTemplate, ClassicTemplate, MinimalistTemplate,
  ExecutiveTemplate, CreativeTemplate,
} from '@/components/cv/Template'
import { Printer, ArrowLeft, Loader2, RefreshCw, Sparkles, Palette, Type, LayoutTemplate, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import type { ColorPalette } from '@/app/api/design/colors/route';
import type { FontOption } from '@/app/api/design/fonts/route';
import type { ColorShades, ThemeConfig } from '@/components/cv/theme';

// ─── Layout definitions ────────────────────────────────────────────────────────

const LAYOUT_OPTIONS = [
  {
    key: 'modern',
    label: 'Modern',
    desc: '2 Kolom · IT & Startup',
    Component: ModernTemplate,
    preview: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="80" height="100" fill="#f4f4f5" rx="3"/>
        <rect x="4" y="4" width="52" height="5" rx="1" fill="#a1a1aa"/>
        <rect x="4" y="11" width="30" height="1.5" rx="1" fill="#d4d4d8"/>
        <rect x="4" y="18" width="50" height="0.5" fill="#d4d4d8"/>
        <rect x="4" y="22" width="48" height="2.5" rx="1" fill="var(--preview-color, #6366f1)"/>
        <rect x="4" y="27" width="44" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="30" width="40" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="33" width="44" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="39" width="48" height="2.5" rx="1" fill="var(--preview-color, #6366f1)"/>
        <rect x="4" y="44" width="42" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="47" width="38" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="57" y="22" width="18" height="2.5" rx="1" fill="var(--preview-color, #6366f1)"/>
        <rect x="57" y="27" width="16" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="57" y="30" width="14" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="57" y="33" width="16" height="1.5" rx="0.5" fill="#d4d4d8"/>
      </svg>
    ),
  },
  {
    key: 'classic',
    label: 'Classic',
    desc: '1 Kolom · Formal & BUMN',
    Component: ClassicTemplate,
    preview: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="80" height="100" fill="#f4f4f5" rx="3"/>
        <rect width="80" height="22" rx="3" fill="var(--preview-color, #4f46e5)"/>
        <rect x="8" y="5" width="36" height="5" rx="1" fill="white" fillOpacity="0.9"/>
        <rect x="8" y="13" width="24" height="2" rx="1" fill="white" fillOpacity="0.5"/>
        <rect x="4" y="25" width="72" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="4" y="30" width="68" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="33" width="60" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="40" width="72" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="4" y="45" width="64" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="48" width="56" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="4" y="56" width="72" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="4" y="61" width="18" height="6" rx="3" fill="#e0e7ff"/>
        <rect x="24" y="61" width="16" height="6" rx="3" fill="#e0e7ff"/>
        <rect x="42" y="61" width="20" height="6" rx="3" fill="#e0e7ff"/>
      </svg>
    ),
  },
  {
    key: 'minimalist',
    label: 'Minimalist',
    desc: 'Sidebar · Elegan & Kreatif',
    Component: MinimalistTemplate,
    preview: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="80" height="100" fill="#f4f4f5" rx="3"/>
        <rect width="26" height="100" rx="3" fill="var(--preview-color, #4f46e5)"/>
        <circle cx="13" cy="14" r="7" fill="white" fillOpacity="0.2"/>
        <rect x="4" y="25" width="18" height="2" rx="1" fill="white" fillOpacity="0.6"/>
        <rect x="4" y="29" width="14" height="1.5" rx="0.5" fill="white" fillOpacity="0.3"/>
        <rect x="4" y="35" width="18" height="1" rx="0.5" fill="white" fillOpacity="0.3"/>
        <rect x="4" y="38" width="16" height="1.5" rx="0.5" fill="white" fillOpacity="0.2"/>
        <rect x="4" y="41" width="14" height="1.5" rx="0.5" fill="white" fillOpacity="0.2"/>
        <rect x="30" y="8" width="46" height="3" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="30" y="14" width="42" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="30" y="17" width="38" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="30" y="22" width="46" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="30" y="27" width="40" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="30" y="30" width="36" height="1.5" rx="0.5" fill="#d4d4d8"/>
      </svg>
    ),
  },
  {
    key: 'executive',
    label: 'Executive',
    desc: 'Sidebar Lebar · Senior & Manajer',
    Component: ExecutiveTemplate,
    preview: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="80" height="100" fill="#f4f4f5" rx="3"/>
        {/* dark wide sidebar */}
        <rect width="34" height="100" rx="3" fill="#1e293b"/>
        <rect x="5" y="5" width="24" height="20" rx="3" fill="var(--preview-color, #4f46e5)" fillOpacity="0.4"/>
        <rect x="5" y="28" width="24" height="2" rx="1" fill="white" fillOpacity="0.7"/>
        <rect x="5" y="32" width="18" height="1.5" rx="0.5" fill="white" fillOpacity="0.3"/>
        <rect x="5" y="38" width="24" height="1" rx="0.5" fill="white" fillOpacity="0.3"/>
        <rect x="5" y="41" width="20" height="1.5" rx="0.5" fill="white" fillOpacity="0.2"/>
        <rect x="5" y="44" width="18" height="1.5" rx="0.5" fill="white" fillOpacity="0.2"/>
        <rect x="5" y="47" width="20" height="1.5" rx="0.5" fill="white" fillOpacity="0.2"/>
        {/* skill bars */}
        <rect x="5" y="55" width="24" height="1" rx="0.5" fill="white" fillOpacity="0.3"/>
        <rect x="5" y="58" width="24" height="1.5" rx="1" fill="#374151"/>
        <rect x="5" y="58" width="18" height="1.5" rx="1" fill="var(--preview-color, #4f46e5)" fillOpacity="0.6"/>
        <rect x="5" y="62" width="24" height="1.5" rx="1" fill="#374151"/>
        <rect x="5" y="62" width="14" height="1.5" rx="1" fill="var(--preview-color, #4f46e5)" fillOpacity="0.6"/>
        {/* main */}
        <rect x="38" y="8" width="38" height="2.5" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="38" y="13" width="34" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="38" y="16" width="30" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="38" y="22" width="38" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="40" y="27" width="34" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="40" y="30" width="30" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="40" y="33" width="32" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="38" y="38" width="38" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="40" y="43" width="32" height="1.5" rx="0.5" fill="#d4d4d8"/>
      </svg>
    ),
  },
  {
    key: 'creative',
    label: 'Creative',
    desc: 'Diagonal · Desainer & Kreatif',
    Component: CreativeTemplate,
    preview: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="80" height="100" fill="#f4f4f5" rx="3"/>
        {/* diagonal header */}
        <path d="M0 0 H80 V28 L0 38 Z" fill="var(--preview-color, #4f46e5)"/>
        <rect x="5" y="5" width="36" height="5" rx="1" fill="white" fillOpacity="0.9"/>
        <rect x="5" y="12" width="22" height="2" rx="1" fill="white" fillOpacity="0.5"/>
        {/* contact strip */}
        <rect x="5" y="42" width="70" height="1.5" rx="0.5" fill="#d4d4d8"/>
        {/* 2 col body */}
        <rect x="5" y="48" width="44" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="5" y="53" width="40" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="5" y="56" width="36" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="5" y="62" width="44" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="5" y="67" width="38" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="5" y="70" width="34" height="1.5" rx="0.5" fill="#d4d4d8"/>
        {/* right col */}
        <rect x="55" y="48" width="20" height="2" rx="1" fill="var(--preview-color, #4f46e5)"/>
        <rect x="55" y="53" width="18" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="55" y="56" width="16" height="1.5" rx="0.5" fill="#d4d4d8"/>
        <rect x="55" y="59" width="18" height="1.5" rx="0.5" fill="#d4d4d8"/>
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GeneratorPage() {
  const [cvData, setCvData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;

  // Design state
  const [theme, setTheme] = useState<ThemeConfig>({ colorKey: 'indigo', fontFamily: 'Plus Jakarta Sans', layout: 'modern' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isDesigning, setIsDesigning] = useState(false);

  // API-fetched options
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [fontOptions, setFontOptions] = useState<FontOption[]>([]);
  const [loadingDesignData, setLoadingDesignData] = useState(true);

  // Resolved shades for current color
  const resolvedShades: ColorShades = colorPalettes.find(p => p.key === theme.colorKey)?.shades || {
    primary: '#4f46e5', dark: '#3730a3', light: '#e0e7ff', bg: '#4f46e5', text: '#ffffff',
  };

  // Active font URL for injection
  const activeFontUrl = fontOptions.find(f => f.family === theme.fontFamily)?.cssUrl;

  // ── Inject Google Font link tag ─────────────────────────────────────────────
  useEffect(() => {
    if (!activeFontUrl) return;
    const id = 'cv-font-link';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = activeFontUrl;
  }, [activeFontUrl]);

  // ── Auto-scale preview ──────────────────────────────────────────────────────
  const updateScale = useCallback(() => {
    if (!previewWrapperRef.current) return;
    const A4_W = 794;
    const available = previewWrapperRef.current.clientWidth - 64;
    setScale(Math.min(1, available / A4_W));
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (previewWrapperRef.current) ro.observe(previewWrapperRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  // ── Fetch design data (colors + fonts) ──────────────────────────────────────
  useEffect(() => {
    setLoadingDesignData(true);
    Promise.all([
      fetch('/api/design/colors').then(r => r.json()).catch(() => []),
      fetch('/api/design/fonts').then(r => r.json()).catch(() => []),
    ]).then(([colors, fonts]) => {
      setColorPalettes(colors);
      setFontOptions(fonts);
    }).finally(() => setLoadingDesignData(false));
  }, []);

  // ── Fetch CV data ────────────────────────────────────────────────────────────
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prof, edu, exp, skill] = await Promise.all([
        fetch('/api/profile', { cache: 'no-store' }).then(r => r.json()).catch(() => ({})),
        fetch('/api/education', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/experience', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
        fetch('/api/skills', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      ]);
      setCvData({
        profile: prof.error ? {} : prof,
        educations: Array.isArray(edu) ? edu : [],
        experiences: Array.isArray(exp) ? exp : [],
        skills: Array.isArray(skill) ? skill : [],
        email: prof?.email || prof?.user?.email || 'email@domain.com',
      });
    } catch (err) {
      console.error('Gagal memuat data CV', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  // ── Print ────────────────────────────────────────────────────────────────────
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'VibeCV_Export',
    pageStyle: `
      @media print {
        @page { size: A4; margin: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  // ── AI Design ────────────────────────────────────────────────────────────────
  const handleAiDesign = async () => {
    if (!aiPrompt) return;
    setIsDesigning(true);
    try {
      const res = await fetch('/api/ai/design-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const result = await res.json();
      setTheme(prev => ({
        colorKey:   result.colorKey   || prev.colorKey,
        fontFamily: result.fontFamily || prev.fontFamily,
        layout:     result.layout     || prev.layout,
      }));
      setAiPrompt('');
    } catch {
      alert('AI Designer sedang sibuk, coba lagi nanti.');
    } finally {
      setIsDesigning(false);
    }
  };

  const activeLayout = LAYOUT_OPTIONS.find(l => l.key === theme.layout) || LAYOUT_OPTIONS[0];
  const TemplateComponent = activeLayout.Component;

  // Font categories for grouping
  const fontCategories = [
    { key: 'sans-serif', label: 'Sans-Serif' },
    { key: 'serif',      label: 'Serif' },
    { key: 'monospace',  label: 'Monospace' },
    { key: 'display',    label: 'Display' },
  ] as const;

  return (
    <div className="opacity-0 animate-slide-up delay-100 pb-12 w-full">

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-4 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.backToDash}
          </Link>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            {t.genTitle}
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">AI Powered</span>
          </h1>
        </div>
        <div className="flex gap-3 w-full xl:w-auto">
          <button onClick={loadAllData} className="flex-1 xl:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-all text-sm font-bold shadow-sm">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> {t.refreshData}
          </button>
          <button disabled={isLoading} onClick={() => handlePrint()} className="flex-1 xl:flex-none flex justify-center items-center gap-2 bg-zinc-900 text-white px-8 py-2.5 rounded-xl hover:bg-zinc-800 transition-all font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-50">
            <Printer size={18} /> {t.printPdf}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 xl:items-start">

        {/* ── LEFT PANEL ── */}
        <div className="w-full xl:w-[300px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex-shrink-0 overflow-hidden xl:max-h-[calc(100vh-9rem)] xl:overflow-y-auto">
          <div className="p-6 space-y-7">

            {/* AI Stylist */}
            <div>
              <h2 className="text-zinc-900 font-black flex items-center gap-2 mb-1"><Sparkles className="text-indigo-500" size={18}/> AI Stylist</h2>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-3">
                Contoh: <em>"CV hacker minimalis"</em> atau <em>"Desainer grafis elegan"</em>
              </p>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAiDesign(); }}
                placeholder="Ketik instruksi desain di sini..."
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-zinc-400"
              />
              <button
                onClick={handleAiDesign}
                disabled={isDesigning || !aiPrompt}
                className="mt-2 w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDesigning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isDesigning ? 'Meracik Desain...' : 'Generate Desain'}
              </button>
            </div>

            <Divider label="ATAU MANUAL" />

            {/* ── Template layout ── */}
            <div>
              <label className="text-zinc-700 text-sm font-black flex items-center gap-2 mb-3">
                <LayoutTemplate size={14} className="text-zinc-400"/> Template Layout
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {LAYOUT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setTheme(prev => ({ ...prev, layout: opt.key }))}
                    className={`flex flex-col rounded-xl border-2 overflow-hidden transition-all ${
                      theme.layout === opt.key
                        ? 'border-indigo-500 shadow-md shadow-indigo-100'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                    style={{ '--preview-color': resolvedShades.primary } as any}
                    title={opt.label}
                  >
                    <div className="aspect-[4/5] p-1 bg-white">{opt.preview}</div>
                    <div className={`py-1 text-center text-[8px] font-black uppercase tracking-wide transition-colors ${theme.layout === opt.key ? 'bg-indigo-500 text-white' : 'bg-zinc-50 text-zinc-500'}`}>
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-400 font-medium">{activeLayout.desc}</p>
            </div>

            {/* ── Color palette ── */}
            <div>
              <label className="text-zinc-700 text-sm font-black flex items-center gap-2 mb-3">
                <Palette size={14} className="text-zinc-400"/> Warna Aksen
                {loadingDesignData && <Loader2 size={12} className="animate-spin text-zinc-300 ml-auto" />}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorPalettes.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setTheme(prev => ({ ...prev, colorKey: p.key }))}
                    title={p.label}
                    className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                      theme.colorKey === p.key ? 'border-zinc-900 bg-zinc-50' : 'border-transparent hover:border-zinc-200'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full shadow-sm transition-transform ${theme.colorKey === p.key ? 'scale-110' : 'group-hover:scale-105'}`}
                      style={{ backgroundColor: p.hex }}
                    />
                    <span className="text-[8px] font-bold text-zinc-500 uppercase leading-tight text-center">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Typography ── */}
            <div>
              <label className="text-zinc-700 text-sm font-black flex items-center gap-2 mb-3">
                <Type size={14} className="text-zinc-400"/> Tipografi
                {loadingDesignData && <Loader2 size={12} className="animate-spin text-zinc-300 ml-auto" />}
              </label>
              <div className="space-y-3">
                {fontCategories.map(cat => {
                  const fonts = fontOptions.filter(f => f.category === cat.key);
                  if (!fonts.length) return null;
                  return (
                    <div key={cat.key}>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">{cat.label}</p>
                      <div className="space-y-1">
                        {fonts.map(f => (
                          <button
                            key={f.family}
                            onClick={() => setTheme(prev => ({ ...prev, fontFamily: f.family }))}
                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg border transition-all text-left ${
                              theme.fontFamily === f.family
                                ? 'border-indigo-400 bg-indigo-50'
                                : 'border-zinc-200 hover:border-zinc-300 bg-white'
                            }`}
                          >
                            <span
                              className={`text-[13px] font-bold leading-none ${theme.fontFamily === f.family ? 'text-indigo-700' : 'text-zinc-800'}`}
                              style={{ fontFamily: `'${f.family}', system-ui` }}
                            >
                              {f.label}
                            </span>
                            <span className="text-[9px] text-zinc-400 ml-2 text-right leading-tight max-w-[70px]">{f.previewText}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT: Canvas ── */}
        <div
          ref={previewWrapperRef}
          className="flex-1 bg-zinc-200/60 p-4 md:p-8 rounded-3xl border border-zinc-200/80 flex justify-center items-start shadow-inner overflow-hidden min-h-[70vh]"

        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full text-zinc-400 gap-3 mt-20">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
              <p className="text-xs font-bold tracking-widest uppercase animate-pulse">{t.tidyingUp}</p>
            </div>
          ) : (
            <div style={{ width: `${794 * scale}px`, height: `${1123 * scale}px`, flexShrink: 0 }}>
              <div
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '794px', height: '1123px' }}
                className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] rounded-sm"
              >
                <TemplateComponent
                  ref={componentRef}
                  data={cvData}
                  shades={resolvedShades}
                  fontFamily={theme.fontFamily}
                  t={t}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px bg-zinc-200 flex-1" />
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
      <div className="h-px bg-zinc-200 flex-1" />
    </div>
  );
}