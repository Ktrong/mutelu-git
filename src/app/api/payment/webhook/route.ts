import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const event = await req.json();

        // 1. Verify event type
        if (event.key === 'charge.complete') {
            const charge = event.data;
            const paymentId = charge.id;

            // 2. Find order by paymentId
            const order = await prisma.customOrder.findUnique({
                where: { paymentId: paymentId },
                include: { wallpaper: true }
            });

            if (order) {
                const status = charge.status === 'successful' ? 'SUCCESS' : 'FAILED';
                const paymentStatus = charge.status === 'successful' ? 'PAID' : 'FAILED';

                // 3. Update order
                const updatedOrder = await prisma.customOrder.update({
                    where: { id: order.id },
                    data: {
                        status: status,
                        paymentStatus: paymentStatus
                    },
                    include: { wallpaper: true }
                });

                // 4. If successful, send confirmation/download email
                if (status === 'SUCCESS') {
                    await sendOrderConfirmationEmail(updatedOrder);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Omise Webhook Error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}
