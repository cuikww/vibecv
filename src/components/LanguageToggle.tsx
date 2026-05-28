// src/components/LanguageToggle.tsx

'use client';

import { useLanguage } from '@/components/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage, isLoadingLanguage } = useLanguage();

  if (isLoadingLanguage) return <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-full"></div>;

  const toggleLanguage = () => {
    setLanguage(language === 'ID' ? 'EN' : 'ID');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-full shadow-sm hover:border-indigo-500 hover:text-indigo-600 transition-all font-medium text-sm"
    >
      <Globe size={16} className={language === 'EN' ? "text-indigo-600" : "text-gray-500"} />
      {language === 'ID' ? '🇮🇩 ID' : '🇬🇧 EN'}
    </button>
  );
};