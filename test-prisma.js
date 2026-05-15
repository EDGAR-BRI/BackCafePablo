import { PrismaClient } from '@prisma/client';

console.log('Imported PrismaClient:', PrismaClient);

try {
    const prisma = new PrismaClient();
    console.log('Successfully instantiated PrismaClient');
    await prisma.$disconnect();
} catch (error) {
    console.error('Error instantiating PrismaClient:', error);
}
