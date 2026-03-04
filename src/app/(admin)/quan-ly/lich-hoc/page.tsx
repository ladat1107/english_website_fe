"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DatesSetArg, EventContentArg, EventClickArg } from "@fullcalendar/core";
import dayjs from "dayjs";
import {
    Plus,
    Clock,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui";

import {
    useGetClassSessions,
} from "@/hooks/use-class-session";
import { ClassSession, CalendarEvent } from "@/types/class-session.type";
import "./lich-hoc.css"; // Custom styles for calendar
import { cn } from "@/utils";
import { SessionDetailDialog } from "@/components/class-session/class-session-detail-modal";
import { SessionDialog } from "@/components/class-session/class-session-modal";
import { pastelForRedTheme } from "@/utils/constants/ui";


function renderEventContent(eventInfo: EventContentArg) {
    const { session, participantCount } = eventInfo.event.extendedProps;
    return (
        <div className={cn("px-1.5 py-1 text-xs truncate cursor-pointer group w-full rounded-sm")}
            style={{ background: eventInfo.backgroundColor, color: "black", borderColor: 'transparent' }}>
            <div className="font-medium truncate">{eventInfo.event.title}</div>
            <div className="flex items-center gap-1 text-[9px] opacity-80">
                <Clock className="w-2.5 h-2.5" />
                {session.startTime}{session.endTime && ` - ${session.endTime}`}
                {participantCount !== undefined && (
                    <>
                        <span className="mx-1"></span>
                        <Users className="w-2.5 h-2.5" />
                        {participantCount}
                    </>
                )}
            </div>
        </div>
    );
}

export default function AdminClassSchedulePage() {
    // Ref để thao tác trực tiếp với FullCalendar API
    const calendarRef = useRef<FullCalendar>(null);

    // States quản lý UI và data
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
    const [editSession, setEditSession] = useState<ClassSession | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    // Tính toán range để fetch data - mở rộng để bao gồm cả các tháng trước và sau
    // Điều này giúp calendar hoạt động mượt mà khi chuyển tháng
    const dateRange = useMemo(() => {
        // Mở rộng range để fetch data cho 3 tháng: trước, hiện tại, sau
        const start = dayjs(currentDate).subtract(1, 'month').startOf("month");
        const end = dayjs(currentDate).add(1, 'month').endOf("month");
        return {
            startDate: start.format("YYYY-MM-DD"),
            endDate: end.format("YYYY-MM-DD"),
        };
    }, [currentDate]);

    // Queries
    const { data: sessionsRes, isLoading, refetch } = useGetClassSessions(dateRange);

    const sessions: ClassSession[] = useMemo(() => sessionsRes?.data ?? [],
        [sessionsRes?.data]);

    // Transform sessions to calendar events
    const calendarEvents: CalendarEvent[] = useMemo(() => {
        return sessions.map((session) => {
            // Fix date format - ensure we get YYYY-MM-DD format only
            const dateOnly = dayjs(session.date).format("YYYY-MM-DD");

            const startDateTime = `${dateOnly}T${session.startTime}`;
            const endDateTime = `${dateOnly}T${session.endTime}`;

            const randomColor = pastelForRedTheme[session.title.length % pastelForRedTheme.length];

            return {
                id: session._id,
                title: session.title,
                start: startDateTime,
                end: endDateTime,
                extendedProps: {
                    session,
                    participantCount: session.participants?.length || undefined, // Could add participant count here
                },
                backgroundColor: randomColor,
            };
        });
    }, [sessions]);

    // Event Handlers với comment giải thích

    /**
     * Xử lý khi user click vào một ngày trên calendar
     * DateClickArg properties:
     * - date: Date object của ngày được click
     * - dateStr: String format YYYY-MM-DD
     * - allDay: Boolean cho biết có phải cả ngày không
     * - resource: Resource nếu có
     * - dayEl: DOM element của ngày
     * - jsEvent: DOM click event
     * - view: Current view object
     */
    const handleDateClick = useCallback((arg: DateClickArg) => {
        setSelectedDate(arg.dateStr);
        setEditSession(null);
        setShowCreateDialog(true);
    }, []);

    /**
     * Xử lý khi user click vào một event
     * EventClickArg properties:
     * - event: Event object chứa thông tin về event
     * - el: DOM element của event
     * - jsEvent: DOM click event
     * - view: Current view object
     */
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
        const newDate = arg.view.currentStart;
        const currentMonth = dayjs(currentDate).format('YYYY-MM');
        const newMonth = dayjs(newDate).format('YYYY-MM');

        if (currentMonth !== newMonth) {
            setCurrentDate(newDate);
        }
    }, [currentDate]);

    /**
     * Navigation handlers - sử dụng FullCalendar API để điều hướng
     * FullCalendar sẽ tự động trigger handleDatesSet sau khi navigation
     */
    const handlePrevMonth = useCallback(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.prev();
            // FullCalendar sẽ tự call handleDatesSet để update currentDate
        }
    }, []);

    const handleNextMonth = useCallback(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.next();
            // FullCalendar sẽ tự call handleDatesSet để update currentDate
        }
    }, []);

    const handleToday = useCallback(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.today();
            // FullCalendar sẽ tự call handleDatesSet để update currentDate
        }
    }, []);

    const handleEditSession = (session: ClassSession) => {
        setEditSession(session);
        setSelectedDate(session.date);
        setShowCreateDialog(true);
    };
  
    const handleSessionDetailChange = (open: boolean) => {
        if (!open) {
            setSelectedSession(null);
        }
        setShowDetailDialog(open);
    }

    return (
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Quản lý Lịch học</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tạo và quản lý các buổi học trực tuyến
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedDate(dayjs().format("YYYY-MM-DD"));
                        setEditSession(null);
                        setShowCreateDialog(true);
                    }}
                    className="w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo buổi học
                </Button>
            </motion.div>

            {/* Calendar Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader className="pb-0">
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
                            <h2 className="text-lg font-semibold text-center">
                                {dayjs(currentDate).format("MMMM YYYY")}
                            </h2>

                        </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <div className="admin-calendar">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[
                                    dayGridPlugin,    // Plugin cho month view (grid layout)
                                    interactionPlugin // Plugin cho date/event click interactions
                                ]}

                                initialView="dayGridMonth"        // View ban đầu: month grid
                                locale="vi"                       // Ngôn ngữ tiếng Việt
                                firstDay={1}                      // Tuần bắt đầu từ thứ 2 (0=CN, 1=T2)

                                headerToolbar={false}             // Tắt toolbar mặc định (dùng custom header)

                                events={calendarEvents}           // Array các events cần hiển thị
                                eventContent={renderEventContent} // Custom render function cho events

                                dateClick={handleDateClick}       // Handler khi click vào ngày
                                eventClick={handleEventClick}     // Handler khi click vào event
                                datesSet={handleDatesSet}         // Handler khi date range thay đổi

                                height="auto"                     // Tự động điều chỉnh chiều cao
                                dayMaxEvents={3}
                                // Tối đa 3 events hiển thị per day
                                moreLinkText={(num) => `+${num} buổi`} // Text cho "more" link
                                fixedWeekCount={false}            // Không fix số tuần (tự động theo tháng)
                                dayHeaderFormat={{ weekday: "short" }} // Format header ngày: T2, T3...

                                validRange={{
                                    start: '2020-01-01',         // Cho phép navigation từ 2020
                                    end: '2030-12-31'             // Đến 2030 (có thể điều chỉnh)
                                }}
                            />
                        </div>

                    </CardContent>
                </Card>
            </motion.div>

            {/* Create/Edit Dialog */}
            {showCreateDialog &&
                <SessionDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    selectedDate={selectedDate}
                    editSession={editSession}
                    onSuccess={refetch}
                />
            }


            {/* Detail Dialog */}
            {selectedSession &&
                <SessionDetailDialog
                    open={showDetailDialog}
                    onOpenChange={handleSessionDetailChange}
                    session_id={selectedSession?._id || null}
                    onEdit={handleEditSession}
                />
            }
        </div>
    );
}
