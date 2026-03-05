import { LevelExam } from "./enum";

// Màu cho lịch học
export const pastelForRedTheme = ["#e0f2fe", "#dbeafe", "#bfdbfe", "#dcfce7", "#bbf7d0", "#fef9c3", "#fde68a", "#ffedd5", "#ffe4e6", "#fecdd3", "#fbcfe8", "#ede9fe", "#f3e8ff"];

// Màu cho level
export const difficultyColors = {
    [LevelExam.EASY]: "text-success bg-success/10",
    [LevelExam.MEDIUM]: "text-blue-500 bg-blue-100",
    [LevelExam.HARD]: "text-destructive bg-destructive/10",
};