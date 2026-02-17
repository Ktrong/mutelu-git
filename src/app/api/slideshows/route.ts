import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// GET all slideshows
export async function GET(req: Request) {
    try {
        const slideshows = await prisma.slideshow.findMany({
            include: { wallpaper: true },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(slideshows);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST a new slideshow
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const bgColor = formData.get('bgColor') as string;
        const buttonText = formData.get('buttonText') as string;
        const wallpaperId = formData.get('wallpaperId') as string;
        const imageFile = formData.get('image') as File | null;
        const order = parseInt(formData.get('order') as string || '0');

        let imageUrl = null;

        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads', 'slideshows');
            await mkdir(uploadDir, { recursive: true });

            const filename = `${Date.now()}_${imageFile.name}`;
            const path = join(uploadDir, filename);

            await writeFile(path, buffer);
            imageUrl = `/uploads/slideshows/${filename}`;
        }

        const slideshow = await prisma.slideshow.create({
            data: {
                title,
                subtitle,
                bgColor,
                buttonText,
                imageUrl,
                wallpaperId: wallpaperId || null,
                order
            }
        });

        return NextResponse.json(slideshow);
    } catch (error) {
        console.error("Error creating slideshow:", error);
        return NextResponse.json({ error: "Failed to create slideshow" }, { status: 500 });
    }
}
