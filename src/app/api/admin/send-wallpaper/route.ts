import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { orderId, downloadUrl } = await req.json();

        if (!orderId || !downloadUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get the order to find the customer's email and name
        const order = await prisma.customOrder.findUnique({
            where: { id: orderId },
            include: { wallpaper: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (!order.email) {
            return NextResponse.json({ error: 'Customer email not provided for this order' }, { status: 400 });
        }

        // Get email settings
        const setting = await prisma.siteSetting.findUnique({
            where: { key: 'email_config' },
        });

        if (!setting) {
            return NextResponse.json({ error: 'Email SMTP settings are not configured. Please configure them in the Admin Console.' }, { status: 500 });
        }

        const config = JSON.parse(setting.value);

        if (!config.host || !config.user || !config.password) {
            return NextResponse.json({ error: 'Incomplete SMTP settings' }, { status: 500 });
        }

        // Setup Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.port === 465, // true for port 465, false for other ports
            auth: {
                user: config.user,
                pass: config.password,
            },
        });

        const mailOptions = {
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to: order.email,
            subject: `วอลเปเปอร์มงคลของคุณพร้อมแล้ว - Iucrative`,
            html: `
                <div style="font-family: sans-serif; max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg">
                    <h2 style="color: #333;">คุณ ${order.displayedName},</h2>
                    <p style="color: #555; line-height: 1.5;">ขอบคุณที่ใช้บริการสั่งทำวอลเปเปอร์มงคล (${order.wallpaper?.title || 'Custom Wallpaper'}) กับทาง Iucrative วอลเปเปอร์ของคุณออกแบบเสร็จเรียบร้อยแล้ว!</p>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${downloadUrl}" style="background-color: #D9C4A1; color: #111; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            คลิกที่นี่เพื่อดาวน์โหลดวอลเปเปอร์
                        </a>
                    </div>
                    
                    <p style="color: #777; font-size: 14px;">หากลลิงก์มีปัญหาหรือต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อเราได้ทันที</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px;">ขอแสดงความนับถือ,<br />ทีมงาน Iucrative</p>
                </div>
            `,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error: any) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }
}
