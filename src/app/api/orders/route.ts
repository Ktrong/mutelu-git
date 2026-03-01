import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            wallpaperId,
            displayedName,
            birthDate,
            dayOfWeek,
            zodiac,
            email,
            discountCode,
            totalAmount,
            affiliateCode
        } = body;

        const order = await prisma.customOrder.create({
            data: {
                wallpaperId,
                displayedName,
                birthDate,
                dayOfWeek,
                zodiac,
                email,
                discountCode,
                affiliateCode: affiliateCode || null,
                totalAmount: parseFloat(totalAmount),
                status: 'PENDING'
            },
            include: {
                wallpaper: true
            }
        });

        // Trigger email notification (don't await to avoid blocking response)
        sendOrderConfirmationEmail(order);

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const orders = await prisma.customOrder.findMany({
            include: {
                wallpaper: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
