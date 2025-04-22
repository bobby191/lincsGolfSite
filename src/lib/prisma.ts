//\lincs-golf-site\src\lib\prisma.ts
//By Robert Nelson last edit 04/12/25
//About File:

//This pattern ensures that Prisma does not re-instantiate multiple times in 
// development (which can cause “too many Prisma clients” errors).
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Uncomment for debugging
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}