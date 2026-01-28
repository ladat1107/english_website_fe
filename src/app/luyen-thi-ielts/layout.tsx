/**
 * Khailingo - Layout cho các trang luyện thi IELTS
 * Layout bao gồm Header và Footer
 */

"use client";

import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";

interface IELTSLayoutProps {
    children: ReactNode;
}

export default function IELTSLayout({ children }: IELTSLayoutProps) {

    return (
        <>
            {/* Header */}
            <Header />

            {/* Main content với padding top cho header fixed */}
            <main className="pt-16 lg:pt-20 min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <Footer />

        </>
    );
}
