/**
 * BeeStudy - Logo Component
 * Component hiển thị logo BeeStudy
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
    className,
    showText = true,
    size = "md",
}) => {
    const sizeStyles = {
        sm: { icon: "w-8 h-8", text: "text-lg" },
        md: { icon: "w-10 h-10", text: "text-xl" },
        lg: { icon: "w-12 h-12", text: "text-2xl" },
    };

    return (
        <Link
            href="/"
            className={cn(
                "flex items-center gap-2 font-bold transition-opacity hover:opacity-90",
                className
            )}
        >
            {/* Icon Logo - Con ong */}
            <div
                className={cn(
                    "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-bee-red-dark",
                    sizeStyles[size].icon
                )}
            >
                {/* Bee SVG Icon */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2Z"
                        fill="currentColor"
                    />
                    <path
                        d="M9 13H15M9 16H15"
                        stroke="#FBBF24"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle cx="9" cy="10" r="1" fill="#FBBF24" />
                    <circle cx="15" cy="10" r="1" fill="#FBBF24" />
                </svg>
            </div>

            {/* Text Logo */}
            {showText && (
                <span
                    className={cn(
                        "font-heading font-bold tracking-tight",
                        sizeStyles[size].text
                    )}
                >
                    <span className="text-primary">Bee</span>
                    <span className="text-foreground">Study</span>
                </span>
            )}
        </Link>
    );
};

export default Logo;
