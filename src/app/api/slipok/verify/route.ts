import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('files') as File | null;
        const expectedAmountStr = formData.get('expectedAmount') as string;
        const orderId = formData.get('orderId') as string;
        const orderType = formData.get('orderType') as string; // 'Order' or 'CustomOrder'

        if (!file || !expectedAmountStr || !orderId || !orderType) {
            return NextResponse.json(
                { error: 'ข้อมูลไม่ครบถ้วน กรุณาส่งไฟล์, ยอดเงิน, รหัสออเดอร์ให้ครบ', retry: true },
                { status: 400 }
            );
        }

        const expectedAmount = parseFloat(expectedAmountStr);

        // 1. Fetch SlipOK Settings
        const apiKeySetting = await prisma.siteSetting.findUnique({
            where: { key: 'slipok_api_key' },
        });
        const branchIdSetting = await prisma.siteSetting.findUnique({
            where: { key: 'slipok_branch_id' },
        });

        const apiKey = apiKeySetting?.value?.trim();
        const branchId = branchIdSetting?.value?.trim();

        if (!apiKey || !branchId) {
            return NextResponse.json(
                { error: 'ระบบตรวจสอบสลิปยังไม่พร้อมใช้งาน ขาดการตั้งค่า SlipOK' },
                { status: 500 }
            );
        }

        // 2. Fetch Active Payment Channel (Receiver Name)
        const activePaymentChannel = await prisma.paymentChannel.findFirst({
            where: { isActive: true },
        });

        if (!activePaymentChannel) {
            return NextResponse.json(
                { error: 'ไม่พบบัญชีผู้รับเงินที่ใช้งานอยู่ในระบบ' },
                { status: 500 }
            );
        }

        // 3. Send Request to SlipOK via JSON Base64
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64');
        // NOTE: According to SlipOK Image Guides, when sending base64 in JSON body, it generally expects JUST the raw base64 string, NOT the `data:image/jpeg;base64,` preamble.

        const slipOkResponse = await fetch(`https://api.slipok.com/api/line/apikey/${branchId}`, {
            method: 'POST',
            headers: {
                'x-authorization': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                files: base64String,
                log: true,
                amount: expectedAmount
            }),
        });

        const result = await slipOkResponse.json();

        if (!result.success) {
            return NextResponse.json(
                { error: result.message || 'ไม่สามารถตรวจสอบสลิปได้ โปรดลองอีกครั้ง', retry: true },
                { status: 400 }
            );
        }

        const { data } = result;
        const transRef = data.transRef;

        // 4. Validate Amount
        if (data.amount !== expectedAmount) {
            return NextResponse.json(
                { error: `ยอดเงินไม่ถูกต้อง: ยอดในสลิปคือ ฿${data.amount} แต่ระบบต้องการ ฿${expectedAmount}`, retry: true },
                { status: 400 }
            );
        }

        // 5. Validate Receiver Name
        // SlipOK Guide: receiver.displayName or receiver.name may differ slightly.
        const receiverName = data.receiver?.name || '';
        const receiverDisplayName = data.receiver?.displayName || '';

        const expectedNameClean = activePaymentChannel.accountName.toLowerCase().replace(/\s+/g, ' ').trim();
        const slipNameClean = receiverName.toLowerCase().replace(/\s+/g, ' ').trim();
        const slipDisplayNameClean = receiverDisplayName.toLowerCase().replace(/\s+/g, ' ').trim();

        const isNameMatch = slipNameClean.includes(expectedNameClean) || slipDisplayNameClean.includes(expectedNameClean);
        const isExpectedIncludedInSlip = slipNameClean.includes(expectedNameClean.split(' ')[0]) || slipDisplayNameClean.includes(expectedNameClean.split(' ')[0]);

        if (!isNameMatch && !isExpectedIncludedInSlip) {
            console.warn(`Name mismatch: Expected '${expectedNameClean}', got Name: '${slipNameClean}', DisplayName: '${slipDisplayNameClean}'`);
            // We will be slightly lenient: if at least the first name matches, we can allow it, otherwise reject.
            return NextResponse.json(
                { error: `ชื่อบัญชีผู้รับไม่ถูกต้อง (ได้รับ: ${receiverDisplayName || receiverName})`, retry: true },
                { status: 400 }
            );
        }

        // 6. Check Duplicate transRef in DB
        const existingOrderRef = await prisma.order.findUnique({
            where: { slipokTransRef: transRef }
        });

        const existingCustomOrderRef = await prisma.customOrder.findUnique({
            where: { slipokTransRef: transRef }
        });

        if (existingOrderRef || existingCustomOrderRef) {
            return NextResponse.json(
                { error: 'สลิปนี้ถูกใช้ไปแล้ว (Duplicate Slip Detected)', retry: false },
                { status: 400 }
            );
        }

        // 7. Success! Update the Order in DB
        if (orderType === 'Order') {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'SUCCESS',
                    slipokTransRef: transRef
                }
            });
        } else if (orderType === 'CustomOrder') {
            await prisma.customOrder.update({
                where: { id: orderId },
                data: {
                    status: 'SUCCESS',
                    paymentStatus: 'PAID',
                    slipokTransRef: transRef
                }
            });
        } else {
            return NextResponse.json({ error: 'ประเภทออเดอร์ไม่ถูกต้อง', retry: true }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'บันทึกสำเร็จ' });
    } catch (error: any) {
        console.error('SlipOK API error:', error);
        return NextResponse.json(
            { error: error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบสลิปภายในระบบเซิร์ฟเวอร์' },
            { status: 500 }
        );
    }
}
