// src/app/dashboard/import/page.tsx
'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/ai/extract-linkedin', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setExtractedData(data);
      } else {
        alert("Gagal membaca PDF. Pastikan file valid.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!extractedData) return;
    setIsSaving(true);

    try {
      const savePromises: Promise<Response>[] = [];

      if (extractedData.experiences) {
        extractedData.experiences.forEach((exp: any) => {
          savePromises.push(fetch('/api/experience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exp)
          }));
        });
      }

      if (extractedData.educations) {
        extractedData.educations.forEach((edu: any) => {
          savePromises.push(fetch('/api/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(edu)
          }));
        });
      }

      if (extractedData.skills) {
        extractedData.skills.forEach((skillName: string) => {
          savePromises.push(fetch('/api/skills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: skillName })
          }));
        });
      }

      await Promise.all(savePromises);
      alert(language === 'EN' ? "All data successfully saved!" : "Seluruh data berhasil disimpan!");
      router.push('/dashboard'); 
      
    } catch (error) {
      alert("Gagal menyimpan beberapa data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto opacity-0 animate-slide-up delay-100 pb-12">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.backToDash}
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{t.importTitle}</h1>
        <p className="text-zinc-500 font-medium text-sm">{t.importDesc}</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 mb-8">
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-indigo-200 border-dashed rounded-2xl cursor-pointer bg-indigo-50/30 hover:bg-indigo-50 transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isAnalyzing ? (
              <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
            ) : (
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                <UploadCloud size={28} className="text-indigo-500" />
              </div>
            )}
            <p className="mb-2 text-sm text-indigo-900 font-bold">
              {isAnalyzing ? t.analyzingPdf : (file ? file.name : t.uploadBtn)}
            </p>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">PDF LinkedIn (Max 5MB)</p>
          </div>
          <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} disabled={isAnalyzing} />
        </label>
      </div>

      {extractedData && (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 animate-fade-in">
          <h2 className="text-xl font-bold text-zinc-900 mb-8 flex items-center gap-2 border-b border-zinc-100 pb-4">
            <CheckCircle2 className="text-emerald-500" /> {t.previewTitle}
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{t.expTitle}</h3>
              <div className="space-y-3">
                {extractedData.experiences?.map((exp: any, i: number) => (
                  <div key={i} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
                    <p className="font-bold text-zinc-900 text-sm">{exp.position} <span className="font-medium text-zinc-500">di {exp.company}</span></p>
                    <p className="text-zinc-400 text-xs mt-1">{exp.startDate} - {exp.endDate || t.now}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{t.eduTitle}</h3>
              <div className="space-y-3">
                {extractedData.educations?.map((edu: any, i: number) => (
                  <div key={i} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
                    <p className="font-bold text-zinc-900 text-sm">{edu.degree} {edu.major}</p>
                    <p className="text-zinc-500 text-sm">{edu.institution} <span className="text-zinc-400 text-xs ml-2">({edu.startDate} - {edu.endDate || t.now})</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{t.skillTitle}</h3>
              <div className="flex flex-wrap gap-2">
                {extractedData.skills?.map((skill: string, i: number) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 text-xs rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-100 flex justify-end">
            <button 
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="w-full md:w-auto bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />} 
              {isSaving ? t.savingAll : t.saveAllBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}