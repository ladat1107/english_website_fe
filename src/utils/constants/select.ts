import { ExamType, ProficiencyLevel, SkillEnum, UserRole } from "./enum";

export const roleOptions = Object.values(UserRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1), // Chuyển ADMIN thành Admin
}));

export const levelOptions = Object.values(ProficiencyLevel).map((level) => ({
    value: level,
    label: level, // Chuyển CamelCase thành dạng có dấu cách
}));

export const examOptions = Object.values(ExamType).map((exam) => ({
    value: exam,
    label: exam, // Chuyển CamelCase thành dạng có dấu cách
}));

export const skillOptions = Object.values(SkillEnum).map((skill) => ({
    value: skill,
    label: skill.charAt(0).toUpperCase() + skill.slice(1), // Chuyển camelCase thành Capitalized
}));