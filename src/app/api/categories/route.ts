import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

// POST new category
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const subtitle = formData.get("subtitle") as string;
        const description = formData.get("description") as string;
        const bgColor = formData.get("bgColor") as string;
        const tooltip = formData.get("tooltip") as string;
        const order = parseInt(formData.get("order") as string || "0");
        const textColor = formData.get("textColor") as string;
        const imageFile = formData.get("image") as File | null;
        const bgImageFile = formData.get("bgImage") as File | null;

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        let imageUrl = null;
        let bgImageUrl = null;

        const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
        const bgUploadDir = path.join(uploadDir, "bg");

        // Handle Icon/Image
        if (imageFile && imageFile.name) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) { }

            const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            imageUrl = `/uploads/categories/${fileName}`;
        }

        // Handle Background Image
        if (bgImageFile && bgImageFile.name) {
            const bytes = await bgImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            try {
                await mkdir(bgUploadDir, { recursive: true });
            } catch (err) { }

            const fileName = `${Date.now()}_bg_${bgImageFile.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(bgUploadDir, fileName);
            await writeFile(filePath, buffer);
            bgImageUrl = `/uploads/categories/bg/${fileName}`;
        }

        const newCategory = await prisma.category.create({
            data: {
                name,
                subtitle,
                description,
                bgColor: bgColor || "#D9C4A1",
                bgImageUrl,
                textColor: textColor || "#1e293b",
                imageUrl,
                tooltip,
                order
            }
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
