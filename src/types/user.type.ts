import { ExamType, ProficiencyLevel, SkillEnum, UserRole } from "@/utils/constants/enum";
import { ParamBasic } from ".";
import z from "zod";

export interface UserType {
    _id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    googleId?: string;
    role: UserRole;
    target_exam?: ExamType;
    target_score?: number;
    current_level?: ProficiencyLevel;
    target_date?: string;
    learning_goals?: SkillEnum[];
    createdAt?: string;
    updatedAt?: string;
}

export interface UserParams extends ParamBasic {
    role?: UserRole;
    current_level?: ProficiencyLevel;
}

export interface StatisticsRoleUser {
    count: number;
    role: string;
}

export const editUserSchema = z.object({
    full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    role: z.nativeEnum(UserRole),
    current_level: z.nativeEnum(ProficiencyLevel).optional().nullable(),
    target_exam: z.nativeEnum(ExamType).optional().nullable(),
    target_score: z.number().optional().nullable(),
    target_date: z.string().optional().nullable(),
    learning_goals: z.array(z.nativeEnum(SkillEnum)).optional(),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export const defaultEditUserFormData: EditUserFormData = {
    full_name: "",
    role: UserRole.STUDENT,
    current_level: undefined,
    target_exam: null,
    target_score: null,
    target_date: null,
    learning_goals: [],
}

