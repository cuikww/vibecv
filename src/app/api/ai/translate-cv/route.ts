// src/app/api/ai/translate-cv/route.ts

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

    const { targetLanguage } = await request.json(); // 'ID' atau 'EN'
    const langString = targetLanguage === 'EN' ? 'English' : 'Bahasa Indonesia';

    // 1. Ambil data saat ini
    const profile = await prisma.profile.findUnique({ where: { userId: dbUser.id } });
    const experiences = await prisma.experience.findMany({ where: { userId: dbUser.id } });
    const educations = await prisma.education.findMany({ where: { userId: dbUser.id } });

    // 2. Siapkan Data JSON untuk AI
    const payload = {
      summary: profile?.summary || "",
      experiences: experiences.map(exp => ({ id: exp.id, position: exp.position, description: exp.description })),
      educations: educations.map(edu => ({ id: edu.id, degree: edu.degree, major: edu.major }))
    };

    const prompt = `
      Translate the following JSON data values into ${langString}.
      DO NOT change the JSON structure, keys, or any 'id' fields. 
      Only translate the text values.
      If it is already in ${langString}, leave it as is.
      
      JSON to translate:
      ${JSON.stringify(payload)}
      
      OUTPUT MUST BE VALID JSON ONLY. No markdown formatting, no explanations.
    `;

    // 3. Proses dengan Gemini
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.1 } // Sangat rendah agar strict format JSON
    });

    let rawText = response.text?.trim() || "{}";
    rawText = rawText.replace(/```json|```/g, "").trim(); // Bersihkan markdown jika ada
    
    const translatedData = JSON.parse(rawText);

    // 4. Update Database secara paralel
    const updatePromises = [];

    if (translatedData.summary && profile) {
      updatePromises.push(prisma.profile.update({
        where: { id: profile.id },
        data: { summary: translatedData.summary }
      }));
    }

    if (translatedData.experiences) {
      translatedData.experiences.forEach((exp: any) => {
        updatePromises.push(prisma.experience.update({
          where: { id: exp.id },
          data: { position: exp.position, description: exp.description }
        }));
      });
    }

    if (translatedData.educations) {
      translatedData.educations.forEach((edu: any) => {
        updatePromises.push(prisma.education.update({
          where: { id: edu.id },
          data: { degree: edu.degree, major: edu.major }
        }));
      });
    }

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: 'CV berhasil diterjemahkan!' });

  } catch (error: any) {
    console.error("Translate Error:", error);
    return NextResponse.json({ error: "Gagal menerjemahkan CV" }, { status: 500 });
  }
}