/**
 * Khailingo - Constants
 * File chứa các hằng số dùng trong toàn bộ ứng dụng
 */

import envConfig from "../env-config";
import { TypeLanguage } from "./enum";

export const PATHS = {
    ADMIN: {
        DASHBOARD: '/quan-ly',
        SPEAKING_EXAM: '/quan-ly/giao-tiep',
        SPEAKING_EXAM_CREATE: '/quan-ly/giao-tiep/tao-de',
        SPEAKING_EXAM_EDIT: (examId: string) => `/quan-ly/giao-tiep/chinh-sua/${examId}`,
        SPEAKING_GRADING: '/quan-ly/giao-tiep/cham-bai',
        SPEAKING_GRADING_DETAIL: (attemptId: string) => `/quan-ly/giao-tiep/cham-bai/${attemptId}`,
        CLASS_SCHEDULE: '/quan-ly/lich-hoc',
        CLASS_SESSION_DETAIL: (sessionId: string) => `/quan-ly/lich-hoc/${sessionId}`,
        FIRST_TEST: '/quan-ly/dau-vao',
        USERS: '/quan-ly/nguoi-dung',
    },
    CLIENT: {
        HOME: '/',
        PROFILE: '/profile',
        FLASHCARD: '/flashcard',
        SPEAKING: (type?: string) => `/luyen-noi${type ? `?type=${type}` : ''}`,
        SPEAKING_RESULT: (attemptId: string) => `/luyen-noi/ket-qua/${attemptId}`,
        SPEAKING_HISTORY: (examId: string) => `/luyen-noi/lich-su/${examId}`,
        SPEAKING_DETAIL: (examId: string) => `/luyen-noi/${examId}`,
        CLASS_SCHEDULE: '/lich-hoc',
        CLASS_SESSION_DETAIL: (sessionId: string) => `/lich-hoc/${sessionId}`,
    }
} as const;
// =====================================================
// THÔNG TIN WEBSITE
// =====================================================
export const SITE_CONFIG = {
    name: "Khailingo",
    description: "Nền tảng học tiếng Anh online miễn phí và chất lượng",
    slogan: "Học tiếng Anh thông minh như chú ong chăm chỉ",
    url: envConfig.NEXT_PUBLIC_FRONTEND_URL,
    logo: "/logo/logo-small.png",
    logoText: "Khailingo",
    email: "khailingo98@gmail.com",
    phone: "0968 983 722",
    address: "TP. Hồ Chí Minh, Việt Nam",
    social: {
        facebook: envConfig.NEXT_PUBLIC_FACEBOOK_URL,
        youtube: envConfig.NEXT_PUBLIC_YOUTUBE_URL,
        tiktok: envConfig.NEXT_PUBLIC_TIKTOK_URL,
        instagram: envConfig.NEXT_PUBLIC_INSTAGRAM_URL,
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
        title: "Luyện nói",
        href: "#",
        description: "Luyện nói tiếng Anh theo chủ đề hàng ngày",
        children: [{
            title: "Tiếng Anh",
            href: `${PATHS.CLIENT.SPEAKING(TypeLanguage.ENGLISH)}`,
        }, {
            title: "Tiếng Trung",
            href: `${PATHS.CLIENT.SPEAKING(TypeLanguage.CHINESE)}`,
        }]
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
        title: "Lịch học",
        href: "/lich-hoc",
        description: "Xem lịch học và đăng ký tham gia các buổi học trực tuyến",
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


