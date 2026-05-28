// src/app/api/ai/generate-experience/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export async function POST(request: Request) {
  try {
    // Tangkap variabel language dari frontend
    const { position, company, existingDescription, language } = await request.json();

    // Tentukan bahasa target
    const targetLanguage = language === 'EN' ? 'English' : 'Bahasa Indonesia';

    const prompt = `
      SISTEM: Anda adalah mesin API yang HANYA mengeluarkan teks mentah.
      TUGAS: Tulis bullet points pengalaman kerja profesional.
      
      KONTEKS:
      - Posisi: ${position}
      - Perusahaan: ${company}
      - Teks Dasar User: "${existingDescription || 'Tidak ada'}"
      
      ATURAN KETAT (WAJIB DIPATUHI):
      1. JANGAN memberikan kalimat pembuka atau penutup.
      2. JANGAN menggunakan tanda bintang (*) untuk bullet. GUNAKAN simbol bullet (•).
      3. OUTPUT HARUS dimulai langsung dengan simbol •.
      4. Gunakan ${targetLanguage} formal, pola: Kata Kerja Aktif + Hasil/Dampak.
      5. Maksimal 3 poin.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
      }
    });

    let rawText = response.text || "";
    
    const cleanLines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
      .map(line => line.replace(/^[*|-]\s?/, '• '));

    const finalResult = cleanLines.join('\n');

    return NextResponse.json({ suggestion: finalResult });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Gagal generate deskripsi" }, { status: 500 });
  }
}