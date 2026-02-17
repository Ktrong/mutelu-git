import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Admin Setup API
 * Allows promoting a user to administrator using a secret key.
 * 
 * Usage: POST /api/admin/setup
 * Body: { email: "user@example.com", setupKey: "YOUR_SECRET_KEY" }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, setupKey } = body;

        const serverKey = process.env.ADMIN_SETUP_KEY;

        if (!serverKey || setupKey !== serverKey) {
            return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
        }

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { isAdmin: true }
        });

        return NextResponse.json({
            message: `User ${email} has been promoted to Administrator successfully.`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            }
        });

    } catch (error) {
        console.error("Admin setup error:", error);
        return NextResponse.json({ error: "Failed to set up admin" }, { status: 500 });
    }
}
