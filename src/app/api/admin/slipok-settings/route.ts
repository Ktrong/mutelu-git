import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const apiKeySetting = await prisma.siteSetting.findUnique({
            where: { key: 'slipok_api_key' },
        });
        const branchIdSetting = await prisma.siteSetting.findUnique({
            where: { key: 'slipok_branch_id' },
        });

        return NextResponse.json({
            apiKey: apiKeySetting?.value || '',
            branchId: branchIdSetting?.value || '',
        });
    } catch (error) {
        console.error('Error fetching SlipOK settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { apiKey, branchId } = await req.json();

        // Upsert API Key
        await prisma.siteSetting.upsert({
            where: { key: 'slipok_api_key' },
            update: { value: apiKey },
            create: { key: 'slipok_api_key', value: apiKey },
        });

        // Upsert Branch ID
        await prisma.siteSetting.upsert({
            where: { key: 'slipok_branch_id' },
            update: { value: branchId },
            create: { key: 'slipok_branch_id', value: branchId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating SlipOK settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
