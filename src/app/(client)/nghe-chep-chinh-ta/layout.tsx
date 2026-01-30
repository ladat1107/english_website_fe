/**
 * Khailingo - Nghe Chép Chính Tả Layout
 * Layout chung cho các trang dictation
 */

import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface DictationLayoutProps {
    children: ReactNode;
}

export default function DictationLayout({ children }: DictationLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
