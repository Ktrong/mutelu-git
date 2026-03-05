import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = await req.json();

        const channel = await prisma.paymentChannel.update({
            where: { id },
            data: {
                promptPayNo: data.promptPayNo,
                accountName: data.accountName,
                isActive: data.isActive
            }
        });

        return NextResponse.json(channel);
    } catch (error) {
        console.error('Error updating payment channel:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        await prisma.paymentChannel.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting payment channel:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
