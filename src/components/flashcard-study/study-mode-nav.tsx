"use client";

/**
 * StudyModeNav - Grid navigation giữa các chế độ học
 * Style theo DOL English: #D42525 primary, modern cards, cute icons
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { FiLayers, FiZap, FiClipboard, FiGrid } from "react-icons/fi";
import { cn } from "@/utils/cn";
import { PATHS } from "@/utils/constants";
import type { StudyMode } from "@/types/flashcard.type";

interface StudyModeNavProps {
  deckId: string;
  activeMode?: StudyMode;
  className?: string;
}

// Có 2 chỗ nếu sửa thì kiểm tra kỹ nhe
export const STUDY_MODES = [
  {
    mode: "flip" as StudyMode,
    label: "Flashcard",
    description: "Lật thẻ ghi nhớ từ vựng",
    icon: FiLayers,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_FLIP(id),
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 hover:bg-blue-100",
    bgActive: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconBg: "bg-blue-100 text-blue-600",
    iconBgActive: "bg-white/20 text-white",
  },
  {
    mode: "learn" as StudyMode,
    label: "Ôn tập",
    description: "Học thích ứng từng từ",
    icon: FiZap,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_LEARN(id),
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 hover:bg-emerald-100",
    bgActive: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-100 text-emerald-600",
    iconBgActive: "bg-white/20 text-white",
  },
  {
    mode: "test" as StudyMode,
    label: "Kiểm tra",
    description: "Đánh giá kiến thức",
    icon: FiClipboard,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_TEST(id),
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50 hover:bg-amber-100",
    bgActive: "bg-gradient-to-br from-amber-500 to-orange-500",
    iconBg: "bg-amber-100 text-amber-600",
    iconBgActive: "bg-white/20 text-white",
  },
  {
    mode: "match" as StudyMode,
    label: "Ghép đôi",
    description: "Nối từ với nghĩa",
    icon: FiGrid,
    href: (id: string) => PATHS.CLIENT.FLASHCARD_MATCH(id),
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 hover:bg-purple-100",
    bgActive: "bg-gradient-to-br from-purple-500 to-purple-600",
    iconBg: "bg-purple-100 text-purple-600",
    iconBgActive: "bg-white/20 text-white",
  },
];

export function StudyModeNav({ deckId, activeMode, className }: StudyModeNavProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {STUDY_MODES.map((item, index) => {
        const isActive = activeMode === item.mode;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href(deckId)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl transition-all duration-200",
                "border shadow-sm",
                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                isActive
                  ? cn(item.bgActive, "text-white border-transparent")
                  : cn(
                    "bg-white dark:bg-slate-900",
                    "border-slate-200 dark:border-slate-800",
                    item.bgLight,
                    "dark:hover:bg-slate-800"
                  )
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  "transition-all duration-200",
                  isActive ? item.iconBgActive : item.iconBg
                )}
              >
                <Icon className="size-5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-sm font-bold leading-tight",
                  !isActive && "text-slate-800 dark:text-slate-100"
                )}>
                  {item.label}
                </p>
                <p
                  className={cn(
                    "text-xs leading-tight mt-0.5 line-clamp-1",
                    isActive ? "text-white/80" : "text-slate-500"
                  )}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
