/**
 * Khailingo - Admin Session Detail Page
 * Trang chi tiết buổi học (Admin) - Quản lý học viên và điểm danh
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    Video,
    Edit,
    Trash2,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Mail,
    Phone,
    ClipboardCheck,
} from "lucide-react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import LoadingCustom from "@/components/ui/loading-custom";
import { useConfirmDialogContext } from "@/components/ui/confirm-dialog-context";
import { useToast } from "@/components/ui/toaster";
import { cn } from "@/utils/cn";
import {
    useGetClassSessionById,
    useDeleteClassSession,
    useUpdateParticipant,
} from "@/hooks/use-class-session";
import { Participant } from "@/types/class-session.type";
import { RegistrationStatus } from "@/utils/constants/enum";
import { PATHS } from "@/utils/constants";
import { SessionDialog } from "@/components/class-session/class-session-modal";

dayjs.locale("vi");

interface ParticipantCardProps {
    participant: Participant;
    onStatusChange: (participantId: string, status: RegistrationStatus) => void;
    isRegisterMode: boolean;
}

function ParticipantCard({
    participant,
    onStatusChange,
    isRegisterMode,
}: ParticipantCardProps) {
    const getStatusInfo = (status: RegistrationStatus) => {
        switch (status) {
            case RegistrationStatus.REGISTERED:
                return { label: "Đã đăng ký", color: "bg-blue-100 text-blue-700", icon: AlertCircle };
            case RegistrationStatus.ATTENDED:
                return { label: "Có mặt", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 };
            case RegistrationStatus.ABSENT:
                return { label: "Vắng", color: "bg-red-100 text-red-700", icon: XCircle };
        }
    };

    const statusInfo = getStatusInfo(participant.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-row md:items-center md:justify-between gap-4">

            {/* LEFT: Avatar + info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">
                        {participant.user?.full_name || "Người dùng"}
                    </p>

                    <p className="text-xs text-muted-foreground truncate max-w-[180px] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {participant.user?.email}
                    </p>

                    {participant.user?.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {participant.user.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* RIGHT: Status + buttons */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                {isRegisterMode ? (
                    <div className="flex flex-col gap-1 md:flex-row md:gap-2">
                        <Button
                            className={cn(
                                "h-8 px-3 text-xs flex items-center gap-1 border-emerald-500 text-emerald-700",
                                participant.status === RegistrationStatus.ATTENDED
                                    ? "bg-emerald-600 text-white hover:bg-emerald-600"
                                    : "bg-transparent hover:bg-emerald-50"
                            )}
                            disabled={participant.status === RegistrationStatus.ATTENDED}
                            onClick={() =>
                                onStatusChange(participant._id, RegistrationStatus.ATTENDED)
                            }
                        >
                            {participant.status === RegistrationStatus.ATTENDED && <CheckCircle2 className="block w-3 h-3 md:w-4 md:h-4" />}
                            <span>Có mặt</span>
                        </Button>

                        <Button
                            className={cn(
                                "h-8 px-3 text-xs flex items-center gap-1 border-red-500 text-red-700",
                                participant.status === RegistrationStatus.ABSENT
                                    ? "bg-red-600 text-white hover:bg-red-600"
                                    : "bg-transparent hover:bg-red-50"
                            )}
                            disabled={participant.status === RegistrationStatus.ABSENT}
                            onClick={() => onStatusChange(participant._id, RegistrationStatus.ABSENT)}
                        >
                            {participant.status === RegistrationStatus.ABSENT && <CheckCircle2 className="block w-3 h-3 md:w-4 md:h-4" />}
                            <span>Vắng</span>
                        </Button>
                    </div>
                ) :
                    <span
                        className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                            statusInfo.color
                        )}
                    >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                    </span>
                }
            </div>
        </div>
    );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function AdminSessionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const { confirm } = useConfirmDialogContext();
    const { addToast } = useToast();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false); // false = xem danh sách, true = điểm danh

    // Queries
    const { data: sessionRes, isLoading, refetch } = useGetClassSessionById(sessionId);
    const { mutate: deleteSession } = useDeleteClassSession();
    const { mutate: updateParticipantStatus } = useUpdateParticipant();

    const session = sessionRes?.data;
    const participants: Participant[] = sessionRes?.data?.participants || [];

    const handleBack = () => {
        router.push(PATHS.ADMIN.CLASS_SCHEDULE);
    };

    const handleDelete = () => {
        if (!session) return;

        confirm({
            title: "Xác nhận xóa buổi học",
            description: `Bạn có chắc chắn muốn xóa buổi học "${session.title}"?`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                deleteSession(session._id, {
                    onSuccess: () => {
                        addToast("Xóa buổi học thành công", "success");
                        router.push(PATHS.ADMIN.CLASS_SCHEDULE);
                    }
                });
            },
        });
    };

    const handleStatusChange = (participantId: string, status: RegistrationStatus) => {
        const participant = participants.find((p) => p._id === participantId)?.status || null;
        if (participant === status) return;
        updateParticipantStatus(
            { participantId, status },
            {
                onSuccess: () => {
                    addToast("Điểm danh thành công", "success");
                },

            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingCustom />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold">Không tìm thấy buổi học</h2>
                <p className="text-muted-foreground mt-2">Buổi học có thể đã bị xóa hoặc không tồn tại.</p>
                <Button onClick={handleBack} className="mt-4">
                    Quay lại
                </Button>
            </div>
        );
    }

    // Stats
    const attendedCount = participants?.filter((p) => p.status === RegistrationStatus.ATTENDED).length || 0;
    const absentCount = participants?.filter((p) => p.status === RegistrationStatus.ABSENT).length || 0;
    const registeredCount = participants?.filter((p) => p.status === RegistrationStatus.REGISTERED).length || 0;

    return (
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
            >
                <Button variant="ghost" size="icon-sm" onClick={handleBack} className="mt-1 flex-shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 min-w-0">

                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">{session.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {dayjs(session.date).format("dddd, DD/MM/YYYY")} | {session.startTime} - {session.endTime}
                    </p>
                </div>
            </motion.div>

            {/* Session Info Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Thông tin buổi học
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Sửa
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Xóa
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Thời gian</p>
                                    <p className="font-medium">
                                        {session.startTime} - {session.endTime}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Video className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-muted-foreground">Link tham gia</p>
                                    <a
                                        href={session.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm truncate block"
                                    >
                                        {session.link}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {session.description && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
                                <p className="text-sm">{session.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Attendance Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="grid grid-cols-3 gap-3">
                    <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{registeredCount}</div>
                        <p className="text-xs text-muted-foreground">Đăng ký</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{attendedCount}</div>
                        <p className="text-xs text-muted-foreground">Có mặt</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                        <p className="text-xs text-muted-foreground">Vắng mặt</p>
                    </Card>
                </div>
            </motion.div>

            {/* Participants List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-none p-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-muted-foreground" />

                            <div className="flex items-baseline gap-2 text-primary">
                                <CardTitle className="text-lg font-semibold">
                                    Danh sách học viên
                                </CardTitle>

                                <span className="text-sm text-muted-foreground">
                                    ({participants.length})
                                </span>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <Button
                            size="sm"
                            variant={isRegisterMode ? "secondary" : "success"}
                            onClick={() => setIsRegisterMode(!isRegisterMode)}
                        >
                            {!isRegisterMode && <ClipboardCheck className="w-4 h-4" />}
                            {isRegisterMode ? "Thoát điểm danh" : "Điểm danh"}
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {participants.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                                <p className="text-muted-foreground">Chưa có học viên đăng ký</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {participants.map((participant) => (
                                    <ParticipantCard
                                        key={participant._id}
                                        participant={participant}
                                        onStatusChange={handleStatusChange}
                                        isRegisterMode={isRegisterMode}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Edit Dialog */}
            {session && (
                <SessionDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    selectedDate={session.date}
                    editSession={session}
                    onSuccess={refetch}
                />
            )}
        </div>
    );
}
