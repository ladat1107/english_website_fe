/**
 * Khailingo - Profile Layout
 * Layout cho trang thông tin cá nhân
 */

import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thông tin cá nhân | Khailingo",
    description: "Xem và quản lý thông tin cá nhân, theo dõi tiến độ học tập trên Khailingo",
    openGraph: {
        title: "Thông tin cá nhân | Khailingo",
        description: "Xem và quản lý thông tin cá nhân, theo dõi tiến độ học tập trên Khailingo",
    },
};

interface ProfileLayoutProps {
    children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    return <ClientLayout>{children}</ClientLayout>;
}
