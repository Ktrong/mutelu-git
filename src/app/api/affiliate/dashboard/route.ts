import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const yearParam = searchParams.get('year');
        const monthParam = searchParams.get('month');

        let dateFilter: any = {};
        if (yearParam && monthParam) {
            const startDate = new Date(parseInt(yearParam), parseInt(monthParam) - 1, 1);
            const endDate = new Date(parseInt(yearParam), parseInt(monthParam), 1);
            dateFilter = {
                createdAt: {
                    gte: startDate,
                    lt: endDate
                }
            };
        } else if (yearParam) {
            const startDate = new Date(parseInt(yearParam), 0, 1);
            const endDate = new Date(parseInt(yearParam) + 1, 0, 1);
            dateFilter = {
                createdAt: {
                    gte: startDate,
                    lt: endDate
                }
            };
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                        affiliateCodes: { select: { code: true } }
                    }
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
                    status: 'SUCCESS',
                    ...dateFilter
                }
            });
            totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            totalOrders = orders.length;
        }

        // Build simple team view (Direct referrals = Level 1)
        const allReferralCodes = user.referrals.flatMap(r => r.affiliateCodes.map(c => c.code));
        let referralSalesMap = {} as Record<string, number>;
        if (allReferralCodes.length > 0) {
            const refOrders = await prisma.customOrder.findMany({
                where: {
                    affiliateCode: { in: allReferralCodes },
                    status: 'SUCCESS',
                    ...dateFilter
                },
                select: {
                    affiliateCode: true,
                    totalAmount: true
                }
            });
            for (const order of refOrders) {
                if (order.affiliateCode) {
                    referralSalesMap[order.affiliateCode] = (referralSalesMap[order.affiliateCode] || 0) + order.totalAmount;
                }
            }
        }

        const membersWithSales = user.referrals.map(member => {
            let sales = 0;
            member.affiliateCodes.forEach(c => {
                sales += referralSalesMap[c.code] || 0;
            });
            return {
                id: member.id,
                name: member.name,
                email: member.email,
                createdAt: member.createdAt,
                totalSales: sales
            };
        });

        const teamView = {
            level1: user.referrals.length,
            members: membersWithSales
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
