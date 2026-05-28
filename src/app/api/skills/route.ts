// src/app/api/skills/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  const skills = await prisma.skill.findMany({
    where: { userId: dbUser?.id },
  });
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const dbUser = await prisma.user.findUnique({ where: { email: user?.email! } });
  
  // TANGKAP LEVEL DARI FRONTEND
  const { name, level } = await request.json(); 
  
  const newSkill = await prisma.skill.create({
    data: { 
      userId: dbUser!.id, 
      name,
      level: level || "Intermediate" // Simpan ke database
    }
  });
  
  return NextResponse.json(newSkill);
}