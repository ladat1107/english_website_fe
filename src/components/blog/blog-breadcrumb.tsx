import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BlogBreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
    // JSON-LD BreadcrumbList schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Trang chủ",
                item: "/",
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.label,
                ...(item.href && { item: item.href }),
            })),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center flex-wrap gap-1 text-sm">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span>Trang chủ</span>
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-1">
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-foreground font-medium line-clamp-1 max-w-[200px] md:max-w-none">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
