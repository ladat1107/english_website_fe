/**
 * BeeStudy - Layout cho các trang luyện thi IELTS
 * Layout bao gồm Header và Footer
 */

"use client";

import { useState, ReactNode } from "react";
import { Header, Footer, AuthModal } from "@/components/layout";

interface IELTSLayoutProps {
    children: ReactNode;
}

export default function IELTSLayout({ children }: IELTSLayoutProps) {
    // State quản lý modal đăng nhập
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <>
            {/* Header */}
            <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

            {/* Main content với padding top cho header fixed */}
            <main className="pt-16 lg:pt-20 min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
