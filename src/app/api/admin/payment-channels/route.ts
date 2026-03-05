import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const channels = await prisma.paymentChannel.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(channels);
    } catch (error) {
        console.error('Error fetching payment channels:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.promptPayNo || !data.accountName) {
            return NextResponse.json({ error: 'PromptPay Number and Account Name are required' }, { status: 400 });
        }

        const channel = await prisma.paymentChannel.create({
            data: {
                promptPayNo: data.promptPayNo,
                accountName: data.accountName,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });

        return NextResponse.json(channel, { status: 201 });
    } catch (error) {
        console.error('Error creating payment channel:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
