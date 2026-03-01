import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: {
                    select: { id: true, name: true, email: true, createdAt: true }
                },
                affiliateCodes: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Commission Balance
        const balance = user.commissionBalance || 0;

        // Total sales mapping (using custom Orders matching the affiliate code)
        const userCodes = user.affiliateCodes.map(c => c.code);
        let totalSales = 0;
        let totalOrders = 0;

        if (userCodes.length > 0) {
            const orders = await prisma.customOrder.findMany({
                where: {
                    affiliateCode: { in: userCodes },
                    status: 'SUCCESS'
                }
            });
            totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            totalOrders = orders.length;
        }

        // Build simple team view (Direct referrals = Level 1)
        // If we want deeper levels, we need a recursive or multi-join query. 
        // For dashboard simplicity, we'll return direct referrals and total count as a start.
        const teamView = {
            level1: user.referrals.length,
            members: user.referrals
        };

        return NextResponse.json({
            balance,
            totalSales,
            totalOrders,
            team: teamView
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}
