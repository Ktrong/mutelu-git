import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) return null;
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export async function sendOrderConfirmationEmail(order: any) {
    const client = getResendClient();
    if (!client) {
        console.warn("RESEND_API_KEY is not set. Skipping email.");
        return;
    }

    try {
        const { data, error } = await client.emails.send({
            from: 'Iucrative <onboarding@resend.dev>', // Change to your verified domain in production
            to: [order.email],
            subject: 'ยืนยันความต้องการวอลเปเปอร์สายมู - Iucrative',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                    <h1 style="color: #D1A7FF; text-align: center;">ขอบคุณที่ร่วมเป็นส่วนหนึ่งของ Iucrative!</h1>
                    <p>สวัสดีครับคุณลูกค้า,</p>
                    <p>เราได้รับคำสั่งซื้อวอลเปเปอร์สายมูของคุณเรียบร้อยแล้ว รายละเอียดมีดังนี้:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 15px; margin: 20px 0;">
                        <p><strong>ชื่อในวอลเปเปอร์:</strong> ${order.displayedName}</p>
                        <p><strong>วอลเปเปอร์:</strong> ${order.wallpaper?.title || 'รายการที่เลือก'}</p>
                        <p><strong>ราศี:</strong> ${order.zodiac}</p>
                        <p><strong>จำนวนเงิน:</strong> ${order.totalAmount} บาท</p>
                        <p><strong>สถานะการชำระเงิน:</strong> ${order.paymentStatus}</p>
                    </div>
                    <p>ทีมงานจะดำเนินการจัดทำวอลเปเปอร์ให้คุณโดยเร็วที่สุด และจะส่งไฟล์งานผ่านทางอีเมลเครื่องนี้ครับ</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="text-align: center; color: #888; font-size: 12px;">Iucrative - มูสเตลูในสไตล์ที่ใช่ สำหรับอนาคตที่ชอบ</p>
                </div>
            `,
        });

        if (error) {
            console.error("Error sending email:", error);
        }
        return data;
    } catch (err) {
        console.error("Failed to send email:", err);
    }
}
