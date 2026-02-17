import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        const md5Password = require('crypto').createHash('md5').update(password).digest('hex');

        if (!user || user.password !== md5Password) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // In a real app, generate a JWT or use a session library
        // For now, returning a success message
        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
}
