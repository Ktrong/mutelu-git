import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const rates = await prisma.commissionRate.findMany({
            orderBy: { level: 'asc' }
        });
        return NextResponse.json(rates);
    } catch (error) {
        console.error("Error fetching commission rates:", error);
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { rates } = body; // Expects an array: [{ level: 1, percentage: 10 }, ...]

        if (!Array.isArray(rates)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        // We can just upsert them
        await prisma.$transaction(
            rates.map((rate: any) =>
                prisma.commissionRate.upsert({
                    where: { level: parseInt(rate.level) },
                    update: { percentage: parseFloat(rate.percentage) },
                    create: { level: parseInt(rate.level), percentage: parseFloat(rate.percentage) }
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating commission rates:", error);
        return NextResponse.json({ error: "Failed to update rates" }, { status: 500 });
    }
}
