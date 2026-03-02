import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                },
                downloads: {
                    include: {
                        wallpaper: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                affiliateApplication: true,
                affiliateCodes: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // We also need to get CustomOrders separately since it's not directly related to User right now by userId
        // Note: Currently CustomOrder relies on email. Let's fetch CustomOrders for this user's email.
        const customOrders = await prisma.customOrder.findMany({
            where: { email: user.email },
            include: {
                wallpaper: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            user: { ...user, customOrders }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
