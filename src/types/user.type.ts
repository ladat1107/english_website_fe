import { ExamType, ProficiencyLevel, SkillEnum } from "@/utils/constants/enum";

export interface UserType {
    _id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    googleId?: string;
    role?: string;
    target_exam?: ExamType;
    target_score?: number;
    current_level?: ProficiencyLevel;
    target_date?: string;
    learning_goals?: SkillEnum[];
    createdAt?: string;
    updatedAt?: string;
}
