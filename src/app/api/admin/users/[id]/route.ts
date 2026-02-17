import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// PUT update user (Admin only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { name, email, password, isAdmin } = body;

        const data: any = {
            name,
            email,
            isAdmin
        };

        if (password) {
            data.password = crypto.createHash('md5').update(password).digest('hex');
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

// DELETE user (Admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.user.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
