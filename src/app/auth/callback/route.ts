import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    // TAMBAHKAN AWAIT DI SINI
    const supabase = await createClient(); 
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const userEmail = data.user.email!;
      const userFullName = data.user.user_metadata?.full_name || 'User';

      await prisma.user.upsert({
        where: { email: userEmail },
        update: {}, 
        create: {
          email: userEmail,
          profile: {
            create: {
              fullName: userFullName,
            },
          },
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=OAuthFailed`);
}