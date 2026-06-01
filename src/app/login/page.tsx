// src/app/login/page.tsx
'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import { Loader2 } from 'lucide-react'; // FIX: Hapus Image dari sini
import Image from 'next/image'; // FIX: Impor Image dari next/image

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ID;

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (error: any) {
      alert(`Gagal login`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 z-10 animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
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
          <p className="mt-3 text-sm text-zinc-500 font-medium">{t.loginTitle}</p>
        </div>
        
        <button onClick={handleGoogleLogin} disabled={isLoading} className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-all">
          {isLoading ? <Loader2 size={20} className="animate-spin text-zinc-500" /> : (
            <svg viewBox="0 0 48 48" className="w-5 h-5 absolute left-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          )}
          <span>{isLoading ? t.loginRedirect : t.loginAction}</span>
        </button>
      </div>
    </div>
  );
}