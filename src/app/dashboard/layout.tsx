// src/app/dashboard/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Briefcase, GraduationCap, Zap, Upload, Target } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ID;

  const menuItems = [
    { name: t.menuOverview, icon: LayoutDashboard, href: '/dashboard' },
    { name: t.menuProfile, icon: User, href: '/dashboard/profile' },
    { name: t.menuEdu, icon: GraduationCap, href: '/dashboard/education' },
    { name: t.menuExp, icon: Briefcase, href: '/dashboard/experience' },
    { name: t.menuSkill, icon: Zap, href: '/dashboard/skills' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row border-t border-zinc-200">
      
      {/* ========================================= */}
      {/* 1. SIDEBAR UNTUK DESKTOP (Layar Besar)    */}
      {/* ========================================= */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-zinc-200/60 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <div className="font-extrabold text-2xl tracking-tight text-zinc-900 flex items-center gap-2">
            <Image src="/logo.png" alt="VibeCV Logo" width={28} height={28} className="object-contain" priority /> 
            VibeCV
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 px-3">Menu Utama</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
              >
                <item.icon className="w-4 h-4" /> {item.name}
              </Link>
            );
          })}
          <div className="mt-8 pt-6 border-t border-zinc-100 space-y-1.5">
            <Link href="/dashboard/import" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
              <Upload className="w-4 h-4" /> {t.menuImport}
            </Link>
            <Link href="/dashboard/ats" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors">
              <span className="flex items-center gap-2"><Target className="w-4 h-4 text-indigo-600" /> {t.menuAts}</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* ========================================= */}
      {/* 2. MENU HORIZONTAL UNTUK MOBILE & TABLET  */}
      {/* ========================================= */}
      <div className="lg:hidden flex flex-col sticky top-0 z-50 bg-white border-b border-zinc-200 shadow-sm">
        {/* Header Mobile */}
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="font-extrabold text-xl tracking-tight text-zinc-900 flex items-center gap-2">
            <Image src="/logo.png" alt="VibeCV Logo" width={24} height={24} className="object-contain" priority /> 
            VibeCV
          </div>
          <LanguageToggle />
        </div>
        
        {/* Navigasi Horizontal yang bisa di-scroll (Swipe) */}
        <nav 
          className="flex overflow-x-auto px-3 py-2 gap-2 bg-zinc-50 border-t border-zinc-100 items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Menyembunyikan scrollbar bawaan agar rapi
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-zinc-500 bg-white border border-zinc-200 hover:bg-zinc-100'}`}
              >
                <item.icon className="w-4 h-4" /> {item.name}
              </Link>
            );
          })}
          {/* Garis Pemisah (Divider) */}
          <div className="w-px h-6 bg-zinc-300 mx-1 flex-shrink-0"></div>
          {/* Menu Ekstra */}
          <Link href="/dashboard/import" className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-100 transition-all">
            <Upload className="w-4 h-4" /> Import
          </Link>
          <Link href="/dashboard/ats" className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all">
            <Target className="w-4 h-4" /> ATS
          </Link>
        </nav>
      </div>

      {/* ========================================= */}
      {/* 3. AREA KONTEN UTAMA                      */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-y-auto">
        <main className="flex-1 p-4 md:p-8 relative bg-zinc-50">
          {/* Language toggle versi desktop dipindah ke kanan atas */}
          <div className="hidden lg:flex justify-end mb-4">
            <LanguageToggle />
          </div>
          
          <div className="max-w-4xl mx-auto w-full animate-slide-up">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}