// src/app/api/ai/extract-linkedin/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // 1. Ubah file PDF menjadi Buffer -> Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');

    // 2. Siapkan instruksi sangat ketat untuk Gemini
    const prompt = `
      Anda adalah ekstraktor data profesional. 
      Tugas Anda adalah membaca dokumen PDF profil LinkedIn yang dilampirkan ini dan mengekstrak data pekerjaan, pendidikan, dan keahlian.
      
      OUTPUT HARUS 100% JSON VALID DENGAN STRUKTUR BERIKUT:
      {
        "experiences": [
          { "company": "Nama Perusahaan", "position": "Jabatan", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "description": "Deskripsi singkat" }
        ],
        "educations": [
          { "institution": "Nama Kampus", "degree": "Gelar (misal: S1/D3)", "major": "Jurusan", "startDate": "YYYY-MM", "endDate": "YYYY-MM" }
        ],
        "skills": ["Skill 1", "Skill 2"]
      }

      ATURAN KETAT:
      1. Jika tanggal berakhir adalah "Present" atau "Saat ini", set "endDate" menjadi null.
      2. Gunakan format YYYY-MM untuk semua tanggal (Contoh: "2024-05"). Jika bulan tidak diketahui, gunakan "YYYY-01".
      3. DILARANG KERAS memberikan teks selain JSON. Jangan gunakan markdown (\`\`\`json).
    `;

    // 3. Kirim ke Gemini 2.5 Flash (Support Multimodal PDF)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { data: base64Data, mimeType: 'application/pdf' } },
          { text: prompt }
        ]
      }],
      config: { temperature: 0.1 } // Suhu rendah agar format JSON konsisten
    });

    let rawText = response.text?.trim() || "{}";
    rawText = rawText.replace(/```json|```/g, "").trim(); // Bersihkan jika Gemini membandel pakai markdown
    
    const parsedData = JSON.parse(rawText);

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("PDF Extraction Error:", error);
    return NextResponse.json({ error: "Gagal mengekstrak PDF" }, { status: 500 });
  }
}