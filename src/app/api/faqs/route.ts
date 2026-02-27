import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all FAQs
export async function GET() {
    try {
        const faqs = await prisma.faq.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
    }
}

// POST a new FAQ
export async function POST(req: Request) {
    try {
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

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and Answer are required" }, { status: 400 });
        }

        const newFaq = await prisma.faq.create({
            data: {
                question,
                answer,
                questionColor: questionColor || "#000000",
                answerColor: answerColor || "#4B5563",
                questionSize: questionSize || "lg",
                answerSize: answerSize || "base",
                fontFamily: fontFamily || "sans",
                order: order || 0
            }
        });

        return NextResponse.json(newFaq, { status: 201 });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
    }
}
