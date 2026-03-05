import dayjs from "dayjs";
import { TypeLanguage } from "./constants/enum";

// Hàm lấy tên viết tắt cho avatar từ tên đầy đủ ================================================================================   
export function getNameAvatar(name: string): string {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase(); // Trường hợp chỉ có 1 từ → lấy 2 ký tự đầu
    }

    return (
        parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
    );
}


// Hàm xây dựng query string từ object params, bỏ qua các giá trị undefined/null/empty ============================================================
export const buildQueryString = (params?: Record<string, any>): string => {
    if (!params) return '';

    const validParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)]);

    return validParams.length > 0 ? `?${new URLSearchParams(validParams).toString()}` : '';
};


// Hàm định dạng thời gian từ giây sang định dạng mm:ss =========================================================================
export const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Hàm lấy màu sắc tương ứng với điểm số (điểm 0-100) =================================================================================================
export const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'destructive' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
};

// Hàm chuyển link youtube sang dạng nhúng (embed) =================================================================================================
export const getYoutubeEmbedUrl = (url: string) => {
    const regExp =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);

    return match
        ? `https://www.youtube.com/embed/${match[1]}`
        : null;
};

export const getVietnameseWeekday = (date: string) => {
    const day = dayjs(date).day(); // 0-6

    const map = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    return map[day];
};


export const speakText = (text: string, lang: TypeLanguage, speed: number = 0.9) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);

    if (lang === TypeLanguage.CHINESE) {
        utterance.lang = "zh-CN";
    } else {
        utterance.lang = "en-US";
    }

    utterance.rate = speed;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
};

export const removeBracketContent = (text: string): string => {
    return text.replace(/\s*[\(\[\{][^)\]\}]*[\)\]\}]/g, "").trim();
};
