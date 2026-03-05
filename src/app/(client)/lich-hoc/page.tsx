/**
 * Khailingo - Student Class Schedule Page
 * Trang lịch học cho học viên - Calendar View với đăng ký buổi học
 */

"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DatesSetArg, EventContentArg, EventClickArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    BadgeCheck,
} from "lucide-react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
} from "@/components/ui";

import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts";
import {
    useFindMyClassSessions,
    useGetClassSessions,
} from "@/hooks/use-class-session";
import { ClassSession, CalendarEvent, Participant } from "@/types/class-session.type";
import { ClassSessionRegisterDialog } from "@/components/class-session/class-session-register";
import "@/app/(admin)/quan-ly/lich-hoc/lich-hoc.css";
import { pastelForRedTheme } from "@/utils/constants/ui";
import { ClassSessionCard } from "@/components/class-session/class-session-card";
dayjs.locale("vi");

function renderEventContent(eventInfo: EventContentArg) {
    const { session, userStatus } = eventInfo.event.extendedProps;
    const isPast = dayjs(session.date).isBefore(dayjs(), "day");

    return (
        <div
            className={cn(
                "relative rounded-md cursor-pointer overflow-hidden w-full",
                "px-1.5 py-1",                 // giảm padding
                "text-[11px] sm:text-xs",       // text nhỏ trên mobile
                "leading-tight",                // line-height gọn
                isPast && "opacity-60"
            )}
            style={{
                background: eventInfo.backgroundColor,
                color: "#1E293B"
            }}
        >
            {/* Content */}
            <div className="relative z-10">
                {/* Title */}
                <div className="font-medium truncate text-[10px] sm:text-xs">
                    {eventInfo.event.title}
                </div>

                {/* Time */}
                <div className="hidden sm:flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80" />
                    <span className="text-[8px] sm:text-[10px] opacity-80">
                        {session.startTime}
                        {session.endTime ? ` - ${session.endTime}` : ""}
                    </span>
                </div>
            </div>

            {/* Watermark icon */}
            {userStatus && (
                <BadgeCheck
                    className="
                        absolute bottom-0 right-0 
                        w-6 h-6 sm:w-8 sm:h-8 
                        text-green-600 opacity-40 sm:opacity-80 
                        z-0 pointer-events-none
                    "
                />
            )}
        </div>
    );
}
// =====================================================
// UPCOMING SESSIONS SIDEBAR
// =====================================================
interface UpcomingSessionsProps {
    onSessionClick: (session: ClassSession) => void;
}

