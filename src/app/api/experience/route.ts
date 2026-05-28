import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// --- AMBIL DATA ---
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Sesi habis, silakan login ulang' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });

    if (!dbUser) {
      return NextResponse.json({ error: 'User belum terdaftar di database' }, { status: 401 });
    }

    const experiences = await prisma.experience.findMany({
      where: { userId: dbUser.id },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// --- SIMPAN DATA (MENYELESAIKAN ERROR 405) ---
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const body = await request.json();
    
    const newExp = await prisma.experience.create({
      data: {
        userId: dbUser.id,
        company: body.company,
        position: body.position,
        startDate: new Date(`${body.startDate}-01`),
        endDate: body.endDate ? new Date(`${body.endDate}-01`) : null,
        description: body.description,
      },
    });

    return NextResponse.json(newExp);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}