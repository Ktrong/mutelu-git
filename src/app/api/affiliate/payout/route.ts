import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payouts = await prisma.payoutRequest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(payouts);
    } catch (error) {
        console.error("Error fetching payouts:", error);
        return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, amount } = body;

        if (!userId || !amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // Verify balance 
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { commissionBalance: true }
        });

        if (!user || user.commissionBalance < amount) {
            return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // We use a transaction to deduct balance immediately to prevent double spends,
        // IF rejected, we'll refund it in the admin payout update route.
        const [payout, updatedUser] = await prisma.$transaction([
            prisma.payoutRequest.create({
                data: {
                    userId,
                    amount: parseFloat(amount),
                    status: 'PENDING'
                }
            }),
            prisma.user.update({
                where: { id: userId },
                data: { commissionBalance: { decrement: parseFloat(amount) } }
            })
        ]);

        return NextResponse.json(payout, { status: 201 });
    } catch (error) {
        console.error("Error requesting payout:", error);
        return NextResponse.json({ error: "Failed to request payout" }, { status: 500 });
    }
}
