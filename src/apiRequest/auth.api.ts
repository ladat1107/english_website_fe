/**
 * Khailingo - Auth API Request
 * Các hàm gọi API authentication
 */

import envConfig from "@/utils/env-config";
import { http } from "@/lib/http";

const BACKEND_URL = envConfig.NEXT_PUBLIC_BACKEND_URL;

/**
 * Đăng xuất
 */
export const logout = async (): Promise<boolean> => {
  try {
    await http.post(`/auth/logout`, {});
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};


/**
 * Tạo URL redirect đến Google OAuth
 */
export const getGoogleAuthUrl = (redirectPath: string = "/"): string => {
  return `${BACKEND_URL}/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
};
