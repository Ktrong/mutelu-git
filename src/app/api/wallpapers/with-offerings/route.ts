import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET wallpapers with their offerings
export async function GET(req: Request) {
    try {
        // Use raw query to bypass Prisma type errors
        const wallpapers: any[] = await prisma.$queryRaw`
            SELECT * FROM Wallpaper 
            WHERE isOffering = 0 
            ORDER BY createdAt DESC
        `;

        // Fetch offerings for each wallpaper
        const wallpapersWithOfferings = await Promise.all(
            wallpapers.map(async (wp) => {
                const offerings: any[] = await prisma.$queryRaw`
                    SELECT * FROM Wallpaper 
                    WHERE isOffering = 1 
                    AND relatedWallpaperId = ${wp.id}
                `;

                // Fetch category
                const category: any[] = await prisma.$queryRaw`
                    SELECT * FROM Category 
                    WHERE id = ${wp.categoryId}
                    LIMIT 1
                `;

                return {
                    ...wp,
                    category: category[0] || null,
                    offerings
                };
            })
        );

        return NextResponse.json(wallpapersWithOfferings);
    } catch (error) {
        console.error("Error fetching wallpapers with offerings:", error);
        return NextResponse.json({ error: "Failed to fetch wallpapers" }, { status: 500 });
    }
}
