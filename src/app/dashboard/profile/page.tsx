// src/app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Globe, ArrowLeft, Sparkles, Loader2, ArrowRight, Camera, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import { createClient } from '@/utils/supabase/client'; // <-- Klien supabase untuk frontend

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [summary, setSummary] = useState('');
  
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',       // <-- Baru
    phone: '',
    photoUrl: '',    // <-- Baru
    linkedin: '',
    portfolio: '',
    slug: '',
    isPublic: false
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setFormData({
            fullName: data.fullName || '',
            email: data.email || '',       // <-- Tangkap data
            phone: data.phone || '',
            photoUrl: data.photoUrl || '', // <-- Tangkap data
            linkedin: data.linkedin || '',
            portfolio: data.portfolio || '',
            slug: data.slug || '',
            isPublic: data.isPublic || false
          });
          setSummary(data.summary || '');
        }
        setIsFetching(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FUNGSI UNGGAH FOTO ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`; // simpan di dalam folder avatars

    setIsUploadingPhoto(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Ambil Public URL gambar yang baru diupload
      const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
      
      setFormData({ ...formData, photoUrl: data.publicUrl });
      
    } catch (error: any) {
      alert(`Gagal mengunggah foto: ${error.message}`);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // --- FUNGSI GENERATE AI ---
  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: formData.fullName, language: language })
      });
      const data = await res.json();
      if(data.result) setSummary(data.result);
    } catch (error) {
      alert("Gagal generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, summary }),
      });

      if (response.ok) alert(language === 'EN' ? 'Profile saved successfully!' : 'Profil berhasil disimpan!');
      else alert('Gagal menyimpan profil atau URL Slug sudah dipakai orang lain.');
    } catch (error) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
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
    <div className="max-w-3xl mx-auto opacity-0 animate-slide-up delay-100 pb-12">
      
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.backToDash}
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{t.basicInfo}</h1>
        <p className="text-zinc-500 font-medium text-sm">{t.profileDesc}</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* FOTO PROFIL SECTION */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-100">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] bg-zinc-100 overflow-hidden flex items-center justify-center relative group">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-zinc-300" />
                )}
                
                {/* Hover Overlay */}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold">{t.uploadPhoto}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
                </label>
              </div>
              
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-white/80 rounded-full flex flex-col items-center justify-center backdrop-blur-sm z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-zinc-900">{t.photo}</h3>
              <p className="text-xs font-medium text-zinc-500 mt-1 mb-3">Format JPG/PNG. Rasio 1:1 direkomendasikan.</p>
              <label className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm inline-block">
                {isUploadingPhoto ? t.uploadingPhoto : t.uploadPhoto}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
              </label>
            </div>
          </div>

          {/* Baris 1: Nama */}
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-bold text-zinc-700">{t.fullName}</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" 
              placeholder={t.namePlaceholder} 
            />
          </div>

          {/* Baris 2: Email & Telepon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700">{t.contactEmail}</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email} 
                onChange={handleChange} 
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" 
                placeholder="nama@email.com" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700">{t.phone}</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" 
                placeholder="+62 812 3456 7890" 
              />
            </div>
          </div>

          {/* Baris 3: Summary dengan AI */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-zinc-700">{t.profSummary}</label>
              <button 
                type="button" 
                onClick={generateSummary} 
                disabled={isGeneratingSummary} 
                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? "animate-spin" : ""}`} /> 
                {isGeneratingSummary ? t.generating : t.genAi}
              </button>
            </div>
            <textarea 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)} 
              rows={4}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400 resize-none leading-relaxed" 
              placeholder={t.summaryPlaceholder} 
            />
          </div>

          {/* Baris 4: LinkedIn & Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700">{t.linkedin}</label>
              <input 
                type="url" 
                name="linkedin" 
                value={formData.linkedin} 
                onChange={handleChange} 
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" 
                placeholder="https://linkedin.com/in/username" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700">{t.portfolio}</label>
              <input 
                type="url" 
                name="portfolio" 
                value={formData.portfolio} 
                onChange={handleChange} 
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400" 
                placeholder="https://myportfolio.com" 
              />
            </div>
          </div>

          {/* PENGATURAN PORTOFOLIO PUBLIK */}
          <div className="border-t border-zinc-100 pt-8 mt-8">
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Globe size={18} className="text-indigo-600" /> {t.publicPortfolio}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                <div>
                  <p className="text-sm font-bold text-indigo-900 mb-0.5">{t.enablePublicLink}</p>
                  <p className="text-xs font-medium text-indigo-600/70">{t.publicLinkDesc}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                  className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${formData.isPublic ? 'bg-indigo-600' : 'bg-zinc-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.isPublic ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {formData.isPublic && (
                <div className="animate-fade-in p-1">
                  <label className="block text-sm font-bold text-zinc-700 mb-1.5">{t.customUrl}</label>
                  <div className="flex items-center shadow-sm rounded-xl">
                    <span className="bg-zinc-100 border border-r-0 border-zinc-200 px-4 py-3 rounded-l-xl text-zinc-500 text-sm font-medium">
                      vibecv.com/p/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      className="flex-1 w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-r-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder={t.slugPlaceholder}
                    />
                  </div>
                  {formData.slug && (
                    <Link href={`/p/${formData.slug}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 mt-3 hover:text-indigo-700 transition-colors">
                      {t.previewLink} <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-6 border-t border-zinc-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-zinc-900 shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> {t.savingData}</>
              ) : (
                <>{t.saveProfile}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}