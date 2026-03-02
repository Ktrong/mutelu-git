import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
        }

        // Use a transaction to perform all position updates atomically
        const updates = items.map((item: { id: string, position: number }) => {
            return prisma.navigationMenu.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        });

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true, message: 'Menu order updated successfully' });
    } catch (error) {
        console.error('Failed to reorder menus:', error);
        return NextResponse.json({ error: 'Failed to reorder menus' }, { status: 500 });
    }
}
