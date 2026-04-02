/**
 * Chuyển text tiếng Việt thành slug URL-safe
 */
export function toSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "") // Chỉ giữ chữ, số, space, dash
        .replace(/\s+/g, "-") // Space → dash
        .replace(/-+/g, "-") // Nhiều dash → 1 dash
        .replace(/^-|-$/g, ""); // Bỏ dash đầu/cuối
}

/**
 * Tạo slug cho blog post: title-slug + id
 */
export function generateBlogSlug(title: string, id: string): string {
    const titleSlug = toSlug(title);
    return `${titleSlug}-${id}`;
}

/**
 * Trích xuất MongoDB _id từ slug
 * ObjectId = 24 ký tự hex cuối
 */
export function extractIdFromSlug(slug: string): string {
    // MongoDB ObjectId format: 24 hex characters
    const match = slug.match(/([a-f0-9]{24})$/);
    return match ? match[1] : slug;
}

/**
 * Tính thời gian đọc ước tính (tiếng Việt ~200 từ/phút)
 */
export function estimateReadingTime(htmlContent: string): number {
    const text = htmlContent.replace(/<[^>]*>/g, "");
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}