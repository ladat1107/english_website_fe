import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface CommunicateLayoutProps {
    children: ReactNode;
}

export default function CommunicateLayout({ children }: CommunicateLayoutProps) {
    return (
        <ClientLayout>{children}</ClientLayout>
    );
}
