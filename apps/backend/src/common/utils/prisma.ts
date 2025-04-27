import {Prisma, PrismaClient} from '@prisma/client';
import {pagination} from 'prisma-extension-pagination';
import prismaRandom from 'prisma-extension-random';

// Initialize Prisma Client and extend it with both extensions
const prisma = new PrismaClient()
    .$extends(pagination()) // Add pagination extension
    .$extends(prismaRandom()); // Add random extension

// Export the extended Prisma client
export type ExtendedPrismaClient = typeof prisma;

export interface TransactionRequest {
    db: Prisma.TransactionClient;
}

export default prisma;