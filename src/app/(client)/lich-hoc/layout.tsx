/**
 * Khailingo - Student Class Schedule Layout
 * Layout cho trang lịch học (Học viên)
 */

import { Header, Footer } from "@/components/layout";

export default function StudentClassScheduleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="pt-14 min-h-screen bg-background">
                {children}
            </main>
            <Footer />
        </>
    );
}
