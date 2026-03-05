import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path, { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const userId = formData.get('userId') as string;

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const phoneNumber = formData.get('phoneNumber') as string;
        const socialLinks = formData.get('socialLinks') as string;
        const address = formData.get('address') as string;
        const idCardNumber = formData.get('idCardNumber') as string;
        const bankName = formData.get('bankName') as string;
        const bankAccountNo = formData.get('bankAccountNo') as string;
        const bankAccountName = formData.get('bankAccountName') as string;
        const referrerCode = formData.get('referrerCode') as string;

        const idCardImage = formData.get('idCardImage') as File;
        const bankPassbookImage = formData.get('bankPassbookImage') as File;

        if (!phoneNumber || !idCardNumber || !bankName || !bankAccountNo || !idCardImage || !bankPassbookImage) {
            return NextResponse.json({ error: 'Missing required fields or files' }, { status: 400 });
        }

        // Check if application already exists
        const existingApp = await prisma.affiliateApplication.findUnique({
            where: { userId }
        });

        if (existingApp) {
            return NextResponse.json({ error: 'Application already exists for this user' }, { status: 400 });
        }

        // Upload files
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'affiliates');
        await mkdir(uploadDir, { recursive: true });

        // Helper to save file
        const saveFile = async (file: File, prefix: string) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const originalName = file.name;
            const ext = path.extname(originalName);
            const fileName = `${prefix}-${userId}-${Date.now()}${ext}`;
            const filePath = join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            return `/uploads/affiliates/${fileName}`;
        };

        const idCardImageUrl = await saveFile(idCardImage, 'idcard');
        const bankPassbookImageUrl = await saveFile(bankPassbookImage, 'bank');

        // Apply Referral Logic if referrerCode exists
        if (referrerCode) {
            const affiliate = await prisma.affiliateCode.findUnique({
                where: { code: referrerCode },
                select: { userId: true }
            });

            if (affiliate && affiliate.userId !== userId) {
                // Check if user is already linked
                const currentUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { referrerId: true }
                });

                if (!currentUser?.referrerId) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: { referrerId: affiliate.userId }
                    });
                }
            }
        }

        // Save to DB
        const application = await prisma.affiliateApplication.create({
            data: {
                userId,
                phoneNumber,
                socialLinks: socialLinks || '',
                address: address || '',
                idCardNumber,
                idCardImageUrl,
                bankName,
                bankAccountNo,
                bankAccountName,
                bankPassbookImageUrl,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, application });

    } catch (error) {
        console.error('Affiliate application error:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}
