// src/components/cv/MinimalistTemplate.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import { colorMap } from './ModernTemplate';

interface TemplateProps {
  data: any;
  themeConfig?: { color: string; font: string };
}

export const MinimalistTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data, themeConfig }, ref) => {
  const { language } = useLanguage();
  const t = (translations as any)[language] || translations.ID;

  if (!data) return null;

  const color = colorMap[themeConfig?.color || 'indigo'];
  const fontFamily = themeConfig?.font === 'serif' ? 'font-serif' : themeConfig?.font === 'mono' ? 'font-mono' : 'font-sans';

  const experiences = Array.isArray(data.experiences) ? data.experiences : [];
  const educations = Array.isArray(data.educations) ? data.educations : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];

  return (
    <div
      ref={ref}
      className={`bg-white w-[210mm] min-h-[297mm] text-zinc-800 leading-relaxed print:shadow-none print:m-0 box-border ${fontFamily} flex`}
    >
      {/* SIDEBAR */}
      <div className={`w-[68mm] ${color.sidebarBg} ${color.sidebarText} flex-shrink-0 p-7 flex flex-col gap-7`}>
        {/* Photo & Name */}
        <div className="text-center">
          {data.profile?.photoUrl ? (
            <img src={data.profile.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-md mx-auto mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-black text-white/60">{(data.profile?.fullName || 'A')[0]}</span>
            </div>
          )}
          <h1 className="text-lg font-black uppercase leading-tight">{data.profile?.fullName || 'Nama Anda'}</h1>
          {data.profile?.jobTitle && <p className="text-xs font-semibold opacity-70 mt-1 uppercase tracking-wider">{data.profile.jobTitle}</p>}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2 pb-1 border-b border-white/20">Kontak</h2>
          <div className="space-y-1.5 text-[11px]">
            {data.profile?.phone && <p className="opacity-80 break-all">{data.profile.phone}</p>}
            <p className="opacity-80 break-all">{data.profile?.email || data.email}</p>
            {data.profile?.linkedin && <p className="opacity-80 break-all">{data.profile.linkedin}</p>}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2 pb-1 border-b border-white/20">{t.skillTitle}</h2>
          <div className="space-y-2">
            {skills.length > 0 ? skills.map((skill: any) => (
              <div key={skill.id}>
                <span className="text-xs font-bold block">{skill.name}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60">{skill.level || 'Intermediate'}</span>
              </div>
            )) : <p className="text-[11px] opacity-50 italic">–</p>}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 space-y-7">
        {/* Summary */}
        {data.profile?.summary && (
          <section>
            <h2 className={`text-[10px] font-black ${color.text} uppercase tracking-widest mb-2 pb-1 border-b border-zinc-200`}>Profil</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">{data.profile.summary}</p>
          </section>
        )}

        {/* Experience */}
        <section>
          <h2 className={`text-[10px] font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b border-zinc-200`}>{t.expTitle}</h2>
          <div className="space-y-5">
            {experiences.length > 0 ? experiences.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-zinc-900">{exp.position}</h3>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase whitespace-nowrap mt-0.5">
                    {new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : t.now}
                  </span>
                </div>
                <p className={`text-xs font-semibold ${color.highlight} mb-1.5`}>{exp.company}</p>
                <div className="text-[11px] text-zinc-500 whitespace-pre-line leading-relaxed">{exp.description}</div>
              </div>
            )) : <p className="text-[11px] text-zinc-400 italic">Belum ada pengalaman ditambahkan.</p>}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className={`text-[10px] font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b border-zinc-200`}>{t.eduTitle}</h2>
          <div className="space-y-3">
            {educations.length > 0 ? educations.map((edu: any) => (
              <div key={edu.id} className="flex justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{edu.institution}</h3>
                  <p className="text-xs text-zinc-500">{edu.degree} {edu.major}</p>
                </div>
                <span className="text-[9px] font-bold text-zinc-400 whitespace-nowrap mt-0.5">{edu.endDate ? new Date(edu.endDate).getFullYear() : t.now}</span>
              </div>
            )) : <p className="text-[11px] text-zinc-400 italic">Belum ada pendidikan ditambahkan.</p>}
          </div>
        </section>
      </div>
    </div>
  );
});
MinimalistTemplate.displayName = "MinimalistTemplate";
