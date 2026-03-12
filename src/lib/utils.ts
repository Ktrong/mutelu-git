import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // ดึง base URL จาก environment ตัวแปร
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    // นำมาต่อกัน
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
