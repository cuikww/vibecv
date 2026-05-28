// src/components/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ID',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('ID');

  useEffect(() => {
    // 1. Cek dari penyimpanan lokal browser dulu agar responsif
    const savedLang = localStorage.getItem('vibe_lang');
    if (savedLang) setLanguage(savedLang);

    // 2. Fetch ke database secara aman
    const fetchUserLanguage = async () => {
      try {
        const res = await fetch('/api/profile');
        
        // Cek apakah response sukses DAN formatnya benar-benar JSON (Bukan HTML halaman login)
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data?.language) {
            setLanguage(data.language);
            localStorage.setItem('vibe_lang', data.language);
          }
        }
      } catch (error) {
        // Abaikan secara diam-diam jika fetch gagal (misal: user belum login / sedang di landing page)
        console.log("Menjalankan mode pengunjung (Guest Mode).");
      }
    };

    fetchUserLanguage();
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('vibe_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);