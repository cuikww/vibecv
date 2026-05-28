// src/components/cv/templates.tsx
'use client';

import React from 'react';
import { buildCssVars } from './theme';
import type { ColorShades } from './theme';

export interface TemplateProps {
  data: any;
  shades: ColorShades;
  fontFamily: string;
  t: any;
}

const arr = (v: any) => (Array.isArray(v) ? v : []);
const yr = (d: string) => (d ? new Date(d).getFullYear() : '');

// Wrapper A4 Standard
const A4 = 'bg-white w-[210mm] min-h-[297mm] text-zinc-800 print:shadow-none print:m-0 box-border';

// ─── 1. MODERN ────────────────────────────────────────────────────────────────
export const ModernTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ data, shades, fontFamily, t }, ref) => {
    const cssVars = buildCssVars(shades, fontFamily);
    const exps  = arr(data.experiences);
    const edus  = arr(data.educations);
    const skills = arr(data.skills);

    return (
      <div ref={ref} className={A4} style={cssVars}>
        <div className="p-12">
          <div className="pb-6 mb-8 flex justify-between items-center break-inside-avoid" style={{ borderBottom: `4px solid var(--cv-primary)` }}>
            <div className="flex-1 pr-4">
              <h1 className="text-[42px] font-black uppercase text-zinc-900 tracking-tighter leading-[1.1]">
                {data.profile?.fullName || 'Your Name'}
              </h1>
              {data.profile?.jobTitle && (
                <p className="text-[14px] font-bold uppercase tracking-widest mt-2" style={{ color: 'var(--cv-primary)' }}>
                  {data.profile.jobTitle}
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[12px] font-medium text-zinc-500">
                {data.profile?.phone && <span>{data.profile.phone}</span>}
                {data.profile?.phone && <span>|</span>}
                <span>{data.profile?.email || data.email}</span>
                {data.profile?.linkedin && <><span>|</span><span className="truncate max-w-[250px]">{data.profile.linkedin}</span></>}
              </div>
            </div>
            {data.profile?.photoUrl && (
              <div className="flex-shrink-0 rounded-full overflow-hidden shadow-sm" style={{ width: '112px', height: '112px', minWidth: '112px', minHeight: '112px', border: `4px solid var(--cv-primary)` }}>
                <img src={data.profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {data.profile?.summary && (
            <div className="break-inside-avoid mb-8">
               <p className="text-[13px] text-zinc-600 italic leading-relaxed text-justify">"{data.profile.summary}"</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2 space-y-8">
              <section>
                <SectionTitle color="var(--cv-primary)">{t.expTitle}</SectionTitle>
                <div className="space-y-6">
                  {exps.length ? exps.map((e: any) => (
                    <div key={e.id} className="break-inside-avoid">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-[16px] text-zinc-900">{e.position}</span>
                        <span className="text-[11px] font-bold text-zinc-400 uppercase whitespace-nowrap">{yr(e.startDate)} – {e.endDate ? yr(e.endDate) : t.now}</span>
                      </div>
                      <p className="text-[14px] font-bold mb-1.5" style={{ color: 'var(--cv-primary)' }}>{e.company}</p>
                      <RenderDescription text={e.description} className="text-[12px] text-zinc-600 leading-relaxed pl-3" style={{ borderLeft: '3px solid #e4e4e7' }} />
                    </div>
                  )) : <EmptyNote />}
                </div>
              </section>
              <section>
                <SectionTitle color="var(--cv-primary)">{t.eduTitle}</SectionTitle>
                <div className="space-y-4">
                  {edus.length ? edus.map((e: any) => (
                    <div key={e.id} className="flex justify-between gap-2 items-start break-inside-avoid">
                      <div>
                        <p className="font-bold text-[15px] text-zinc-900 mb-0.5">{e.institution}</p>
                        <p className="text-[13px] text-zinc-500 font-medium">{e.degree} {e.major}</p>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap mt-1">{e.endDate ? yr(e.endDate) : t.now}</span>
                    </div>
                  )) : <EmptyNote />}
                </div>
              </section>
            </div>

            <div className="col-span-1 space-y-8">
              <section>
                <SectionTitle color="var(--cv-primary)">{t.skillTitle}</SectionTitle>
                <div className="space-y-3">
                  {skills.length ? skills.map((s: any) => (
                    <div key={s.id} className="break-inside-avoid">
                      <span className="text-[14px] font-bold text-zinc-800 block">{s.name}</span>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{s.level || 'Intermediate'}</span>
                    </div>
                  )) : <EmptyNote />}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ModernTemplate.displayName = 'ModernTemplate';

// ─── 2. CLASSIC ──────────────────────────────────────────────────────────────
export const ClassicTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ data, shades, fontFamily, t }, ref) => {
    const cssVars = buildCssVars(shades, fontFamily);
    const exps  = arr(data.experiences);
    const edus  = arr(data.educations);
    const skills = arr(data.skills);

    return (
      <div ref={ref} className={A4} style={cssVars}>
        <div className="px-14 py-10 flex justify-between items-center break-inside-avoid" style={{ background: 'var(--cv-bg)' }}>
          <div>
            <h1 className="text-[38px] font-black uppercase leading-none" style={{ color: 'var(--cv-on-bg)' }}>
              {data.profile?.fullName || 'Your Name'}
            </h1>
            {data.profile?.jobTitle && (
              <p className="text-[13px] uppercase tracking-widest mt-2 font-bold" style={{ color: 'var(--cv-on-bg)', opacity: 0.8 }}>
                {data.profile.jobTitle}
              </p>
            )}
          </div>
          {data.profile?.photoUrl && (
            <div className="flex-shrink-0 rounded-full overflow-hidden shadow-md" style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', border: '4px solid rgba(255,255,255,0.4)' }}>
              <img src={data.profile.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="px-14 py-3 flex flex-wrap gap-x-6 gap-y-1 text-[12px] font-medium bg-zinc-100 border-b border-zinc-200 text-zinc-600 break-inside-avoid">
          {data.profile?.phone && <span>📞 {data.profile.phone}</span>}
          <span>✉️ {data.profile?.email || data.email}</span>
          {data.profile?.linkedin && <span>🔗 {data.profile.linkedin}</span>}
        </div>

        <div className="px-14 py-10 space-y-8">
          {data.profile?.summary && (
            <section className="break-inside-avoid">
              {/* DIGANTI KE KAMUS DINAMIS */}
              <SectionTitle color="var(--cv-primary)" border="var(--cv-primary)">{t.aboutMe || 'Profile'}</SectionTitle>
              <p className="text-[13px] text-zinc-600 leading-relaxed text-justify">{data.profile.summary}</p>
            </section>
          )}

          <section>
            <SectionTitle color="var(--cv-primary)" border="var(--cv-primary)">{t.expTitle}</SectionTitle>
            <div className="space-y-6">
              {exps.length ? exps.map((e: any) => (
                <div key={e.id} className="grid grid-cols-4 gap-6 break-inside-avoid">
                  <div className="col-span-1 text-right pt-1">
                    <span className="text-[11px] font-bold text-zinc-400 block">{yr(e.startDate)} – {e.endDate ? yr(e.endDate) : t.now}</span>
                    <span className="text-[12px] font-bold block mt-1" style={{ color: 'var(--cv-primary)' }}>{e.company}</span>
                  </div>
                  <div className="col-span-3 pl-5" style={{ borderLeft: '3px solid #e4e4e7' }}>
                    <p className="font-bold text-[16px] text-zinc-900 mb-1.5">{e.position}</p>
                    <RenderDescription text={e.description} className="text-[12px] text-zinc-600 leading-relaxed" />
                  </div>
                </div>
              )) : <EmptyNote />}
            </div>
          </section>

          <section>
            <SectionTitle color="var(--cv-primary)" border="var(--cv-primary)">{t.eduTitle}</SectionTitle>
            <div className="space-y-4">
              {edus.length ? edus.map((e: any) => (
                <div key={e.id} className="grid grid-cols-4 gap-6 break-inside-avoid">
                  <div className="col-span-1 text-right pt-0.5">
                    <span className="text-[11px] font-bold text-zinc-400">{e.endDate ? yr(e.endDate) : t.now}</span>
                  </div>
                  <div className="col-span-3 pl-5" style={{ borderLeft: '3px solid #e4e4e7' }}>
                    <p className="font-bold text-[15px] text-zinc-900 mb-0.5">{e.institution}</p>
                    <p className="text-[13px] text-zinc-600 font-medium">{e.degree} {e.major}</p>
                  </div>
                </div>
              )) : <EmptyNote />}
            </div>
          </section>

          <section className="break-inside-avoid">
            <SectionTitle color="var(--cv-primary)" border="var(--cv-primary)">{t.skillTitle}</SectionTitle>
            <div className="flex flex-wrap gap-3">
              {skills.length ? skills.map((s: any) => (
                <span key={s.id} className="px-4 py-1.5 text-[12px] font-bold rounded-full" style={{ border: `1.5px solid var(--cv-primary)`, color: 'var(--cv-primary)' }}>
                  {s.name}
                </span>
              )) : <EmptyNote />}
            </div>
          </section>
        </div>
      </div>
    );
  }
);
ClassicTemplate.displayName = 'ClassicTemplate';

// ─── 3. MINIMALIST ───────────────────────────────────────────────────────────
export const MinimalistTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ data, shades, fontFamily, t }, ref) => {
    const cssVars = buildCssVars(shades, fontFamily);
    const exps  = arr(data.experiences);
    const edus  = arr(data.educations);
    const skills = arr(data.skills);

    return (
      <div ref={ref} className={`${A4} flex flex-row`} style={cssVars}>
        <div className="w-[75mm] flex-shrink-0 p-8 flex flex-col gap-8" style={{ background: 'var(--cv-bg)', color: 'var(--cv-on-bg)' }}>
          <div className="break-inside-avoid flex flex-col items-center">
            {data.profile?.photoUrl ? (
              <div className="rounded-full mx-auto overflow-hidden flex-shrink-0" style={{ width: '128px', height: '128px', minWidth: '128px', minHeight: '128px', border: '4px solid rgba(255,255,255,0.2)' }}>
                <img src={data.profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-full mx-auto flex items-center justify-center text-5xl font-black flex-shrink-0" style={{ width: '128px', height: '128px', minWidth: '128px', minHeight: '128px', background: 'rgba(255,255,255,0.15)' }}>
                {(data.profile?.fullName || 'A')[0]}
              </div>
            )}
            <div className="text-center mt-6 w-full">
              <h1 className="text-[20px] font-black uppercase leading-tight">{data.profile?.fullName || 'Your Name'}</h1>
              {data.profile?.jobTitle && <p className="text-[11px] font-bold uppercase tracking-widest mt-2 opacity-70">{data.profile.jobTitle}</p>}
            </div>
          </div>
          {/* DIGANTI KE KAMUS DINAMIS */}
          <SideSection label={t.contact || 'Contact'} className="break-inside-avoid">
            <div className="space-y-2 text-[12px] font-medium opacity-90">
              {data.profile?.phone && <p className="break-all">{data.profile.phone}</p>}
              <p className="break-all">{data.profile?.email || data.email}</p>
              {data.profile?.linkedin && <p className="break-all">{data.profile.linkedin}</p>}
            </div>
          </SideSection>
          <SideSection label={t.skillTitle}>
            <div className="space-y-3">
              {skills.length ? skills.map((s: any) => (
                <div key={s.id} className="break-inside-avoid">
                  <p className="text-[13px] font-bold">{s.name}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">{s.level || 'Intermediate'}</p>
                </div>
              )) : <p className="text-[12px] opacity-40 italic">–</p>}
            </div>
          </SideSection>
        </div>

        <div className="flex-1 p-10 space-y-8">
          {data.profile?.summary && (
            <section className="break-inside-avoid">
              {/* DIGANTI KE KAMUS DINAMIS */}
              <MainSectionTitle color="var(--cv-primary)">{t.aboutMe || 'Profile'}</MainSectionTitle>
              <p className="text-[13px] text-zinc-600 leading-relaxed text-justify">{data.profile.summary}</p>
            </section>
          )}
          <section>
            <MainSectionTitle color="var(--cv-primary)">{t.expTitle}</MainSectionTitle>
            <div className="space-y-6">
              {exps.length ? exps.map((e: any) => (
                <div key={e.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <span className="font-bold text-[16px] text-zinc-900">{e.position}</span>
                    <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">{yr(e.startDate)} – {e.endDate ? yr(e.endDate) : t.now}</span>
                  </div>
                  <p className="text-[13px] font-bold mb-1.5" style={{ color: 'var(--cv-primary)' }}>{e.company}</p>
                  <RenderDescription text={e.description} className="text-[12px] text-zinc-600 leading-relaxed" />
                </div>
              )) : <EmptyNote />}
            </div>
          </section>
          <section>
            <MainSectionTitle color="var(--cv-primary)">{t.eduTitle}</MainSectionTitle>
            <div className="space-y-4">
              {edus.length ? edus.map((e: any) => (
                <div key={e.id} className="flex justify-between gap-2 items-start break-inside-avoid">
                  <div>
                    <p className="font-bold text-[15px] text-zinc-900 mb-0.5">{e.institution}</p>
                    <p className="text-[12px] text-zinc-500 font-medium">{e.degree} {e.major}</p>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap mt-1">{e.endDate ? yr(e.endDate) : t.now}</span>
                </div>
              )) : <EmptyNote />}
            </div>
          </section>
        </div>
      </div>
    );
  }
);
MinimalistTemplate.displayName = 'MinimalistTemplate';

// ─── 4. EXECUTIVE ────────────────────────────────────────────────────────────
export const ExecutiveTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ data, shades, fontFamily, t }, ref) => {
    const cssVars = buildCssVars(shades, fontFamily);
    const exps  = arr(data.experiences);
    const edus  = arr(data.educations);
    const skills = arr(data.skills);

    return (
      <div ref={ref} className={`${A4} flex`} style={cssVars}>
        <div className="w-[85mm] flex-shrink-0 flex flex-col" style={{ background: 'var(--cv-dark)' }}>
          <div className="p-10 pb-8 break-inside-avoid flex flex-col items-start" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {data.profile?.photoUrl ? (
              <div className="rounded-xl overflow-hidden mb-6 shadow-lg flex-shrink-0" style={{ width: '128px', height: '128px', minWidth: '128px', minHeight: '128px' }}>
                <img src={data.profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-xl mb-6 flex items-center justify-center text-5xl font-black flex-shrink-0" style={{ width: '128px', height: '128px', minWidth: '128px', minHeight: '128px', background: 'var(--cv-bg)' }}>
                <span style={{ color: 'var(--cv-on-bg)' }}>{(data.profile?.fullName || 'A')[0]}</span>
              </div>
            )}
            <h1 className="text-[22px] font-black uppercase leading-tight text-white w-full break-words">{data.profile?.fullName || 'Your Name'}</h1>
            {data.profile?.jobTitle && <p className="text-[12px] uppercase tracking-widest mt-2 font-bold" style={{ color: 'var(--cv-light)' }}>{data.profile.jobTitle}</p>}
          </div>

          <div className="p-10 space-y-8 flex-1">
            {/* DIGANTI KE KAMUS DINAMIS */}
            <SideSection label={t.contact || 'Contact'} light className="break-inside-avoid">
              <div className="space-y-2 text-[12px] font-medium text-zinc-300">
                {data.profile?.phone && <p>{data.profile.phone}</p>}
                <p className="break-all">{data.profile?.email || data.email}</p>
                {data.profile?.linkedin && <p className="break-all">{data.profile.linkedin}</p>}
              </div>
            </SideSection>

            <SideSection label={t.skillTitle} light>
              <div className="space-y-4">
                {skills.length ? skills.map((s: any) => (
                  <div key={s.id} className="break-inside-avoid">
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-bold text-white">{s.name}</span>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold">{s.level || 'Mid'}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ background: 'var(--cv-light)', width: s.level === 'Expert' ? '95%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' }} />
                    </div>
                  </div>
                )) : <p className="text-[12px] text-zinc-500 italic">–</p>}
              </div>
            </SideSection>

            <SideSection label={t.eduTitle} light>
              <div className="space-y-4">
                {edus.length ? edus.map((e: any) => (
                  <div key={e.id} className="break-inside-avoid">
                    <p className="text-[13px] font-bold text-white mb-0.5">{e.institution}</p>
                    <p className="text-[11px] text-zinc-400 font-medium">{e.degree} {e.major}</p>
                    <p className="text-[10px] font-bold text-zinc-500 mt-1">{e.endDate ? yr(e.endDate) : t.now}</p>
                  </div>
                )) : <p className="text-[12px] text-zinc-500 italic">–</p>}
              </div>
            </SideSection>
          </div>
        </div>

        <div className="flex-1 p-10 space-y-8">
          {data.profile?.summary && (
            <section className="break-inside-avoid">
              {/* DIGANTI KE KAMUS DINAMIS */}
              <ExecSectionTitle color="var(--cv-primary)">{t.aboutMe || 'Profile'}</ExecSectionTitle>
              <p className="text-[13px] text-zinc-600 leading-relaxed text-justify">{data.profile.summary}</p>
            </section>
          )}
          <section>
            <ExecSectionTitle color="var(--cv-primary)">{t.expTitle}</ExecSectionTitle>
            <div className="space-y-6">
              {exps.length ? exps.map((e: any) => (
                <div key={e.id} className="relative pl-5 break-inside-avoid" style={{ borderLeft: '3px solid var(--cv-light)' }}>
                  <div className="absolute -left-[7px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--cv-primary)' }} />
                  <div className="flex justify-between items-baseline gap-2 mb-0.5">
                    <span className="font-black text-[16px] text-zinc-900">{e.position}</span>
                    <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">{yr(e.startDate)} – {e.endDate ? yr(e.endDate) : t.now}</span>
                  </div>
                  <p className="text-[13px] font-bold mb-2" style={{ color: 'var(--cv-primary)' }}>{e.company}</p>
                  <RenderDescription text={e.description} className="text-[12px] text-zinc-600 leading-relaxed text-justify" />
                </div>
              )) : <EmptyNote />}
            </div>
          </section>
        </div>
      </div>
    );
  }
);
ExecutiveTemplate.displayName = 'ExecutiveTemplate';

// ─── 5. CREATIVE ─────────────────────────────────────────────────────────────
export const CreativeTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ data, shades, fontFamily, t }, ref) => {
    const cssVars = buildCssVars(shades, fontFamily);
    const exps  = arr(data.experiences);
    const edus  = arr(data.educations);
    const skills = arr(data.skills);

    return (
      <div ref={ref} className={`${A4} relative`} style={cssVars}>
        <div className="relative overflow-hidden break-inside-avoid" style={{ height: '145px', background: 'var(--cv-bg)' }}>
          <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)', background: 'var(--cv-bg)' }} />
          <div className="relative z-10 px-12 pt-8 flex justify-between items-start">
            <div className="pr-4">
              <h1 className="text-[34px] font-black uppercase leading-[1.1]" style={{ color: 'var(--cv-on-bg)' }}>
                {data.profile?.fullName || 'Your Name'}
              </h1>
              {data.profile?.jobTitle && (
                <p className="text-[13px] uppercase tracking-[0.2em] mt-1.5 font-bold" style={{ color: 'var(--cv-on-bg)', opacity: 0.8 }}>
                  {data.profile.jobTitle}
                </p>
              )}
            </div>
            {data.profile?.photoUrl && (
              <div className="flex-shrink-0 transform rotate-3 rounded-xl overflow-hidden shadow-lg" style={{ width: '100px', height: '100px', minWidth: '100px', minHeight: '100px', border: '3px solid rgba(255,255,255,0.3)', marginTop: '4px' }}>
                <img src={data.profile.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="px-12 pb-5 pt-2 flex flex-wrap gap-x-6 gap-y-1 text-[12px] font-bold text-zinc-500 break-inside-avoid">
          {data.profile?.phone && <span>{data.profile.phone}</span>}
          <span>{data.profile?.email || data.email}</span>
          {data.profile?.linkedin && <span>{data.profile.linkedin}</span>}
        </div>

        <div className="px-12 pb-12 grid grid-cols-5 gap-10">
          <div className="col-span-3 space-y-8">
            {data.profile?.summary && (
              <section className="break-inside-avoid">
                {/* DIGANTI KE KAMUS DINAMIS */}
                <CreativeSectionTitle color="var(--cv-primary)">{t.aboutMe || 'Profile'}</CreativeSectionTitle>
                <p className="text-[13px] text-zinc-600 leading-relaxed text-justify">{data.profile.summary}</p>
              </section>
            )}
            <section>
              <CreativeSectionTitle color="var(--cv-primary)">{t.expTitle}</CreativeSectionTitle>
              <div className="space-y-6">
                {exps.length ? exps.map((e: any) => (
                  <div key={e.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <span className="font-black text-[16px] text-zinc-900">{e.position}</span>
                      <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">{yr(e.startDate)} – {e.endDate ? yr(e.endDate) : t.now}</span>
                    </div>
                    <p className="text-[13px] font-bold mb-1.5" style={{ color: 'var(--cv-primary)' }}>{e.company}</p>
                    <RenderDescription text={e.description} className="text-[12px] text-zinc-600 leading-relaxed" />
                  </div>
                )) : <EmptyNote />}
              </div>
            </section>
          </div>

          <div className="col-span-2 space-y-8">
            <section>
              <CreativeSectionTitle color="var(--cv-primary)">{t.skillTitle}</CreativeSectionTitle>
              <div className="space-y-3">
                {skills.length ? skills.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3 break-inside-avoid">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--cv-primary)' }} />
                    <div>
                      <span className="text-[14px] font-bold text-zinc-800 block">{s.name}</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{s.level || 'Intermediate'}</span>
                    </div>
                  </div>
                )) : <EmptyNote />}
              </div>
            </section>
            <section>
              <CreativeSectionTitle color="var(--cv-primary)">{t.eduTitle}</CreativeSectionTitle>
              <div className="space-y-4">
                {edus.length ? edus.map((e: any) => (
                  <div key={e.id} className="break-inside-avoid">
                    <p className="font-bold text-[15px] text-zinc-900 mb-0.5">{e.institution}</p>
                    <p className="text-[12px] text-zinc-500 font-medium">{e.degree} {e.major}</p>
                    <p className="text-[11px] font-bold text-zinc-400 mt-1">{e.endDate ? yr(e.endDate) : t.now}</p>
                  </div>
                )) : <EmptyNote />}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
);
CreativeTemplate.displayName = 'CreativeTemplate';

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionTitle({ color, border, children }: { color: string; border?: string; children: React.ReactNode }) {
  return <h2 className="text-[15px] font-black uppercase tracking-widest mb-4 pb-1.5 break-inside-avoid" style={{ color, borderBottom: `3px solid ${border || color}` }}>{children}</h2>;
}
function MainSectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return <h2 className="text-[15px] font-black uppercase tracking-widest mb-3 pb-1.5 border-b-2 border-zinc-200 break-inside-avoid" style={{ color }}>{children}</h2>;
}
function ExecSectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return <h2 className="text-[15px] font-black uppercase tracking-widest mb-4 flex items-center gap-3 break-inside-avoid" style={{ color }}><span className="inline-block w-5 h-1" style={{ background: color }} />{children}</h2>;
}
function CreativeSectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return <h2 className="text-[15px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 break-inside-avoid" style={{ color }}><span className="inline-block w-4 h-4 rounded-sm" style={{ background: color, opacity: 0.3 }} />{children}</h2>;
}
function SideSection({ label, children, light, className }: { label: string; children: React.ReactNode; light?: boolean, className?: string }) {
  return <div className={className}><p className={`text-[12px] font-black uppercase tracking-widest mb-3 ${light ? 'text-zinc-400' : 'text-white/50'}`}>{label}</p>{children}</div>;
}
function EmptyNote() {
  return <p className="text-[12px] text-zinc-400 italic">Belum ada data ditambahkan.</p>;
}

// ─── Smart Description Renderer (New!) ─────────────────────────────────────────
function RenderDescription({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  if (!text) return null;
  
  const lines = text.split('\n').filter(line => line.trim() !== '');

  if (lines.length === 1 && !lines[0].trim().match(/^[-*•]/)) {
    return <p className={className} style={style}>{text}</p>;
  }

  return (
    <div className={className} style={style}>
      <ul className="list-disc list-outside ml-3.5 space-y-1">
        {lines.map((line, i) => {
          const cleanLine = line.replace(/^[-*•]\s*/, '').trim();
          if (!cleanLine) return null;
          return <li key={i}>{cleanLine}</li>;
        })}
      </ul>
    </div>
  );
}