/**
 * BeeStudy - Constants
 * File chứa các hằng số dùng trong toàn bộ ứng dụng
 */

// =====================================================
// THÔNG TIN WEBSITE
// =====================================================
export const SITE_CONFIG = {
    name: "BeeStudy",
    description: "Nền tảng học tiếng Anh online miễn phí và chất lượng",
    slogan: "Học tiếng Anh thông minh như chú ong chăm chỉ",
    url: "https://beestudy.vn",
    logo: "/images/logo.svg",
    logoText: "BeeStudy",
    email: "support@beestudy.vn",
    phone: "1800 96 96 39",
    address: "TP. Hồ Chí Minh, Việt Nam",
    social: {
        facebook: "https://facebook.com/beestudy",
        youtube: "https://youtube.com/beestudy",
        tiktok: "https://tiktok.com/@beestudy",
        instagram: "https://instagram.com/beestudy",
    },
} as const;

// =====================================================
// MÀU SẮC CHỦ ĐẠO
// =====================================================
export const COLORS = {
    primary: "#D42525",
    primaryDark: "#B91C1C",
    primaryLight: "#FEE2E2",
    secondary: "#FBBF24",
    secondaryLight: "#FEF3C7",
    white: "#FFFFFF",
    black: "#000000",
    gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
    },
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
} as const;

// =====================================================
// NAVIGATION - MENU CHÍNH
// =====================================================

interface NavItem {
    title: string;
    href: string;
    description?: string;
    children?: NavItem[];
}

export const MAIN_NAV_ITEMS: NavItem[] = [
    {
        title: "Trang chủ",
        href: "/",
    },
    {
        title: "Luyện thi IELTS",
        href: "/luyen-thi-ielts",
        children: [
            {
                title: "IELTS Full Test",
                href: "/luyen-thi-ielts/full-test",
                description: "Làm bài thi IELTS đầy đủ với trải nghiệm như thi thật",
            },
            {
                title: "IELTS Reading",
                href: "/luyen-thi-ielts/reading",
                description: "Luyện đề IELTS Reading với kho đề khủng",
            },
            {
                title: "IELTS Listening",
                href: "/luyen-thi-ielts/listening",
                description: "Luyện nghe IELTS với audio chất lượng cao",
            },
            {
                title: "IELTS Writing",
                href: "/luyen-thi-ielts/writing",
                description: "Xem bài mẫu Writing Task 1 & Task 2",
            },
            {
                title: "IELTS Speaking",
                href: "/luyen-thi-ielts/speaking",
                description: "Bài mẫu Speaking với từ vựng và dàn ý",
            },
        ],
    },
    {
        title: "Chép chính tả",
        href: "/nghe-chep-chinh-ta",
        description: "Phần mềm luyện nghe chép chính tả theo từng câu",
    },
    {
        title: "Flashcard",
        href: "/flashcard",
        description: "Học từ vựng hiệu quả với flashcard",
    },
    {
        title: "Bài mẫu",
        href: "/bai-mau",
        children: [
            {
                title: "Writing Sample",
                href: "/bai-mau/writing",
                description: "Bài mẫu IELTS Writing band 8.0+",
            },
            {
                title: "Speaking Sample",
                href: "/bai-mau/speaking",
                description: "Bài mẫu IELTS Speaking band 8.0+",
            },
        ],
    },
] as const;

// =====================================================
// FOOTER NAVIGATION
// =====================================================
export const FOOTER_NAV = {
    features: {
        title: "Tính năng",
        items: [
            { title: "IELTS Online Test", href: "/luyen-thi-ielts/full-test" },
            { title: "IELTS Reading Practice", href: "/luyen-thi-ielts/reading" },
            { title: "IELTS Listening Practice", href: "/luyen-thi-ielts/listening" },
            { title: "Chép chính tả", href: "/nghe-chep-chinh-ta" },
            { title: "Flashcard", href: "/flashcard" },
        ],
    },
    resources: {
        title: "Tài nguyên",
        items: [
            { title: "Writing Sample", href: "/bai-mau/writing" },
            { title: "Speaking Sample", href: "/bai-mau/speaking" },
            { title: "Blog", href: "/blog" },
            { title: "Từ điển", href: "/tu-dien" },
        ],
    },
    company: {
        title: "Về chúng tôi",
        items: [
            { title: "Giới thiệu", href: "/gioi-thieu" },
            { title: "Liên hệ", href: "/lien-he" },
            { title: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
            { title: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
        ],
    },
} as const;

// =====================================================
// EXAM TYPES - LOẠI ĐỀ THI
// =====================================================
export const EXAM_TYPES = {
    IELTS_FULL: "ielts-full",
    IELTS_READING: "ielts-reading",
    IELTS_LISTENING: "ielts-listening",
    TOEIC: "toeic",
} as const;

// =====================================================
// SKILL LEVELS - CẤP ĐỘ
// =====================================================
export const SKILL_LEVELS = [
    { value: "beginner", label: "Beginner", color: "success" },
    { value: "intermediate", label: "Intermediate", color: "warning" },
    { value: "advanced", label: "Advanced", color: "destructive" },
] as const;

// =====================================================
// CAMBRIDGE IELTS BOOKS
// =====================================================
export const CAMBRIDGE_BOOKS = [
    { id: "cam-20", name: "Cambridge IELTS 20", tests: 8 },
    { id: "cam-19", name: "Cambridge IELTS 19", tests: 4 },
    { id: "cam-18", name: "Cambridge IELTS 18", tests: 4 },
    { id: "cam-17", name: "Cambridge IELTS 17", tests: 4 },
    { id: "cam-16", name: "Cambridge IELTS 16", tests: 4 },
    { id: "cam-15", name: "Cambridge IELTS 15", tests: 4 },
    { id: "cam-14", name: "Cambridge IELTS 14", tests: 4 },
    { id: "cam-13", name: "Cambridge IELTS 13", tests: 4 },
] as const;

// =====================================================
// API ENDPOINTS
// =====================================================
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        GOOGLE: "/auth/google",
        REFRESH: "/auth/refresh",
    },
    // User
    USER: {
        PROFILE: "/user/profile",
        UPDATE: "/user/update",
    },
    // Exam
    EXAM: {
        LIST: "/exam",
        DETAIL: (id: string) => `/exam/${id}`,
        SUBMIT: "/exam/submit",
    },
    // Flashcard
    FLASHCARD: {
        DECKS: "/flashcard/decks",
        CARDS: (deckId: string) => `/flashcard/decks/${deckId}/cards`,
    },
} as const;

// =====================================================
// ANIMATION VARIANTS - FRAMER MOTION
// =====================================================
export const ANIMATION_VARIANTS = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },
    fadeInDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    slideInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
} as const;

// =====================================================
// LOCAL STORAGE KEYS
// =====================================================
export const STORAGE_KEYS = {
    TOKEN: "bee_access_token",
    REFRESH_TOKEN: "bee_refresh_token",
    USER: "bee_user",
    THEME: "bee_theme",
    LANGUAGE: "bee_language",
} as const;

// =====================================================
// BREAKPOINTS
// =====================================================
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;
