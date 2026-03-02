import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = await request.json();

        const updatedMenu = await prisma.navigationMenu.update({
            where: { id },
            data: {
                label: data.label,
                url: data.url,
                alignment: data.alignment,
                isActive: data.isActive,
                fontSize: data.fontSize,
                fontFamily: data.fontFamily,
                color: data.color
            }
        });

        return NextResponse.json(updatedMenu);
    } catch (error) {
        console.error('Failed to update menu:', error);
        return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        await prisma.navigationMenu.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete menu:', error);
        return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 });
    }
}
