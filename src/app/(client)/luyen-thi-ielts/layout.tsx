/**
 * Khailingo - Layout cho các trang luyện thi IELTS
 * Layout bao gồm Header và Footer
 */

"use client";

import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface IELTSLayoutProps {
    children: ReactNode;
}

export default function IELTSLayout({ children }: IELTSLayoutProps) {

    return (
        <ClientLayout >{children}</ClientLayout>
    );
}
