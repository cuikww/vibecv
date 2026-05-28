// src/app/api/public/[slug]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // GANTI findUnique menjadi findFirst
    const profile = await prisma.profile.findFirst({
      where: { 
        slug: slug, 
        isPublic: true 
      },
      include: {
        user: {
          include: {
            experiences: { orderBy: { startDate: 'desc' } },
            educations: { orderBy: { startDate: 'desc' } },
            skills: true
          }
        }
      }
    });

    if (!profile) return NextResponse.json({ error: 'Portfolio not found or private' }, { status: 404 });

    // Format data agar sesuai dengan yang dibutuhkan ModernTemplate
    const data = {
      profile: profile,
      email: profile.user.email,
      experiences: profile.user.experiences,
      educations: profile.user.educations,
      skills: profile.user.skills
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}