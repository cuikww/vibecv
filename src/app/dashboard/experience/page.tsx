// src/app/dashboard/experience/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Trash2, Pencil, ArrowLeft, Sparkles, X, Plus, Loader2, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

type Experience = { id: string; company: string; position: string; startDate: string; endDate: string | null; description: string | null; };

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);
  
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;
  
  const [formData, setFormData] = useState({ company: '', position: '', startDate: '', endDate: '', description: '', });

  const fetchExperiences = async () => {
    const res = await fetch('/api/experience', { cache: 'no-store' });
    const data = await res.json();
    if (Array.isArray(data)) setExperiences(data);
    setIsFetching(false);
  };

  useEffect(() => { fetchExperiences(); }, []);

  const generateWithAI = async () => {
    if (!formData.position || !formData.company) return alert('Isi jabatan dan perusahaan dulu agar AI punya konteks!');
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: formData.position, company: formData.company, existingDescription: formData.description, language }),
      });
      const data = await res.json();
      if (data.suggestion) setFormData({ ...formData, description: data.suggestion });
    } catch (error) {
      alert('Gagal memanggil AI.');
    } finally { setIsGenerating(false); }
  };

  const toMonthYear = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 7);
  };

  const handleEditClick = (exp: Experience) => {
    setEditId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      startDate: toMonthYear(exp.startDate),
      endDate: toMonthYear(exp.endDate),
      description: exp.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ company: '', position: '', startDate: '', endDate: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const url = editId ? `/api/experience/${editId}` : '/api/experience';
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ company: '', position: '', startDate: '', endDate: '', description: '' });
        setEditId(null);
        await fetchExperiences();
      } else {
        alert("Gagal menyimpan data");
      }
    } catch (error) { alert('Terjadi kesalahan jaringan'); } finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengalaman ini?')) return;
    try {
      const response = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setExperiences(experiences.filter(exp => exp.id !== id));
        if (editId === id) cancelEdit(); 
      } else {
        alert("Gagal menghapus data dari database.");
      }
    } catch (error) { alert("Terjadi kesalahan jaringan saat menghapus."); }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(language === 'EN' ? 'en-US' : 'id-ID', { month: 'short', year: 'numeric' });

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium animate-pulse">{t.loadingData}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto opacity-0 animate-slide-up delay-100 pb-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/dashboard/education" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-4 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {language === 'EN' ? 'Back to Education' : 'Kembali ke Pendidikan'}
          </Link>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{t.expTitle}</h1>
          <p className="text-zinc-500 font-medium text-sm">Tambahkan riwayat pekerjaan Anda. Gunakan AI untuk membuat deskripsi yang profesional.</p>
        </div>

        {/* Karena setelah ini bisa jadi ke Skills atau langsung Generate, kita arahkan ke Generate */}
        <Link href="/dashboard/generator" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
          {language === 'EN' ? 'Next: Preview CV' : 'Selanjutnya: Lihat CV'} <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* BAGIAN KIRI: FORM */}
        <div className="lg:col-span-2">
          <div className={`p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-all h-fit ${editId ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                {editId ? <Pencil size={20} className="text-indigo-600" /> : <Plus size={20} className="text-indigo-600" />} 
                {editId ? (language === 'EN' ? 'Edit Experience' : 'Edit Pengalaman') : t.addExp}
              </h2>
              {editId && (
                <button onClick={cancelEdit} className="text-xs font-bold text-zinc-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                  <X size={14} /> {language === 'EN' ? 'Cancel' : 'Batal'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">{t.companyName}</label>
                <input required type="text" name="company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" placeholder="Misal: Google Indonesia" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">{t.jobTitle}</label>
                <input required type="text" name="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" placeholder="Misal: Software Engineer" />
              </div>
              
              {/* PERBAIKAN: Memastikan label memiliki tinggi konsisten agar input di bawahnya rata sejajar */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="flex flex-col justify-end">
                  <label className="text-sm font-bold text-zinc-700 mb-1.5 h-10 flex items-end">{t.startMonth}</label>
                  <input required type="month" name="startDate" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="text-sm font-bold text-zinc-700 mb-1.5 h-10 flex items-end">{t.endMonth}</label>
                  <input type="month" name="endDate" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-zinc-700">{t.expDescPlaceholder}</label>
                  <button type="button" onClick={generateWithAI} disabled={isGenerating} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                    <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} /> 
                    {isGenerating ? t.thinkAi : t.genAi}
                  </button>
                </div>
                <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400 resize-none leading-relaxed" placeholder="Tuliskan tanggung jawab dan pencapaian Anda..." />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-zinc-900 shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                  {isLoading ? <><Loader2 size={16} className="animate-spin" /> {t.savingData}</> : (editId ? (language === 'EN' ? 'Update Experience' : 'Perbarui Pengalaman') : t.saveExp)}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BAGIAN KANAN: DAFTAR */}
        <div className="lg:col-span-3">
          {experiences.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4"><Briefcase size={28} className="text-zinc-300" /></div>
              <p className="text-sm font-bold text-zinc-700 mb-1">Belum ada pengalaman.</p>
              <p className="text-xs text-zinc-500">Mulai tambahkan riwayat kerja Anda di form sebelah kiri.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp: any) => (
                <div key={exp.id} className={`bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border flex justify-between items-start group transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${editId === exp.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-100'}`}>
                  <div className="pr-4">
                    <h3 className="font-extrabold text-zinc-900 text-lg mb-1">{exp.position}</h3>
                    <p className="text-sm font-bold text-indigo-600 mb-2">{exp.company}</p>
                    <p className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5 mb-4"><Calendar size={14} className="text-zinc-400" /> {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : t.now}</p>
                    <p className="text-zinc-600 text-sm whitespace-pre-line leading-relaxed pl-3 border-l-2 border-zinc-200">{exp.description}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => handleEditClick(exp)} className="text-zinc-400 hover:text-indigo-600 p-2 bg-zinc-50 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(exp.id)} className="text-zinc-400 hover:text-red-500 p-2 bg-zinc-50 rounded-lg hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}