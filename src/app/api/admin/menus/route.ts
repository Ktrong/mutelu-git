import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const menus = await prisma.navigationMenu.findMany({
            orderBy: {
                position: 'asc'
            }
        });

        return NextResponse.json(menus);
    } catch (error) {
        console.error('Failed to fetch menus:', error);
        return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Get highest position to append at the end by default
        const lastMenu = await prisma.navigationMenu.findFirst({
            orderBy: { position: 'desc' }
        });

        const nextPosition = lastMenu ? lastMenu.position + 1 : 0;

        const newMenu = await prisma.navigationMenu.create({
            data: {
                label: data.label,
                url: data.url,
                alignment: data.alignment || 'CENTER',
                position: data.position !== undefined ? data.position : nextPosition,
                isActive: data.isActive !== undefined ? data.isActive : true,
                fontSize: data.fontSize || 'sm',
                fontFamily: data.fontFamily || 'sans',
                color: data.color || '#4B5563'
            }
        });

        return NextResponse.json(newMenu, { status: 201 });
    } catch (error) {
        console.error('Failed to create menu:', error);
        return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
    }
}
