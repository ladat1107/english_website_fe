/**
 * Khailingo - Student Class Schedule Layout
 * Layout cho trang lịch học (Học viên)
 */

import ClientLayout from "@/components/layout/client-layout";

export default function StudentClassScheduleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClientLayout>
            {children}
        </ClientLayout>
    );
}
