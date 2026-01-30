/**
 * Khailingo - Auth Context
 * Context quản lý authentication state
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { http } from "@/lib/http";
import { useCheckStatus } from "@/hooks/use-auth";
import { UserType } from "@/types/user.type";
import { logout } from "@/apiRequest";
import { UserRole } from "@/utils/constants/enum";
import { PATHS } from "@/utils/constants";



/**
 * Interface định nghĩa Auth Context
 */
interface AuthContextType {
  // State
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Modal state
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Actions
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Quản lý authentication state toàn app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<UserType | null>(null);
  const { data: checkStatus, isLoading, refetch: refetchCheckStatus } = useCheckStatus();

  // Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const handleUnauthorized = useCallback(() => {
    setUser(null);
    setIsAuthModalOpen(true);
  }, []);

  useEffect(() => {
    if (checkStatus) {
      if (checkStatus.isAuthenticated) {
        setUser(checkStatus.user);
      } else {
        setUser(null);
      }
    }
  }, [checkStatus]);

  const checkAuthStatus = useCallback(async () => {
    await refetchCheckStatus();
  }, [refetchCheckStatus]);

  /**
   * Xử lý login callback từ Google OAuth
   */
  const handleLoginCallback = useCallback(() => {
    const loginStatus = searchParams.get("login");
    const userParam = searchParams.get("user");
    const errorParam = searchParams.get("error");
    let newUrl = pathname;

    if (loginStatus === "success" && userParam) {
      try {
        const userData: UserType = JSON.parse(decodeURIComponent(userParam));
        console.log("Login successful, user data:", userData);
        if (userData.role === UserRole.ADMIN) {
          router.push(PATHS.ADMIN.DASHBOARD);
          newUrl = PATHS.ADMIN.DASHBOARD;
        }
      } catch (error) {
        console.error("Error parsing user data from login callback:", error);
      }
      // Xóa query params khỏi URL để clean
      router.replace(newUrl, { scroll: false });
    } else if (errorParam === "login_failed") {
      console.error("Login failed");
      // Có thể hiển thị toast thông báo lỗi
      router.replace(newUrl, { scroll: false });
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  /**
   * Đăng xuất
   */
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.refresh();
    }
  }, [router]);

  /**
   * Mở modal đăng nhập
   */
  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  /**
   * Đóng modal đăng nhập
   */
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    // Kiểm tra lại auth status khi đóng modal
    //checkAuthStatus();
  }, []);

  // Setup http client unauthorized handler
  useEffect(() => {
    http.setUnauthorizedHandler(handleUnauthorized);
  }, [handleUnauthorized]);

  // Kiểm tra auth status khi mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Xử lý login callback
  useEffect(() => {
    handleLoginCallback();
  }, [handleLoginCallback]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    logout: handleLogout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook để sử dụng Auth Context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
