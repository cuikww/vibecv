// src/components/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. TAMBAHKAN TIPE DATANYA DI SINI
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  isLoadingLanguage: boolean; 
};

// 2. BERIKAN NILAI BAWAANNYA
const LanguageContext = createContext<LanguageContextType>({
  language: 'ID',
  setLanguage: () => {},
  isLoadingLanguage: true, // Nilai default saat pertama kali render
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('ID');
  
  // 3. BUAT STATE UNTUK LOADING
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);

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
      } finally {
        // 4. MATIKAN LOADING SETELAH PROSES SELESAI (Berhasil atau Gagal)
        setIsLoadingLanguage(false);
      }
    };

    fetchUserLanguage();
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('vibe_lang', lang);
  };

  return (
    // 5. JANGAN LUPA MELEMPARKAN isLoadingLanguage KE DALAM PROVIDER
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isLoadingLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);