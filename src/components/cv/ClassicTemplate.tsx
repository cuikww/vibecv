// src/components/cv/ClassicTemplate.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { translations } from '@/utils/translations';
import { colorMap } from './ModernTemplate';

interface TemplateProps {
  data: any;
  themeConfig?: { color: string; font: string };
}

export const ClassicTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data, themeConfig }, ref) => {
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
      {/* TOP HEADER BAR */}
      <div className={`${color.bg} px-12 py-8 flex justify-between items-center`}>
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight">
            {data.profile?.fullName || 'Nama Lengkap Anda'}
          </h1>
          {data.profile?.jobTitle && (
            <p className="text-sm font-semibold text-white/80 mt-1 uppercase tracking-widest">{data.profile.jobTitle}</p>
          )}
        </div>
        {data.profile?.photoUrl && (
          <img src={data.profile.photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg flex-shrink-0" />
        )}
      </div>

      {/* CONTACT BAR */}
      <div className="bg-zinc-100 px-12 py-2.5 flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-medium text-zinc-600 border-b border-zinc-200">
        {data.profile?.phone && <span>📞 {data.profile.phone}</span>}
        <span>✉️ {data.profile?.email || data.email}</span>
        {data.profile?.linkedin && <span>🔗 {data.profile.linkedin}</span>}
      </div>

      <div className="px-12 py-8 space-y-7">
        {/* SUMMARY */}
        {data.profile?.summary && (
          <section>
            <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-2 pb-1 border-b-2 ${color.border}`}>Profil Singkat</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">{data.profile.summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        <section>
          <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b-2 ${color.border}`}>{t.expTitle}</h2>
          <div className="space-y-5">
            {experiences.length > 0 ? experiences.map((exp: any) => (
              <div key={exp.id} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-right">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase leading-tight block mt-0.5">
                    {new Date(exp.startDate).getFullYear()} – {exp.endDate ? new Date(exp.endDate).getFullYear() : t.now}
                  </span>
                  <span className={`text-[10px] font-semibold ${color.highlight} block mt-1`}>{exp.company}</span>
                </div>
                <div className="col-span-3 pl-4 border-l-2 border-zinc-200">
                  <h3 className="font-bold text-sm text-zinc-900 mb-1">{exp.position}</h3>
                  <div className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed">{exp.description}</div>
                </div>
              </div>
            )) : <p className="text-[11px] text-zinc-400 italic">Belum ada pengalaman ditambahkan.</p>}
          </div>
        </section>

        {/* EDUCATION */}
        <section>
          <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b-2 ${color.border}`}>{t.eduTitle}</h2>
          <div className="space-y-3">
            {educations.length > 0 ? educations.map((edu: any) => (
              <div key={edu.id} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-right">
                  <span className="text-[10px] font-bold text-zinc-400">{edu.endDate ? new Date(edu.endDate).getFullYear() : t.now}</span>
                </div>
                <div className="col-span-3 pl-4 border-l-2 border-zinc-200">
                  <h3 className="font-bold text-sm text-zinc-900">{edu.institution}</h3>
                  <p className="text-xs text-zinc-500">{edu.degree} {edu.major}</p>
                </div>
              </div>
            )) : <p className="text-[11px] text-zinc-400 italic">Belum ada pendidikan ditambahkan.</p>}
          </div>
        </section>

        {/* SKILLS */}
        <section>
          <h2 className={`text-xs font-black ${color.text} uppercase tracking-widest mb-3 pb-1 border-b-2 ${color.border}`}>{t.skillTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? skills.map((skill: any) => (
              <span key={skill.id} className={`px-3 py-1 text-[11px] font-bold rounded-full border ${color.border} ${color.text} bg-white`}>
                {skill.name}
              </span>
            )) : <p className="text-[11px] text-zinc-400 italic">Belum ada keahlian.</p>}
          </div>
        </section>
      </div>
    </div>
  );
});
ClassicTemplate.displayName = "ClassicTemplate";
