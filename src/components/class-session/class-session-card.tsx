"use client";

import React, { useMemo } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    BadgeCheck,
} from "lucide-react";

import { Card, CardContent, Badge, Button } from "@/components/ui";
import { ClassSession, Participant } from "@/types/class-session.type";
import { cn } from "@/utils/cn";
import 'dayjs/locale/vi';
import { getVietnameseWeekday } from "@/utils/funtions";

interface Props {
    sessions: ClassSession[];
    isLoading: boolean;
    userRegistrations: Map<string, Participant>;

    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;

    onSessionClick: (session: ClassSession) => void;
}

export function ClassSessionCard({
    sessions,
    isLoading,
    userRegistrations,
    currentDate,
    onPrevMonth,
    onNextMonth,
    onSessionClick,
}: Props) {

    const monthSessions = useMemo(() => {
        return sessions
            .filter((s) => dayjs(s.date).isSame(currentDate, "month"))
            .sort(
                (a, b) =>
                    dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
            );
    }, [sessions, currentDate]);

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={isLoading}
                    onClick={onPrevMonth}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2 font-semibold text-sm capitalize">
                    <Calendar className="w-4 h-4 text-primary" />
                    {dayjs(currentDate).format("MMMM YYYY")}
                </div>

                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={isLoading}
                    onClick={onNextMonth}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>

            </div>

            {/* EMPTY */}
            {!isLoading && monthSessions.length === 0 && (
                <Card className="border-none shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">

                        {/* Cute SVG */}
                        <svg
                            width="90"
                            height="90"
                            viewBox="0 0 120 120"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mb-3"
                        >
                            <rect
                                x="15"
                                y="25"
                                width="90"
                                height="75"
                                rx="16"
                                fill="#ffe4e6"
                            />
                            <rect
                                x="15"
                                y="25"
                                width="90"
                                height="20"
                                rx="10"
                                fill="#fda4af"
                            />

                            {/* eyes */}
                            <circle cx="50" cy="65" r="4" fill="#fb7185" />
                            <circle cx="70" cy="65" r="4" fill="#fb7185" />

                            {/* smile */}
                            <path
                                d="M50 78C55 84 65 84 70 78"
                                stroke="#fb7185"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* dots calendar */}
                            <circle cx="40" cy="50" r="2" fill="#fecdd3" />
                            <circle cx="60" cy="50" r="2" fill="#fecdd3" />
                            <circle cx="80" cy="50" r="2" fill="#fecdd3" />
                        </svg>

                        <p className="text-sm text-muted-foreground">
                            Không có buổi học trong tháng này
                        </p>

                        <span className="text-xs text-rose-300 mt-1">
                            Hãy quay lại sau nhé ✨
                        </span>
                    </CardContent>
                </Card>
            )}

            {/* LIST */}
            <div className="space-y-3">

                {monthSessions.map((session) => {

                    const registered = userRegistrations.get(session._id);

                    const isPast = dayjs(session.date).isBefore(dayjs(), "day");

                    return (
                        <motion.div
                            key={session._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card
                                onClick={() => onSessionClick(session)}
                                className={cn(
                                    "cursor-pointer border transition hover:shadow-md",
                                    isPast && "opacity-50"
                                )}
                            >
                                <CardContent className="p-4">

                                    <div className="flex justify-between gap-3">

                                        {/* LEFT */}
                                        <div className="flex-1 space-y-1">

                                            {/* TITLE */}
                                            <p className="font-semibold text-sm leading-snug line-clamp-2">
                                                {session.title}
                                            </p>

                                            {/* DESCRIPTION */}
                                            {session.description && (
                                                <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">
                                                    {session.description}
                                                </p>
                                            )}

                                            {/* TIME */}
                                            <div className={`flex items-center gap-2 text-xs pt-1 ${isPast ? "text-muted-foreground" : "text-primary"}`}>

                                                <span>
                                                    {getVietnameseWeekday(session.date)}, {dayjs(session.date).format("DD/MM")}
                                                </span>

                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {session.startTime}
                                                    {session.endTime
                                                        ? ` - ${session.endTime}`
                                                        : ""}
                                                </div>

                                            </div>

                                        </div>

                                        {/* STATUS */}
                                        {registered && (
                                            <Badge variant="success" className="h-fit">
                                                <BadgeCheck className="w-3 h-3 mr-1" />
                                                Đã ĐK
                                            </Badge>
                                        )}

                                    </div>

                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}