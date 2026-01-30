/**
 * Khailingo - Admin Speaking Layout
 * Layout cho phần quản lý giao tiếp
 */

import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Giao tiếp - Admin",
    description: "Quản lý bài luyện giao tiếp tiếng Anh",
};

interface AdminSpeakingLayoutProps {
    children: ReactNode;
}

export default function AdminSpeakingLayout({ children }: AdminSpeakingLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}
