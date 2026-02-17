import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const md5Password = require('crypto').createHash('md5').update(password).digest('hex');

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: md5Password,
            }
        });

        return NextResponse.json({ message: "User created successfully", userId: newUser.id }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}
