import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// PUT update category
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const subtitle = formData.get("subtitle") as string;
        const description = formData.get("description") as string;
        const bgColor = formData.get("bgColor") as string;
        const tooltip = formData.get("tooltip") as string;
        const orderValue = formData.get("order");
        const order = orderValue ? parseInt(orderValue as string) : 0;
        const textColor = formData.get("textColor") as string;
        const imageFile = formData.get("image") as File | null;
        const bgImageFile = formData.get("bgImage") as File | null;

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const currentCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!currentCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        let imageUrl = currentCategory.imageUrl;
        let bgImageUrl = currentCategory.bgImageUrl;

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

        const updatedCategory = await prisma.category.update({
            where: { id },
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

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

// DELETE category
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        // Check if there are wallpapers in this category
        const wallpaperCount = await prisma.wallpaper.count({
            where: { categoryId: id }
        });

        if (wallpaperCount > 0) {
            return NextResponse.json({
                error: "Cannot delete category with associated wallpapers. Please reassign or delete them first."
            }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
