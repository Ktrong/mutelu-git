import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Return only active menus for the public navbar
        const menus = await prisma.navigationMenu.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                position: 'asc'
            }
        });

        return NextResponse.json(menus);
    } catch (error) {
        console.error('Failed to fetch public menus:', error);
        return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
    }
}
