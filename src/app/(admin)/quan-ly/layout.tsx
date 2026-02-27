"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    ChevronDown,
    Menu,
    Mic,
    LogOut,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AdminLayoutProps {
    children: ReactNode;
}

interface SubMenuItem {
    title: string;
    href: string;
}

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ElementType;
    children?: SubMenuItem[];
}

const sidebarItems: SidebarItem[] = [
    {
        title: "Tổng quan",
        href: "/quan-ly",
        icon: LayoutDashboard,
    },
    {
        title: "Giao tiếp",
        href: "/quan-ly/giao-tiep",
        icon: Mic,
        children: [
            { title: "Danh sách đề", href: "/quan-ly/giao-tiep" },
            { title: "Chấm bài", href: "/quan-ly/giao-tiep/cham-bai" },
        ],
    },
    {
        title: "Đề thi IELTS",
        href: "/quan-ly/de-thi",
        icon: BookOpen,
        children: [
            { title: "Danh sách", href: "/quan-ly/de-thi" },
            { title: "Tạo đề mới", href: "/quan-ly/de-thi/tao-de" },
        ],
    },
    {
        title: "Người dùng",
        href: "/quan-ly/nguoi-dung",
        icon: Users,
    },
    {
        title: "Cài đặt",
        href: "/quan-ly/cai-dat",
        icon: Settings,
    },
];

// Sidebar Navigation Component
function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href)
                ? prev.filter(item => item !== href)
                : [href]
        );
    };

    const isItemActive = (item: SidebarItem) => {
        if (item.children) {
            return item.children.some(child => pathname === child.href);
        }
        return pathname === item.href;
    };

    const isChildActive = (href: string) => {
        return pathname === href;
    };

    return (
        <nav className="px-2 py-2 space-y-1">
            {sidebarItems.map((item) => {
                const isActive = isItemActive(item);
                const isExpanded = expandedItems.includes(item.href);
                const hasChildren = item.children && item.children.length > 0;

                return (
                    <div key={item.href}>
                        {hasChildren ? (
                            <>
                                <button
                                    onClick={() => toggleExpand(item.href)}
                                    className={cn(
                                        "w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 text-left">{item.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 shrink-0 transition-transform duration-200",
                                            isExpanded && "rotate-180"
                                        )}
                                    />
                                </button>
                                {isExpanded && (
                                    <div className="mt-1 ml-4 pl-2 border-l border-gray-200 space-y-1">
                                        {item.children?.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={onItemClick}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                                                        isChildActive(child.href)
                                                            ? "text-primary font-medium"
                                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                    )}
                                                >
                                                    <span>{child.title}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link href={item.href} onClick={onItemClick}>
                                <div
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    <span>{item.title}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-56 flex-col border-r bg-white shadow-sm">
                {/* Logo */}
                <div className="flex h-14 items-center border-b px-3">
                    <Link href="/quan-ly" className="flex items-center gap-2">
                        <Image
                            src="/logo/logo.png"
                            alt="Khailingo Logo"
                            width={100}
                            height={28}
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <SidebarNav />
                </div>

                {/* Bottom Section */}
                <div className="border-t p-2">
                    <Link href="/">
                        <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            <LogOut className="h-4 w-4" />
                            <span>Thoát quản lý</span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header with Sheet */}
            <header className="sticky top-0 z-50 lg:hidden flex h-14 items-center border-b bg-white px-4 shadow-sm">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetHeader className="border-b px-3 py-3">
                            <SheetTitle className="flex items-center gap-2">
                                <Image
                                    src="/logo/logo.png"
                                    alt="Khailingo Logo"
                                    width={100}
                                    height={28}
                                />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto py-2">
                            <SidebarNav onItemClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                        <div className="border-t p-2">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    <span>Thoát quản lý</span>
                                </div>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/quan-ly" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-xs">K</span>
                    </div>
                    <span className="font-bold text-base">Khailingo</span>
                </Link>

                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">A</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="lg:ml-56">
                {/* Desktop Top Header */}
                <header className="sticky top-0 z-30 hidden lg:flex h-14 items-center border-b bg-white px-4 shadow-sm">
                    <div className="flex-1">
                        <h2 className="text-base font-semibold text-gray-800">
                            Hệ thống quản lý
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">A</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="min-h-[calc(100vh-3.5rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}

