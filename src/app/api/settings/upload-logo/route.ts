import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Generate safe unique filename
        const ext = file.name.split('.').pop() || 'png';
        const uniqueName = `logo_${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, uniqueName);

        await fs.writeFile(filePath, buffer);

        // Return relative path for getImageUrl to pick up
        return NextResponse.json({ url: `/uploads/${uniqueName}` });

    } catch (error) {
        console.error('Error uploading logo:', error);
        return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
    }
}
