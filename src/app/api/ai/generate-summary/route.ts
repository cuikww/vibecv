// src/app/api/ai/generate-summary/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export async function POST(request: Request) {
  try {
    // 1. Ambil Sesi User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Tangkap Request
    const { fullName, language } = await request.json();
    const targetLanguage = language === 'EN' ? 'English' : 'Bahasa Indonesia';

    // 3. AMBIL SELURUH DATA USER DARI DATABASE (Konteks Nyata)
    const experiences = await prisma.experience.findMany({ where: { userId: dbUser.id }, orderBy: { startDate: 'desc' } });
    const educations = await prisma.education.findMany({ where: { userId: dbUser.id }, orderBy: { startDate: 'desc' } });
    const skillsData = await prisma.skill.findMany({ where: { userId: dbUser.id } });

    // 4. Rangkai Data Menjadi Teks
    const recentJob = experiences.length > 0 ? experiences[0].position : 'Profesional';
    const expList = experiences.map(exp => `${exp.position} di ${exp.company}`).join(', ');
    const eduList = educations.map(edu => `${edu.degree} ${edu.major} dari ${edu.institution}`).join(', ');
    const skillList = skillsData.map(s => s.name).join(', ');

    // 5. Buat Prompt Super Personal
    const prompt = `
      Bertindaklah sebagai penulis CV profesional tingkat eksekutif.
      Tugasmu adalah membuat "Professional Summary" yang memukau dalam ${targetLanguage}.
      
      KONTEKS KANDIDAT (Data Asli):
      - Nama: ${fullName || 'Kandidat'}
      - Posisi Saat Ini/Terakhir: ${recentJob}
      - Riwayat Pekerjaan: ${expList || 'Belum ada pengalaman kerja'}
      - Latar Belakang Pendidikan: ${eduList || 'Belum ada data pendidikan'}
      - Keahlian Utama: ${skillList || 'Belum ada data keahlian'}
      
      INSTRUKSI:
      1. Tulis dalam 1 paragraf padat (maksimal 3-4 kalimat).
      2. Rangkum pengalaman, pendidikan, dan keahlian di atas menjadi sebuah cerita nilai tambah yang kuat.
      3. Buat nada yang percaya diri namun tetap profesional.
      4. DILARANG memberikan kalimat pengantar atau penutup.
      5. Langsung berikan teks summary-nya.
    `;

    // 6. Generate dengan Gemini
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.5 }
    });

    const summaryText = response.text?.trim() ?? "Gagal menghasilkan ringkasan. Silakan coba lagi.";
    return NextResponse.json({ result: summaryText });
  } catch (error: any) {
    console.error("AI Summary Error:", error);
    return NextResponse.json({ error: "Gagal generate summary" }, { status: 500 });
  }
}