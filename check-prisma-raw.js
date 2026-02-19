const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT DATABASE() as db, USER() as user`;
        console.log('Current DB info:', result);

        const tables = await prisma.$queryRaw`SHOW TABLES`;
        console.log('Tables visible to Prisma:', tables);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
