import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch only active payment channels
        const channels = await prisma.paymentChannel.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(channels);
    } catch (error) {
        console.error('Error fetching active payment channels:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
