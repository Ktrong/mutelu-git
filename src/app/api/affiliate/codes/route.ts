import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const codes = await prisma.affiliateCode.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(codes);
    } catch (error) {
        console.error("Error fetching affiliate codes:", error);
        return NextResponse.json({ error: "Failed to fetch affiliate codes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, code, discountPercent } = body;

        if (!userId || !code) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check uniqueness 
        const existing = await prisma.affiliateCode.findUnique({ where: { code } });
        if (existing) {
            return NextResponse.json({ error: "This code is already taken" }, { status: 400 });
        }

        const newCode = await prisma.affiliateCode.create({
            data: {
                userId,
                code,
                discountPercent: discountPercent ? parseFloat(discountPercent) : 0,
                isActive: true
            }
        });

        return NextResponse.json(newCode, { status: 201 });
    } catch (error) {
        console.error("Error creating affiliate code:", error);
        return NextResponse.json({ error: "Failed to create affiliate code" }, { status: 500 });
    }
}
