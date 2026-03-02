import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Use a global to prevent multiple Prisma client instances during development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key: "theme" }
        });

        if (!setting) {
            return NextResponse.json({ theme: null });
        }

        return NextResponse.json({ theme: JSON.parse(setting.value) });
    } catch (error) {
        console.error("Error fetching theme:", error);
        return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Validate basic structure or allow anything?
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: "Invalid theme data" }, { status: 400 });
        }

        const setting = await prisma.siteSetting.upsert({
            where: { key: "theme" },
            update: { value: JSON.stringify(body) },
            create: { key: "theme", value: JSON.stringify(body) }
        });

        return NextResponse.json({ success: true, theme: JSON.parse(setting.value) });
    } catch (error) {
        console.error("Error saving theme:", error);
        return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
    }
}
