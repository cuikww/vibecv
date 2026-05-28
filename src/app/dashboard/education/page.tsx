// src/app/dashboard/education/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Calendar, Trash2, Pencil, Plus, ArrowLeft, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

type Education = { id: string; institution: string; degree: string; major: string; startDate: string; endDate: string | null; description: string | null; };

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [editId, setEditId] = useState<string | null>(null);
  
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;

  const [formData, setFormData] = useState({ institution: '', degree: 'S1', major: '', startDate: '', endDate: '', description: '', });

  const fetchEducations = () => {
    fetch('/api/education').then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) setEducations(data);
      setIsFetching(false);
    });
  };

  useEffect(() => { fetchEducations(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toMonthYear = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 7);
  };

  const handleEditClick = (edu: Education) => {
    setEditId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      major: edu.major,
      startDate: toMonthYear(edu.startDate),
      endDate: toMonthYear(edu.endDate),
      description: edu.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ institution: '', degree: 'S1', major: '', startDate: '', endDate: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const url = editId ? `/api/education/${editId}` : '/api/education';
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ institution: '', degree: 'S1', major: '', startDate: '', endDate: '', description: '' });
        setEditId(null);
        fetchEducations();
      } else {
        alert("Gagal menyimpan data");
      }
    } catch (error) { alert('Terjadi kesalahan jaringan'); } finally { setIsLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus riwayat pendidikan ini?')) return;
    try {
      const response = await fetch(`/api/education/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEducations(educations.filter((edu) => edu.id !== id));
        if (editId === id) cancelEdit();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) { alert('Terjadi kesalahan jaringan'); }
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
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.backToDash}
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{t.eduTitle}</h1>
        <p className="text-zinc-500 font-medium text-sm">Tambahkan riwayat akademik Anda untuk memperkuat kualifikasi profesional.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* BAGIAN KIRI: FORM */}
        <div className="lg:col-span-2">
          <div className={`p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border transition-all h-fit ${editId ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                {editId ? <Pencil size={20} className="text-indigo-600" /> : <Plus size={20} className="text-indigo-600" />} 
                {editId ? (language === 'EN' ? 'Edit Education' : 'Edit Pendidikan') : t.addEdu}
              </h2>
              {editId && (
                <button onClick={cancelEdit} className="text-xs font-bold text-zinc-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                  <X size={14} /> {language === 'EN' ? 'Cancel' : 'Batal'}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-zinc-700">{t.instName}</label>
                <input required type="text" name="institution" value={formData.institution} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" placeholder="Misal: Universitas Mataram" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700">{t.degree}</label>
                  <select name="degree" value={formData.degree} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
                    <option value="SMA/SMK">SMA/SMK</option><option value="D3">D3</option><option value="S1">S1</option><option value="S2">S2</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-zinc-700">{t.major}</label>
                  <input required type="text" name="major" value={formData.major} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" placeholder="Teknik Informatika" />
                </div>
              </div>

              {/* PERBAIKAN: Flex column & justify-end memastikan kotak input sejajar di bawah */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="flex flex-col justify-end">
                  <label className="text-sm font-bold text-zinc-700 mb-1.5 h-10 flex items-end">{t.startMonth}</label>
                  <input required type="month" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="text-sm font-bold text-zinc-700 mb-1.5 h-10 flex items-end">{t.endMonth}</label>
                  <input type="month" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-zinc-900 shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                  {isLoading ? <><Loader2 size={16} className="animate-spin" /> {t.savingData}</> : (editId ? (language === 'EN' ? 'Update Education' : 'Perbarui Pendidikan') : t.saveBtn)}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BAGIAN KANAN: DAFTAR */}
        <div className="lg:col-span-3">
          {educations.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4"><GraduationCap size={28} className="text-zinc-300" /></div>
              <p className="text-sm font-bold text-zinc-700 mb-1">{t.noEdu}</p>
              <p className="text-xs text-zinc-500">Mulai tambahkan riwayat pendidikan Anda di form sebelah kiri.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className={`bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border flex justify-between items-start group transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${editId === edu.id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-100'}`}>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-lg mb-1">{edu.institution}</h3>
                    <p className="text-sm font-bold text-indigo-600 mb-2">{edu.degree} - {edu.major}</p>
                    <p className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5"><Calendar size={14} className="text-zinc-400" /> {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : t.now}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(edu)} className="text-zinc-400 hover:text-indigo-600 p-2 bg-zinc-50 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(edu.id)} className="text-zinc-400 hover:text-red-500 p-2 bg-zinc-50 rounded-lg hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={16} /></button>
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