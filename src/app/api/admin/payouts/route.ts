import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const payouts = await prisma.payoutRequest.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(payouts);
    } catch (error) {
        console.error("Error fetching payouts:", error);
        return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body; // PENDING, APPROVED, REJECTED

        if (!id || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const payout = await prisma.payoutRequest.findUnique({ where: { id } });
        if (!payout) {
            return NextResponse.json({ error: "Payout not found" }, { status: 404 });
        }

        if (payout.status !== 'PENDING') {
            return NextResponse.json({ error: "Payout already processed" }, { status: 400 });
        }

        // We use a transaction if rejected to refund the user balance
        if (status === 'REJECTED') {
            await prisma.$transaction([
                prisma.payoutRequest.update({
                    where: { id },
                    data: { status }
                }),
                prisma.user.update({
                    where: { id: payout.userId },
                    data: { commissionBalance: { increment: payout.amount } }
                })
            ]);
        } else {
            // If approved, just update the status 
            // (real money is paid outside manually by admin transferring via PromptPay/Bank)
            await prisma.payoutRequest.update({
                where: { id },
                data: { status }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating payout status:", error);
        return NextResponse.json({ error: "Failed to update payout" }, { status: 500 });
    }
}
