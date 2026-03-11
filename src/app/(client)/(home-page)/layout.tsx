/**
 * Khailingo - Profile Layout
 * Layout cho trang thông tin cá nhân
 */

import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface ProfileLayoutProps {
    children: ReactNode;
}

export default function HomePageLayout({ children }: ProfileLayoutProps) {
    return <ClientLayout>{children}</ClientLayout>;
}
