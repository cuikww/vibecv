// src/app/api/experience/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Pengalaman berhasil dihapus" });
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
    
    const updatedExp = await prisma.experience.update({
      where: { id },
      data: {
        company: body.company,
        position: body.position,
        startDate: new Date(`${body.startDate}-01`),
        endDate: body.endDate ? new Date(`${body.endDate}-01`) : null,
        description: body.description,
      }
    });

    return NextResponse.json(updatedExp);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}