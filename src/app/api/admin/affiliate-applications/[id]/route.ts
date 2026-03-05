import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function generateRandomCode(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await req.json();
        const id = params.id;

        if (!status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 });
        }

        // Get the current application to see its user
        const app = await prisma.affiliateApplication.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!app) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const updatedApp = await prisma.affiliateApplication.update({
            where: { id },
            data: { status }
        });

        // If approved, create an affiliate code for the user if they don't have one
        if (status === 'APPROVED' && app.userId) {
            const existingCode = await prisma.affiliateCode.findFirst({
                where: { userId: app.userId }
            });

            if (!existingCode) {
                const newCode = `AF${generateRandomCode(6)}`;
                await prisma.affiliateCode.create({
                    data: {
                        code: newCode,
                        userId: app.userId
                    }
                });
            }
        }

        return NextResponse.json(updatedApp);
    } catch (error) {
        console.error("Failed to update affiliate application", error);
        return NextResponse.json({ error: "Failed to update affiliate application" }, { status: 500 });
    }
}
