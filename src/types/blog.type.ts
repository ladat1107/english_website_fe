import { BlogCategory } from "@/utils/constants/enum";
import { UserType } from "./user.type";
import { ParamBasic } from ".";

export interface BlogType {
    _id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    category: BlogCategory;
    is_public: boolean;
    is_special: boolean;
    author: UserType;
    createdAt: string;
    updatedAt: string;
}

export interface BlogParams extends ParamBasic {
    category?: BlogCategory;
    is_public?: boolean;
    is_special?: boolean;
}



// =====================================================
// SLUG UTILITIES
// Tạo slug từ title + _id để URL thân thiện SEO
// VD: "Cách học IELTS" + "6612abc" → "cach-hoc-ielts-6612abc"
// =====================================================



/**
 * Map category enum sang tên hiển thị
 */
export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
    ["ALL" as BlogCategory]: "Tất cả",
    [BlogCategory.NEWS]: "Tin tức",
    [BlogCategory.OVERVIEW]: "Tổng quan",
    [BlogCategory.IELTS_TIPS]: "Mẹo thi IELTS",
    [BlogCategory.STUDY_GUIDE]: "Hướng dẫn học",
    [BlogCategory.GRAMMAR]: "Ngữ pháp",
    [BlogCategory.VOCABULARY]: "Từ vựng",
    [BlogCategory.ANNOUNCEMENT]: "Thông báo",
};

export const BLOG_CATEGORY_DESCRIPTIONS: Record<BlogCategory, string> = {
    ["ALL" as BlogCategory]: `Khám phá toàn bộ bài viết tại Khailingo với nội dung chọn lọc và cập nhật liên tục.
Từ kiến thức nền tảng đến kinh nghiệm học tập thực tế, phù hợp cho mọi trình độ.
Giúp bạn học hiệu quả và phát triển kỹ năng tiếng Anh mỗi ngày.`,

    [BlogCategory.NEWS]: `Cập nhật tin tức mới nhất về giáo dục và IELTS một cách nhanh chóng và chính xác.
Nắm bắt xu hướng học tập và những thay đổi quan trọng trong kỳ thi.
Giúp bạn luôn chủ động và không bị tụt lại phía sau.`,

    [BlogCategory.OVERVIEW]: `Tổng hợp kiến thức nền tảng một cách dễ hiểu và có hệ thống.
Phù hợp cho người mới bắt đầu hoặc cần ôn tập lại kiến thức.
Giúp bạn xây dựng nền tảng vững chắc trước khi nâng cao.`,

    [BlogCategory.IELTS_TIPS]: `Chia sẻ mẹo làm bài IELTS thực tế và bám sát cấu trúc đề thi.
Tối ưu chiến lược và cải thiện từng kỹ năng một cách hiệu quả.
Giúp bạn nâng band điểm rõ rệt trong thời gian ngắn.`,

    [BlogCategory.STUDY_GUIDE]: `Hướng dẫn lộ trình học rõ ràng, dễ áp dụng cho từng mục tiêu.
Giúp bạn học đúng hướng, tránh lan man và mất thời gian.
Phù hợp cho mọi trình độ từ cơ bản đến nâng cao.`,

    [BlogCategory.GRAMMAR]: `Hệ thống ngữ pháp từ cơ bản đến nâng cao một cách dễ hiểu.
Giải thích rõ ràng kèm ví dụ giúp bạn nắm chắc kiến thức.
Giúp bạn sử dụng tiếng Anh chính xác và tự tin hơn.`,

    [BlogCategory.VOCABULARY]: `Mở rộng vốn từ vựng theo chủ đề quen thuộc và dễ áp dụng.
Kết hợp phương pháp học giúp ghi nhớ nhanh và sử dụng hiệu quả.
Giúp bạn diễn đạt tự nhiên hơn trong giao tiếp và bài thi.`,

    [BlogCategory.ANNOUNCEMENT]: `Cập nhật các thông báo quan trọng từ Khailingo một cách nhanh chóng.
Thông tin về khóa học, sự kiện và thay đổi mới nhất.
Giúp bạn không bỏ lỡ những cập nhật cần thiết.`,
};

/**
 * Map category → slug path (cho URL)
 */
export const BLOG_CATEGORY_SLUGS: Record<BlogCategory, string> = {
    [BlogCategory.NEWS]: "tin-tuc",
    [BlogCategory.OVERVIEW]: "tong-quan",
    [BlogCategory.IELTS_TIPS]: "meo-thi-ielts",
    [BlogCategory.STUDY_GUIDE]: "huong-dan-hoc",
    [BlogCategory.GRAMMAR]: "ngu-phap",
    [BlogCategory.VOCABULARY]: "tu-vung",
    [BlogCategory.ANNOUNCEMENT]: "thong-bao",
};

/**
 * Tìm BlogCategory từ slug path
 */
export function getCategoryFromSlug(slug: string): BlogCategory | undefined {
    return (Object.entries(BLOG_CATEGORY_SLUGS) as [BlogCategory, string][])
        .find(([, s]) => s === slug)?.[0];
}