function UpcomingSessions({ onSessionClick }: UpcomingSessionsProps) {
    const { data: upcomingSessionsRes, isLoading } = useFindMyClassSessions()
    const upcomingSessions: ClassSession[] = upcomingSessionsRes?.data || [];

    const renderCardDefault = (description: string) => {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Lịch học đã đăng ký
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                        {description}
                    </p>
                </CardContent>
            </Card>
        )
    }
    if (isLoading) {
        return renderCardDefault("Đang tải lịch học của bạn...");
    }

    if (upcomingSessions.length === 0) {
        return renderCardDefault("Bạn chưa đăng ký buổi học nào trong thời gian tới.");
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Lịch học đã đăng ký
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {upcomingSessions.map((session) => {
                    const isToday = dayjs(session.date).isSame(dayjs(), "day");

                    return (
                        <motion.div
                            key={session._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                                isToday ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-muted/50"
                            )}
                            onClick={() => onSessionClick(session)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{session.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <span>{dayjs(session.date).format("DD/MM")}</span>
                                        <span>•</span>
                                        <span>{session.startTime} {session.endTime ? ` - ${session.endTime}` : ''}</span>
                                    </div>
                                </div>
                                <Badge
                                    variant={'success'}
                                    size="sm"
                                >
                                    Đã ĐK
                                </Badge>
                            </div>
                        </motion.div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function StudentClassSchedulePage() {
    const calendarRef = useRef<FullCalendar>(null);
    const { user: _user, isAuthenticated: _isAuthenticated } = useAuth();

    // States
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    // Calculate date range for current view
    const dateRange = useMemo(() => {
        const start = dayjs(currentDate).subtract(1, "month").startOf("month");
        const end = dayjs(currentDate).add(1, "month").endOf("month");
        return {
            startDate: start.format("YYYY-MM-DD"),
            endDate: end.format("YYYY-MM-DD"),
        };
    }, [currentDate]);

    // Queries
    const { data: sessionsRes, isLoading } = useGetClassSessions({ ...dateRange });

    const sessions: ClassSession[] = useMemo(() => sessionsRes?.data || [], [sessionsRes?.data]);

    const userRegistrations = useMemo(() => {
        const map = new Map<string, Participant>();
        sessions.forEach(session => {
            session.participants?.forEach(participant => {
                if (participant.user_id === _user?._id) {
                    map.set(session._id, participant);
                }
            });
        });
        return map;
    }, [sessions, _user]);

    // Transform sessions to calendar events
    const calendarEvents: CalendarEvent[] = useMemo(() => {
        return sessions.map((session) => {
            const userStatus = userRegistrations.get(session._id)?.status || null;
            const sessionDate = dayjs(session.date).format("YYYY-MM-DD");
            const randomColor = pastelForRedTheme[session.title.length % pastelForRedTheme.length];

            return {
                id: session._id,
                title: session.title,
                start: `${sessionDate}T${session.startTime}`,
                end: `${sessionDate}T${session.endTime}`,
                extendedProps: {
                    session,
                    userStatus,
                },
                backgroundColor: randomColor,
            };
        });
    }, [sessions, _user]);

    // Handlers
    const handleEventClick = useCallback((arg: EventClickArg) => {
        const session = arg.event.extendedProps.session as ClassSession;
        setSelectedSession(session);
        setShowDetailDialog(true);

        setTimeout(() => {
            const popover = document.querySelector('.fc-popover');
            if (popover && popover.parentNode) {
                popover.parentNode.removeChild(popover);
            }
        }, 0);
    }, []);

    const handleDatesSet = useCallback((arg: DatesSetArg) => {
        setCurrentDate(arg.view.currentStart);
    }, []);

    const handlePrevMonth = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.prev();
    };

    const handleNextMonth = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.next();
    };

    const handleToday = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.today();
    };

    const handleSessionClick = (session: ClassSession) => {
        setSelectedSession(session);
        setShowDetailDialog(true);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-6 sm:pt-8 pb-8 sm:pb-12 px-3 sm:px-4">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                            Lịch học trực tuyến
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Đăng ký và tham gia các buổi học trực tuyến với giảng viên Khailingo
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom px-3 sm:px-4 py-4 sm:py-6 md:py-8 -mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Calendar - Main */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 hidden md:block"
                    >
                        <Card className="p-0 border-none gap-0">
                            <CardHeader className="pb-2">
                                {/* Calendar Navigation */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon-sm" onClick={handlePrevMonth} disabled={isLoading}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleToday}>
                                            Hôm nay
                                        </Button>
                                        <Button variant="outline" size="icon-sm" onClick={handleNextMonth} disabled={isLoading}>
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <h2 className="text-lg font-semibold text-center capitalize">
                                        {dayjs(currentDate).format("MMMM YYYY")}
                                    </h2>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="admin-calendar">
                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        locale="vi"
                                        firstDay={1}
                                        headerToolbar={false}
                                        events={calendarEvents}
                                        eventClick={handleEventClick}
                                        datesSet={handleDatesSet}
                                        eventContent={renderEventContent}
                                        height="auto"
                                        dayMaxEvents={3}
                                        moreLinkText={(num) => `+${num}`}
                                        fixedWeekCount={false}
                                        dayHeaderFormat={{ weekday: "short" }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Sidebar - Upcoming Sessions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 hidden sm:block"
                    >
                        <UpcomingSessions
                            onSessionClick={handleSessionClick}
                        />
                    </motion.div>
                </div>

                {/* Mobile Session List */}
                <div className="sm:hidden mt-4">
                    <ClassSessionCard
                        sessions={sessions}
                        isLoading={isLoading}
                        userRegistrations={userRegistrations}
                        onSessionClick={handleSessionClick}
                        currentDate={currentDate}
                        onPrevMonth={() =>
                            setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate())
                        }
                        onNextMonth={() =>
                            setCurrentDate(dayjs(currentDate).add(1, "month").toDate())
                        }
                    />

                </div>
            </div>

            {/* Detail Dialog */}
            {showDetailDialog &&
                <ClassSessionRegisterDialog
                    open={showDetailDialog}
                    onOpenChange={setShowDetailDialog}
                    session_id={selectedSession?._id || ""}
                />
            }
        </div>
    );
}
