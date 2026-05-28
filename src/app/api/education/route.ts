import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

// Mengambil daftar pendidikan
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const educations = await prisma.education.findMany({
    where: { userId: dbUser.id },
    orderBy: { startDate: 'desc' }, // Yang paling baru di atas
  });

  return NextResponse.json(educations);
}

// Menambahkan pendidikan baru
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await request.json();
  const { institution, degree, major, startDate, endDate, description } = body;

  const newEducation = await prisma.education.create({
    data: {
      userId: dbUser.id,
      institution,
      degree,
      major,
      // Konversi string tanggal YYYY-MM ke format ISO-8601 untuk Prisma
      startDate: new Date(`${startDate}-01`), 
      endDate: endDate ? new Date(`${endDate}-01`) : null,
      description,
    },
  });

  return NextResponse.json({ message: 'Pendidikan berhasil ditambahkan', data: newEducation });
}