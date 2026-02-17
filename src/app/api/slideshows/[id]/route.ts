import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// PUT (Update) a slideshow
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const bgColor = formData.get('bgColor') as string;
        const buttonText = formData.get('buttonText') as string;
        const wallpaperId = formData.get('wallpaperId') as string;
        const imageFile = formData.get('image') as File | null;
        const order = parseInt(formData.get('order') as string || '0');
        const isActive = formData.get('isActive') === 'true';

        let imageUrl = formData.get('imageUrl') as string;

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

        const updatedSlideshow = await prisma.slideshow.update({
            where: { id: params.id },
            data: {
                title,
                subtitle,
                bgColor,
                buttonText,
                imageUrl,
                wallpaperId: wallpaperId || null,
                order,
                isActive
            }
        });
        return NextResponse.json(updatedSlideshow);
    } catch (error) {
        console.error("Error updating slideshow:", error);
        return NextResponse.json({ error: "Failed to update slideshow" }, { status: 500 });
    }
}

// DELETE a slideshow
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.slideshow.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ message: "Slideshow deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete slideshow" }, { status: 500 });
    }
}
