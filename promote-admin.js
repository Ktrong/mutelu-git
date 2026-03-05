const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } });
    if (!user) {
        console.log('User admin@admin.com not found. Creating...');
        const crypto = require('crypto');
        const hashedPassword = crypto.createHash('md5').update('admin123').digest('hex');
        await prisma.user.create({
            data: {
                email: 'admin@admin.com',
                name: 'Admin',
                password: hashedPassword,
                isAdmin: true,
            }
        });
        console.log('Admin user created with admin@admin.com / admin123');
    } else {
        await prisma.user.update({
            where: { email: 'admin@admin.com' },
            data: { isAdmin: true }
        });
        console.log('User admin@admin.com promoted to admin!');
    }
    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
