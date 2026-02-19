require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAll() {
    console.log('--- Database Audit ---');
    try {
        const tables = ['user', 'wallpaper', 'category', 'order', 'download', 'article', 'slideshow', 'customOrder'];
        for (const table of tables) {
            const count = await prisma[table].count();
            console.log(`Table ${table.padEnd(15)}: ${count} records`);
        }
    } catch (err) {
        console.error('❌ Audit failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

testAll();
