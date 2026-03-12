import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const wallpapers = await prisma.wallpaper.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(wallpapers, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
