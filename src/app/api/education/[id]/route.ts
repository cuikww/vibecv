// src/app/api/education/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Pendidikan berhasil dihapus" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

// FUNGSI UPDATE BARU
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedEdu = await prisma.education.update({
      where: { id },
      data: {
        institution: body.institution,
        degree: body.degree,
        major: body.major,
        startDate: new Date(`${body.startDate}-01`),
        endDate: body.endDate ? new Date(`${body.endDate}-01`) : null,
      }
    });

    return NextResponse.json(updatedEdu);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}