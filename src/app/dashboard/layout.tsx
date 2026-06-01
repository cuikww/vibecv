// src/app/dashboard/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, LayoutDashboard, User, Briefcase, GraduationCap, Zap, Upload, Target } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ID;

  // Sekarang menuItems menggunakan kamus dinamis 't'
  const menuItems = [
    { name: t.menuOverview, icon: LayoutDashboard, href: '/dashboard' },
    { name: t.menuProfile, icon: User, href: '/dashboard/profile' },
    { name: t.menuEdu, icon: GraduationCap, href: '/dashboard/education' },
    { name: t.menuExp, icon: Briefcase, href: '/dashboard/experience' },
    { name: t.menuSkill, icon: Zap, href: '/dashboard/skills' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex border-t border-zinc-200">
      
      <aside className="w-72 bg-white border-r border-zinc-200/60 hidden lg:flex flex-col sticky top-0 h-screen animate-fade-in">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <div className="font-extrabold text-2xl tracking-tight text-zinc-900 flex items-center gap-2">
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
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 px-3">Menu Utama</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-zinc-200 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
          <div className="font-extrabold text-xl tracking-tight text-zinc-900 flex items-center gap-2">
            <Layers className="text-indigo-600 w-5 h-5" /> VibeCV
          </div>
          <LanguageToggle />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative bg-zinc-50">
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