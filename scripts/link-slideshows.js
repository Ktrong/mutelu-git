const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // สไลด์แรก (order: 1) → เวณุ คเณศ
    await prisma.slideshow.update({
        where: { id: 'cmlizp88900015yjn9j9dozsr' },
        data: { wallpaperId: 'cmlmd3vpd0002csnfnv1ymuhu' }
    });
    console.log('✅ สไลด์ 1 → เวณุ คเณศ');

    // สไลด์ที่สอง (order: 2) → พระลักษมี
    await prisma.slideshow.update({
        where: { id: 'cmlizs98n00035yjn6w6zzbdd' },
        data: { wallpaperId: 'cmlmdr36u0004csnf5tbbnvt1' }
    });
    console.log('✅ สไลด์ 2 → พระลักษมี');

    // ตรวจสอบ
    const slideshows = await prisma.slideshow.findMany({ orderBy: { order: 'asc' } });
    slideshows.forEach(s => {
        console.log(`สไลด์ ${s.order}: ${s.title} → wallpaperId: ${s.wallpaperId}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
