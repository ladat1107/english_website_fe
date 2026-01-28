import { UserType } from "./user.type";

export interface AuthStatusResponse {
    isAuthenticated: boolean;
    user: UserType | null;
}
