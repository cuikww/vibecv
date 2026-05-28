// src/components/cv/ModernTemplate.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';

interface TemplateProps {
  data: any;
  themeConfig?: { color: string; font: string };
}

export const colorMap: Record<string, { border: string; text: string; bg: string; highlight: string; sidebarBg: string; sidebarText: string }> = {
  indigo:  { border: 'border-indigo-600',  text: 'text-indigo-700',  bg: 'bg-indigo-600',  highlight: 'text-indigo-600',  sidebarBg: 'bg-indigo-600',  sidebarText: 'text-white' },
  blue:    { border: 'border-blue-600',    text: 'text-blue-700',    bg: 'bg-blue-600',    highlight: 'text-blue-600',    sidebarBg: 'bg-blue-700',    sidebarText: 'text-white' },
  emerald: { border: 'border-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-600', highlight: 'text-emerald-600', sidebarBg: 'bg-emerald-700', sidebarText: 'text-white' },
  teal:    { border: 'border-teal-600',    text: 'text-teal-700',    bg: 'bg-teal-600',    highlight: 'text-teal-600',    sidebarBg: 'bg-teal-700',    sidebarText: 'text-white' },
  rose:    { border: 'border-rose-600',    text: 'text-rose-700',    bg: 'bg-rose-600',    highlight: 'text-rose-600',    sidebarBg: 'bg-rose-600',    sidebarText: 'text-white' },
  purple:  { border: 'border-purple-600',  text: 'text-purple-700',  bg: 'bg-purple-600',  highlight: 'text-purple-600',  sidebarBg: 'bg-purple-700',  sidebarText: 'text-white' },
  amber:   { border: 'border-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-500',   highlight: 'text-amber-600',   sidebarBg: 'bg-amber-500',   sidebarText: 'text-zinc-900' },
  zinc:    { border: 'border-zinc-800',    text: 'text-zinc-900',    bg: 'bg-zinc-800',    highlight: 'text-zinc-600',    sidebarBg: 'bg-zinc-800',    sidebarText: 'text-white' },
};

export const ModernTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data, themeConfig }, ref) => {
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
      className={`bg-white w-[210mm] min-h-[297mm] text-zinc-800 leading-relaxed print:shadow-none print:m-0 box-border ${fontFamily}`}
    >
      <div className="p-10">
        {/* HEADER */}
        <div className={`border-b-4 ${color.border} pb-6 mb-7 flex justify-between items-end`}>
          <div>
            <h1 className="text-4xl font-black uppercase text-zinc-900 tracking-tighter">
              {data.profile?.fullName || 'Nama Lengkap Anda'}
            </h1>
            {data.profile?.jobTitle && (
              <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${color.highlight}`}>{data.profile.jobTitle}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-medium text-zinc-500">
              {data.profile?.phone && <span>{data.profile.phone}</span>}
              {data.profile?.phone && <span>·</span>}
              <span>{data.profile?.email || data.email}</span>
              {data.profile?.linkedin && (<><span>·</span><span className="truncate max-w-[180px]">{data.profile.linkedin}</span></>)}
            </div>
          </div>
          {data.profile?.photoUrl && (
            <img src={data.profile.photoUrl} alt="Profile" className={`w-20 h-20 rounded-full object-cover border-4 ${color.border} shadow-sm flex-shrink-0`} />
          )}
        </div>

        {/* SUMMARY */}
        {data.profile?.summary && (
          <div className="mb-7">
            <p className="text-xs text-zinc-600 italic leading-relaxed text-justify">"{data.profile.summary}"</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* LEFT: EXPERIENCE & EDUCATION */}
          <div className="col-span-2 space-y-7">
            <section>
              <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b border-zinc-200`}>{t.expTitle}</h2>
              <div className="space-y-5">
                {experiences.length > 0 ? experiences.map((exp: any) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-sm text-zinc-900">{exp.position}</h3>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase whitespace-nowrap">
                        {new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : t.now}
                      </span>
                    </div>
                    <p className={`text-xs font-semibold ${color.highlight} mb-1.5`}>{exp.company}</p>
                    <div className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-zinc-100">{exp.description}</div>
                  </div>
                )) : <p className="text-[11px] text-zinc-400 italic">Belum ada pengalaman ditambahkan.</p>}
              </div>
            </section>

            <section>
              <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b border-zinc-200`}>{t.eduTitle}</h2>
              <div className="space-y-3">
                {educations.length > 0 ? educations.map((edu: any) => (
                  <div key={edu.id} className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">{edu.institution}</h3>
                      <p className="text-xs text-zinc-500">{edu.degree} {edu.major}</p>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">{edu.endDate ? new Date(edu.endDate).getFullYear() : t.now}</span>
                  </div>
                )) : <p className="text-[11px] text-zinc-400 italic">Belum ada pendidikan ditambahkan.</p>}
              </div>
            </section>
          </div>

          {/* RIGHT: SKILLS */}
          <div className="col-span-1">
            <section>
              <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b border-zinc-200`}>{t.skillTitle}</h2>
              <div className="flex flex-col gap-2.5">
                {skills.length > 0 ? skills.map((skill: any) => (
                  <div key={skill.id}>
                    <span className="text-xs font-bold text-zinc-800 block">{skill.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{skill.level || 'Intermediate'}</span>
                  </div>
                )) : <p className="text-[11px] text-zinc-400 italic">Belum ada keahlian.</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
});
ModernTemplate.displayName = "ModernTemplate";
