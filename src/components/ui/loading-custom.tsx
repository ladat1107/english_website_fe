"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LoadingCustomProps {
    className?: string;
}
export default function LoadingCustom({ className = "" }: LoadingCustomProps) {
    return (
        <div className={cn("min-h-screen flex items-center justify-center bg-transparent", className)}>
            <div className="flex flex-col items-center">
                <div className="relative w-10 h-10 flex items-center justify-center">
                    {/* Vòng tròn ping */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-primary animate-ping" />

                    {/* logo luôn đúng tâm */}
                    <Image
                        src="/logo/logo-small.png"
                        alt="Khailingo Logo"
                        width={30}
                        height={30}
                        className="absolute w-8 h-8 animate-bounce rounded-full"
                        priority={true}
                    />
                </div>
                <p className="text-primary/70 font-medium text-sm sm:text-base pt-2">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
}
