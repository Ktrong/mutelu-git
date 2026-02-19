import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET wallpapers with their offerings
export async function GET(req: Request) {
    try {
        const wallpapers = await prisma.wallpaper.findMany({
            where: { isOffering: false },
            include: {
                category: true,
                offerings: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(wallpapers);
    } catch (error) {
        console.error("Error fetching wallpapers with offerings:", error);
        return NextResponse.json({ error: "Failed to fetch wallpapers" }, { status: 500 });
    }
}
