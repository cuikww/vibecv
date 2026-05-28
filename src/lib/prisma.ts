import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Mencegah Next.js membuat koneksi database berulang kali saat proses development (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

// Buat connection pool ke Supabase menggunakan URL dari env
const connectionString = process.env.DATABASE_URL;

const pool = globalForPrisma.pgPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== 'production') globalForPrisma.pgPool = pool;

// Jembatan (Adapter) untuk Prisma 7+
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // <--- Ini yang diminta oleh error tersebut
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;