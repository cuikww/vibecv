// src/app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { profile: true },
    });

    return NextResponse.json(dbUser?.profile || { language: 'ID', isPublic: false });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    
    // PERBAIKAN: Tangkap email dan photoUrl
    const { fullName, email, phone, photoUrl, linkedin, portfolio, summary, language, slug, isPublic } = body;

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: { fullName, email, phone, photoUrl, linkedin, portfolio, summary, language, slug, isPublic },
      create: {
        userId: dbUser.id,
        fullName, email, phone, photoUrl, linkedin, portfolio, summary, language, slug, isPublic
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'URL (Slug) sudah digunakan orang lain' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}