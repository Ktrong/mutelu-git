import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET all users (Admin only)
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// POST create new user/admin
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, isAdmin } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const md5Password = crypto.createHash('md5').update(password).digest('hex');

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: md5Password,
                isAdmin: isAdmin || false
            }
        });

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
