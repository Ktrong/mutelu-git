import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key: 'email_config' },
        });

        if (!setting) {
            return NextResponse.json({
                host: '',
                port: 587,
                user: '',
                password: '',
                fromName: 'Iucrative Admin',
                fromEmail: 'noreply@iucrative.com'
            });
        }

        return NextResponse.json(JSON.parse(setting.value));
    } catch (error) {
        console.error('Failed to get email settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Save as JSON string
        await prisma.siteSetting.upsert({
            where: { key: 'email_config' },
            update: { value: JSON.stringify(body) },
            create: { key: 'email_config', value: JSON.stringify(body) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save email settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
