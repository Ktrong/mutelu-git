import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT to update an FAQ
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await req.json();
        const {
            question,
            answer,
            questionColor,
            answerColor,
            questionSize,
            answerSize,
            fontFamily,
            order
        } = body;

        const updatedFaq = await prisma.faq.update({
            where: { id },
            data: {
                question,
                answer,
                questionColor,
                answerColor,
                questionSize,
                answerSize,
                fontFamily,
                order
            }
        });

        return NextResponse.json(updatedFaq);
    } catch (error) {
        console.error("Error updating FAQ:", error);
        return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
    }
}

// DELETE an FAQ
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        await prisma.faq.delete({
            where: { id }
        });
        return NextResponse.json({ message: "FAQ deleted successfully" });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
    }
}
