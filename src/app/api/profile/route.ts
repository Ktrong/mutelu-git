import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                },
                downloads: {
                    include: {
                        wallpaper: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                affiliateApplication: true,
                affiliateCodes: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // We also need to get CustomOrders separately since it's not directly related to User right now by userId
        // Note: Currently CustomOrder relies on email. Let's fetch CustomOrders for this user's email.
        const customOrders = await prisma.customOrder.findMany({
            where: { email: user.email },
            include: {
                wallpaper: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            user: { ...user, customOrders }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        // Fallback for json body if sent
        let userId, name, phone, address;
        let imageFile: File | null = null;

        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            userId = formData.get("userId") as string;
            name = formData.get("name") as string;
            phone = formData.get("phone") as string;
            address = formData.get("address") as string;
            imageFile = formData.get("image") as File | null;
        } else {
            const body = await request.json();
            userId = body.userId;
            name = body.name;
            phone = body.phone;
            address = body.address;
        }

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        let imageUrl = undefined;

        if (imageFile && imageFile.name && imageFile.name !== "undefined") {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) { }

            const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/profiles/${fileName}`;
        }

        const dataToUpdate: any = {
            name,
            phone,
            address
        };

        if (imageUrl !== undefined) {
            dataToUpdate.image = imageUrl;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
