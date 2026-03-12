/**
 * Returns the full image URL.
 * If the path is relative, it prepends the base URL from environment variables.
 */
export function getImageUrl(path: string | null | undefined): string {
    if (!path) return "/placeholder.png";

    // Already absolute — return as-is
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) {
        return path;
    }

    // Fallback to empty string if NEXT_PUBLIC_BASE_URL is not set
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    // Ensure there's exactly one slash between baseUrl and path
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
}
