import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET a single wallpaper
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const wallpaper = await prisma.wallpaper.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                contents: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!wallpaper) return NextResponse.json({ error: "Wallpaper not found" }, { status: 404 });
        return NextResponse.json(wallpaper);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT (Update) a wallpaper
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let data: any = {};
        let formData: FormData | null = null;

        if (contentType.includes('application/json')) {
            data = await req.json();
            // Remove relation objects if they exist to avoid Prisma errors during simple update
            delete data.category;
            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
        } else {
            // Read formData ONCE — the body stream can only be consumed once
            formData = await req.formData();
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
            const downloadFile = formData.get('downloadFile') as File | null;

            let imageUrl = formData.get('imageUrl') as string;
            let downloadUrl = formData.get('downloadUrl') as string;

            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'wallpapers');
            const downloadDir = path.join(process.cwd(), 'public', 'uploads', 'downloads');
            await mkdir(uploadDir, { recursive: true });
            await mkdir(downloadDir, { recursive: true });

            if (imageFile && imageFile.size > 0) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filename = `${Date.now()}_${imageFile.name}`;
                const pathStr = path.join(uploadDir, filename);
                await writeFile(pathStr, buffer);
                imageUrl = `/uploads/wallpapers/${filename}`;
            }

            if (downloadFile && downloadFile.size > 0) {
                const dBytes = await downloadFile.arrayBuffer();
                const dBuffer = Buffer.from(dBytes);
                const dFilename = `${Date.now()}-hq-${downloadFile.name.replace(/\s+/g, '-')}`;
                const dPath = path.join(downloadDir, dFilename);
                await writeFile(dPath, dBuffer);
                downloadUrl = `/uploads/downloads/${dFilename}`;
            }

            data = {
                title,
                description,
                imageUrl,
                downloadUrl,
                categoryId,
                price,
                blessing,
                deity,
                isPopular,
                isNew,
                isOffering,
                relatedWallpaperId: (isOffering && relatedWallpaperId) ? relatedWallpaperId : null
            };
        }

        const updatedWallpaper = await prisma.wallpaper.update({
            where: { id: params.id },
            data: data
        });

        // Handle Content Blocks for PUT (reuse the same formData from above)
        if (formData) {
            const contentBlocksJson = formData.get('contentBlocks') as string;

            if (contentBlocksJson) {
                try {
                    const blocks = JSON.parse(contentBlocksJson);

                    // Delete existing blocks to replace them
                    await prisma.wallpaperContent.deleteMany({
                        where: { wallpaperId: params.id }
                    });

                    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'wallpapers');
                    await mkdir(uploadDir, { recursive: true });

                    for (let i = 0; i < blocks.length; i++) {
                        const block = blocks[i];
                        const contentImageFile = formData.get(`contentImage_${i}`) as File | null;
                        let contentImageUrl = block.imageUrl; // Use existing URL if no new file

                        if (contentImageFile && contentImageFile.size > 0) {
                            const cBytes = await contentImageFile.arrayBuffer();
                            const cBuffer = Buffer.from(cBytes);
                            const cFilename = `${Date.now()}_block_${i}_${contentImageFile.name.replace(/\s+/g, '-')}`;
                            const cPath = path.join(uploadDir, cFilename);
                            await writeFile(cPath, cBuffer);
                            contentImageUrl = `/uploads/wallpapers/${cFilename}`;
                        }

                        await prisma.wallpaperContent.create({
                            data: {
                                wallpaperId: params.id,
                                imageUrl: contentImageUrl,
                                text: block.text,
                                textColor: block.textColor || '#FFFFFF',
                                textSize: block.textSize || 'base',
                                textPosition: block.textPosition || 'center',
                                fontFamily: block.fontFamily || 'sans',
                                order: i
                            }
                        });
                    }
                } catch (err) {
                    console.error("Error processing content blocks in PUT:", err);
                }
            }
        }

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
