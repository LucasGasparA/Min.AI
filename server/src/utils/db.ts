import { PrismaClient } from '@prisma/client';
import { mockPrisma } from './mockDb.js';

const isMock = !process.env.DATABASE_URL || process.env.DATABASE_URL === 'mock';

if (isMock) {
  console.log('⚠️  DATABASE_URL não configurada — usando banco de dados em memória (dados reiniciam com o servidor)');
}

const globalForPrisma = global as unknown as { prisma: any };

export const prisma: any =
  isMock
    ? mockPrisma
    : (globalForPrisma.prisma || new PrismaClient({ log: [] }));

if (!isMock && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
