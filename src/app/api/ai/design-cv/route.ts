// src/app/api/ai/design-cv/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mirror of valid values from our API routes
const VALID_COLOR_KEYS = [
  'indigo','blue','sky','emerald','teal','cyan',
  'violet','purple','fuchsia','rose','orange','amber',
  'lime','slate','zinc','brown',
];

const VALID_FONT_FAMILIES = [
  'Plus Jakarta Sans','DM Sans','Outfit','Figtree','Nunito','Sora','Lexend',
  'Lora','Playfair Display','Cormorant Garamond','Libre Baskerville','Crimson Pro',
  'JetBrains Mono','Fira Code','IBM Plex Mono',
  'Bebas Neue',
];

const VALID_LAYOUTS = ['modern','classic','minimalist','executive','creative'];

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const systemInstruction = `
Anda adalah AI UI/UX Designer untuk aplikasi pembuat CV bernama VibeCV.
Pengguna memberi instruksi gaya CV. Balas HANYA dengan JSON murni (tanpa markdown):
{
  "layout": string,
  "colorKey": string,
  "fontFamily": string
}

=== LAYOUT ===
- modern      → 2 kolom. IT, startup, marketing digital, software engineer.
- classic     → Header penuh, 1 kolom. Bank, BUMN, Hukum, Pemerintahan, Akuntansi.
- minimalist  → Sidebar kiri kecil. Desainer, fotografer, arsitek, UX.
- executive   → Sidebar lebar gelap + skill bar. Direktur, manajer senior, konsultan.
- creative    → Header diagonal bold. Desainer grafis, seniman, illustrator, konten kreator.

=== COLOR KEY (pilih satu) ===
indigo, blue, sky, emerald, teal, cyan, violet, purple, fuchsia, rose, orange, amber, lime, slate, zinc, brown

Panduan warna:
- indigo/violet  → teknologi, korporat, profesional modern
- blue/sky       → keuangan, kepercayaan, konservatif modern
- emerald/teal   → kesehatan, lingkungan, inovasi
- cyan           → startup tech, fresh, digital
- purple/fuchsia → premium, luxury, creative high-end
- rose           → seni, fashion, branding kreatif
- orange/amber   → energik, hospitality, kuliner, warm
- lime           → lingkungan, muda, energik positif
- slate/zinc     → formal berat, law, audit, sangat konservatif, monokrom
- brown          → klasik premium, notariat, akademik lama

=== FONT FAMILY (pilih satu, tulis persis) ===
Sans-Serif: "Plus Jakarta Sans", "DM Sans", "Outfit", "Figtree", "Nunito", "Sora", "Lexend"
Serif: "Lora", "Playfair Display", "Cormorant Garamond", "Libre Baskerville", "Crimson Pro"
Monospace: "JetBrains Mono", "Fira Code", "IBM Plex Mono"
Display: "Bebas Neue"

Panduan font:
- Plus Jakarta Sans / DM Sans / Outfit → modern, clean, startup
- Figtree / Lexend / Nunito → friendly, warm, readable
- Sora → minimal tech
- Lora / Playfair Display → elegan, editorial, luxury
- Cormorant Garamond / Crimson Pro → sangat formal, akademis, hukum
- Libre Baskerville → klasik profesional
- JetBrains Mono / Fira Code → developer, hacker, data
- IBM Plex Mono → teknis corporate
- Bebas Neue → bold, kreatif, grafis (hanya untuk creative layout)

Instruksi User: "${prompt}"
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: systemInstruction }] }],
      config: { temperature: 0.3 },
    });

    let raw = response.text?.trim() || '{}';
    raw = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      layout:     VALID_LAYOUTS.includes(parsed.layout)         ? parsed.layout     : 'modern',
      colorKey:   VALID_COLOR_KEYS.includes(parsed.colorKey)    ? parsed.colorKey   : 'indigo',
      fontFamily: VALID_FONT_FAMILIES.includes(parsed.fontFamily) ? parsed.fontFamily : 'Plus Jakarta Sans',
    });

  } catch (err: any) {
    console.error('AI design error:', err);
    return NextResponse.json({ error: 'Gagal mendesain CV' }, { status: 500 });
  }
}