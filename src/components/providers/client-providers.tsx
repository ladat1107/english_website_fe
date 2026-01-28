/**
 * Khailingo - Client Providers
 * Wrapper cho tất cả client-side providers
 * File này là client component duy nhất bao bọc app
 */

"use client";

import { Suspense, ReactNode } from "react";
import { AuthProvider } from "@/contexts";
import { AuthModal } from "@/components/layout";
import { useAuth } from "@/contexts";
import { ReactQueryProvider } from "./react-query-provider";

/**
 * AuthModalWrapper - Component riêng để render AuthModal
 * Cần tách ra vì useAuth chỉ hoạt động bên trong AuthProvider
 */
const AuthModalWrapper: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />;
};

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * ClientProviders - Wrapper chứa tất cả providers cần thiết
 * Sử dụng Suspense để xử lý useSearchParams trong AuthProvider
 */
export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <Suspense fallback={null}>
      <ReactQueryProvider>
        <AuthProvider>
          {children}
          <AuthModalWrapper />
        </AuthProvider>
      </ReactQueryProvider>
    </Suspense>
  );
};

export default ClientProviders;
