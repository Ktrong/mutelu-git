import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const applications = await prisma.affiliateApplication.findMany({
            include: {
                user: {
                    include: {
                        referrer: {
                            include: { affiliateCodes: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: 'Failed to fetch affiliate applications' }, { status: 500 });
    }
}
