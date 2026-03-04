import { RegistrationStatus } from "@/utils/constants/enum";
import { ParamBasic } from ".";
import { UserType } from "./user.type";

export interface ClassSession {
    _id: string;
    mentor_id: string;
    mentor?: UserType;
    title: string;
    description?: string;
    link: string;
    date: string;
    startTime: string;
    endTime: string;
    is_active: boolean;
    createdAt?: string;
    updatedAt?: string;
    participants?: Participant[];   
}

export interface ClassSessionParams extends ParamBasic {
    startDate?: string;
    endDate?: string;
    mentor_id?: string;
    is_active?: boolean;
}

export interface CreateClassSessionDto {
    title: string;
    description?: string;
    link: string;
    date: string;
    startTime: string;
    endTime: string;
}

export interface UpdateClassSessionDto extends Partial<CreateClassSessionDto> {
    is_active?: boolean;
}

// =====================================================
// PARTICIPANT TYPES
// =====================================================
export interface Participant {
    _id: string;
    class_session_id: string;
    user_id: string;
    user?: UserType;
    status: RegistrationStatus;
    createdAt?: string;
    updatedAt?: string;
}


// =====================================================
// CALENDAR EVENT TYPES
// =====================================================
export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    extendedProps: {
        session: ClassSession;
        participantCount?: number;
        userStatus?: RegistrationStatus | null;
    };
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}
