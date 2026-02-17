import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET all wallpapers
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const isPopular = searchParams.get('isPopular') === 'true';
        const isNew = searchParams.get('isNew') === 'true';
        const isOffering = searchParams.get('isOffering') === 'true';

        let where: any = {};
        if (searchParams.has('isPopular')) where.isPopular = isPopular;
        if (searchParams.has('isNew')) where.isNew = isNew;
        if (searchParams.has('isOffering')) where.isOffering = isOffering;

        const categoryId = searchParams.get('categoryId');
        if (categoryId && categoryId !== 'All' && categoryId !== 'ทั้งหมด') {
            where.categoryId = categoryId;
        }

        const wallpapers = await prisma.wallpaper.findMany({
            where,
            include: {
                category: true
                // relatedWallpaper: true  // Temporarily disabled until Prisma client regenerated
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(wallpapers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch wallpapers" }, { status: 500 });
    }
}

// POST new wallpaper
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const categoryId = formData.get('categoryId') as string;
        const price = parseInt(formData.get('price') as string) || 1;
        const blessing = formData.get('blessing') as string;
        const deity = formData.get('deity') as string;
        const isPopular = formData.get('isPopular') === 'true';
        const isNew = formData.get('isNew') === 'true';
        const isOffering = formData.get('isOffering') === 'true';
        const relatedWallpaperId = formData.get('relatedWallpaperId') as string | null;
        const file = formData.get('image') as File | null;

        if (!title || !categoryId || !file) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'wallpapers');

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/wallpapers/${filename}`;

        const newWallpaper = await prisma.wallpaper.create({
            data: {
                title,
                description,
                imageUrl,
                categoryId,
                price,
                blessing,
                deity,
                isPopular,
                isNew,
                isOffering,
                relatedWallpaperId: isOffering ? relatedWallpaperId : null
            }
        });

        return NextResponse.json(newWallpaper, { status: 201 });
    } catch (error) {
        console.error("Error creating wallpaper:", error);
        return NextResponse.json({ error: "Failed to create wallpaper" }, { status: 500 });
    }
}
