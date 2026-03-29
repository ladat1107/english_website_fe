import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface WritingExamLayoutProps {
    children: ReactNode;
}

export default function WritingExamLayout({ children }: WritingExamLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
