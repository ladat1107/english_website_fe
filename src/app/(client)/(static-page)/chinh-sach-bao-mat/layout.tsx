
import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface PrivacyPolicyLayoutProps {
    children: ReactNode;
}

export default function PrivacyPolicyLayout({ children }: PrivacyPolicyLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
