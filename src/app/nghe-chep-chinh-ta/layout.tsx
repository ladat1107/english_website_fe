/**
 * BeeStudy - Nghe Chép Chính Tả Layout
 * Layout chung cho các trang dictation
 */

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface DictationLayoutProps {
    children: ReactNode;
}

export default function DictationLayout({ children }: DictationLayoutProps) {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                {children}
            </main>
            <Footer />
        </>
    );
}
