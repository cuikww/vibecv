// src/app/p/[slug]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ModernTemplate } from '@/components/cv/ModernTemplate';
import { Loader2, Globe, AlertCircle } from 'lucide-react';

export default function PublicPortfolio() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/${params.slug}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(json => setData(json))
      .catch(() => setError(true));
  }, [params.slug]);

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold">Portofolio Tidak Ditemukan</h1>
      <p className="text-gray-500">Mungkin link salah atau pemilik menonaktifkan akses publik.</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-0 md:py-12 px-0 md:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Banner Status (Hanya untuk owner yang melihat preview, atau biarkan bersih) */}
        <div className="bg-indigo-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 md:rounded-t-xl">
          <Globe size={14} /> Public Portfolio Mode
        </div>
        
        {/* Komponen CV yang sama, tapi sekarang tampil di web */}
        <div className="bg-white shadow-2xl overflow-x-auto">
           <ModernTemplate data={data} />
        </div>

        <footer className="mt-8 pb-12 text-center text-gray-400 text-sm">
          Powered by <span className="font-bold text-gray-600">VibeCV</span>
        </footer>
      </div>
    </div>
  );
}