// src/app/dashboard/skills/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Zap, X, Plus, ArrowLeft, Loader2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

type Skill = { id: string; name: string; level: string };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  
  const [formData, setFormData] = useState({ name: '', level: 'Intermediate' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setIsFetching(false);
      });
  }, []);

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsLoading(true);
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const data = await res.json();
    setSkills([...skills, data]);
    setFormData({ name: '', level: 'Intermediate' }); // Reset form
    setIsLoading(false);
  };

  const deleteSkill = async (id: string) => {
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    setSkills(skills.filter(s => s.id !== id));
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">{t.loadingData}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto opacity-0 animate-slide-up delay-100 pb-12 w-full">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.backToDash}
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{t.skillTitle}</h1>
        <p className="text-zinc-500 font-medium text-sm">{t.skillDesc}</p>
      </div>
        
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        
        <form onSubmit={addSkill} className="flex flex-col lg:flex-row gap-3 mb-10 pb-8 border-b border-zinc-100 items-stretch">
          
          {/* Kolom Teks Skill */}
          <div className="flex-1 min-w-0">
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder={t.skillPlaceholder || 'Masukkan nama keahlian...'}
              className="w-full h-full min-h-[52px] bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400"
            />
          </div>
          
          {/* Kolom Pilihan Level (DIBERSIHKAN DARI IKON KIRI) */}
          <div className="relative w-full lg:w-56 flex-shrink-0">
            <select 
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              className="w-full h-full min-h-[52px] bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl pl-5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-bold appearance-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            {/* Custom Arrow Icon di Kanan */}
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          {/* Tombol Tambah */}
          <button 
            disabled={isLoading} 
            className="min-h-[52px] bg-zinc-900 text-white px-8 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0 whitespace-nowrap"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Tambah
          </button>
        </form>

        {skills.length === 0 ? (
          <div className="text-center p-10 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <Zap size={28} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-sm font-bold text-zinc-600">Belum ada keahlian</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skills.map(skill => (
              <div key={skill.id} className="group relative bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all flex flex-col justify-center">
                <div className="pr-8">
                  <h3 className="font-extrabold text-zinc-900 text-sm mb-1.5 truncate" title={skill.name}>{skill.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-200">
                    {skill.level || 'Intermediate'}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => deleteSkill(skill.id)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                  title="Hapus"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}