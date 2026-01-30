import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface TermsOfUseLayoutProps {
    children: ReactNode;
}

export default function TermsOfUseLayout({ children }: TermsOfUseLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
