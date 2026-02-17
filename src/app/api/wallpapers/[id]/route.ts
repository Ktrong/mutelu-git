import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a single wallpaper
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const wallpaper = await prisma.wallpaper.findUnique({
            where: { id: params.id },
            include: { category: true }
        });
        if (!wallpaper) return NextResponse.json({ error: "Wallpaper not found" }, { status: 404 });
        return NextResponse.json(wallpaper);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// PUT (Update) a wallpaper
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let data: any = {};

        if (contentType.includes('application/json')) {
            data = await req.json();
            // Remove relation objects if they exist to avoid Prisma errors during simple update
            delete data.category;
            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
        } else {
            const formData = await req.formData();
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const categoryId = formData.get('categoryId') as string;
            const price = parseInt(formData.get('price') as string);
            const blessing = formData.get('blessing') as string;
            const deity = formData.get('deity') as string;
            const isPopular = formData.get('isPopular') === 'true';
            const isNew = formData.get('isNew') === 'true';
            const isOffering = formData.get('isOffering') === 'true';
            const relatedWallpaperId = formData.get('relatedWallpaperId') as string | null;
            const imageFile = formData.get('image') as File | null;

            let imageUrl = formData.get('imageUrl') as string;

            if (imageFile) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uploadDir = join(process.cwd(), 'public', 'uploads', 'wallpapers');
                await mkdir(uploadDir, { recursive: true });

                const filename = `${Date.now()}_${imageFile.name}`;
                const path = join(uploadDir, filename);

                await writeFile(path, buffer);
                imageUrl = `/uploads/wallpapers/${filename}`;
            }

            data = {
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
            };
        }

        const updatedWallpaper = await prisma.wallpaper.update({
            where: { id: params.id },
            data: data
        });
        return NextResponse.json(updatedWallpaper);
    } catch (error) {
        console.error("Error updating wallpaper:", error);
        return NextResponse.json({ error: "Failed to update wallpaper" }, { status: 500 });
    }
}

// DELETE a wallpaper
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.wallpaper.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ message: "Wallpaper deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete wallpaper" }, { status: 500 });
    }
}
