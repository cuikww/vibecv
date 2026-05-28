// src/app/api/ai/ats-checker/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { jobDescription, language } = await request.json();
    const targetLanguage = language === 'EN' ? 'English' : 'Bahasa Indonesia';

    // 1. Ambil seluruh data CV user dari database
    const profile = await prisma.profile.findUnique({ where: { userId: dbUser.id } });
    const experiences = await prisma.experience.findMany({ where: { userId: dbUser.id } });
    const educations = await prisma.education.findMany({ where: { userId: dbUser.id } });
    const skills = await prisma.skill.findMany({ where: { userId: dbUser.id } });

    // 2. Format menjadi satu string konteks
    const cvContext = `
      NAMA: ${profile?.fullName || 'Kandidat'}
      RINGKASAN: ${profile?.summary || ''}
      PENGALAMAN: ${experiences.map(e => `${e.position} di ${e.company} (${e.description})`).join(' | ')}
      PENDIDIKAN: ${educations.map(e => `${e.degree} ${e.major} di ${e.institution}`).join(' | ')}
      KEAHLIAN: ${skills.map(s => s.name).join(', ')}
    `;

    // 3. Prompt Super Prompt untuk ATS
    const prompt = `
      Anda adalah HR Manager dan pakar sistem ATS (Applicant Tracking System).
      Tugas Anda adalah membandingkan [DATA CV] milik pelamar dengan [JOB DESCRIPTION].
      Output HANYA boleh dalam format JSON valid tanpa markdown, dengan struktur berikut:
      {
        "score": (angka 0-100 berdasarkan kecocokan),
        "missingKeywords": ["keyword1", "keyword2", "keyword3"],
        "coverLetter": "Teks surat lamaran profesional dalam ${targetLanguage} sepanjang 3 paragraf."
      }

      [DATA CV]:
      ${cvContext}

      [JOB DESCRIPTION]:
      ${jobDescription}

      ATURAN:
      1. Berikan skor yang realistis dan objektif.
      2. 'missingKeywords' adalah maksimal 5 keahlian penting di Job Description yang TIDAK ada di CV.
      3. 'coverLetter' harus menyoroti kekuatan di CV yang relevan dengan Job Description. Jangan gunakan placeholder seperti [Nama Anda], langsung gunakan nama dari CV.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.2 } // Rendah agar JSON konsisten
    });

    let rawText = response.text?.trim() || "{}";
    rawText = rawText.replace(/```json|```/g, "").trim();
    
    const parsedData = JSON.parse(rawText);

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("ATS Checker Error:", error);
    return NextResponse.json({ error: "Gagal menganalisis ATS" }, { status: 500 });
  }
}