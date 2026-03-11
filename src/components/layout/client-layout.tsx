"use client";

import { ReactNode } from "react";
import { Header, Footer } from "@/components/layout";
import { FloatingWidgets } from "../floating";

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <>

            {/* Header */}
            <Header />

            {/* Main content với padding top cho header fixed */}
            <main className="pt-14 min-h-screen">
                {children}
            </main>
            
            <FloatingWidgets />

            {/* Footer */}
            <Footer />
        </>
    );
}
