import { ReactNode } from "react";
import ClientLayout from "@/components/layout/client-layout";

interface BlogLayoutProps {
    children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return <ClientLayout>{children}</ClientLayout>;
}
