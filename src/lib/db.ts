import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
<<<<<<< HEAD
    log: ['error'],
=======
    log: ['query'],
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db