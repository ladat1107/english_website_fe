import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface AboutUsLayoutProps {
    children: ReactNode;
}

export default function AboutUsLayout({ children }: AboutUsLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
