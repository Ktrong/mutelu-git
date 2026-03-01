import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Omise from 'omise';
import { distributeCommission } from '@/lib/affiliate';

const omise = Omise({
    publicKey: process.env.OMISE_PUBLIC_KEY,
    secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(req: Request) {
    try {
        const { orderId, token, source } = await req.json();

        // 1. Get the order
        const order = await prisma.customOrder.findUnique({
            where: { id: orderId },
            include: { wallpaper: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // 2. Create Omise Charge
        // Convert to smallest currency unit (Stang for THB)
        const amountInStang = Math.round(order.totalAmount * 100);

        const charge = await new Promise((resolve, reject) => {
            omise.charges.create({
                amount: amountInStang,
                currency: 'thb',
                card: token, // If credit card
                source: source, // If PromptPay/Internet Banking
            }, (err: any, result: any) => {
                if (err) reject(err);
                else resolve(result);
            });
        }) as any;

        // 3. Update Order with Payment Info
        // Note: For source-based payments (PromptPay), status might be 'pending' 
        // until user scans and pays. We handle webhooks separately.
        const updatedStatus = charge.status === 'successful' ? 'SUCCESS' : 'PENDING';
        const paymentStatus = charge.status === 'successful' ? 'PAID' : 'AWAITING_PAYMENT';

        const updatedOrder = await prisma.customOrder.update({
            where: { id: orderId },
            data: {
                paymentId: charge.id,
                paymentStatus: paymentStatus,
                status: updatedStatus,
                paymentMethod: charge.card ? 'CREDIT_CARD' : (charge.source?.type || 'UNKNOWN')
            }
        });

        if (updatedOrder.status === 'SUCCESS' && updatedOrder.affiliateCode) {
            await distributeCommission(updatedOrder.id, updatedOrder.affiliateCode, updatedOrder.totalAmount);
        }

        return NextResponse.json({
            success: true,
            status: charge.status,
            authorize_uri: charge.authorize_uri, // For 3DS or other redirected payments
            download_uri: charge.source?.scannable_code?.image?.download_uri // For PromptPay QR
        });

    } catch (error: any) {
        console.error("Omise Charge Error:", error);
        return NextResponse.json({ error: error.message || "Payment failed" }, { status: 500 });
    }
}
