import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Badge,
} from "@/components/ui";
import { ClassSession } from "@/types/class-session.type";
import { useToast } from "../ui/toaster";
import { useAuth } from "@/contexts";
import { useState } from "react";
import { useCancelRegistration, useGetClassSessionById, useRegisterForSession } from "@/hooks";
import dayjs from "dayjs";
import { RegistrationStatus } from "@/utils/constants/enum";
import { AlertCircle, CalendarCheck, CheckCircle2, Clock, Copy, LinkIcon, User, Users, Video, XCircle } from "lucide-react";
import { PhoneInputDialog } from "./phone-modal";
import Link from "next/link";
import { useConfirmDialogContext } from "../ui/confirm-dialog-context";

interface SessionDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session_id: string | null;
}

export function ClassSessionRegisterDialog({ open, onOpenChange, session_id }: SessionDetailDialogProps) {
    const { user, isAuthenticated, openAuthModal } = useAuth();
    const { addToast } = useToast();
    const { confirm } = useConfirmDialogContext();

    const [showPhoneDialog, setShowPhoneDialog] = useState(false);

    // Get registration status
    const { data: sessionRes, isLoading: isCheckingRegistration } = useGetClassSessionById(session_id || "");
    const session: ClassSession | undefined = sessionRes?.data;

    // Get participants count
    const participantCount = session?.participants?.length || 0;
    const userRegistration = session?.participants?.find(r => r.user?._id === user?._id);

    const { mutate: registerForSession, isPending: isRegistering } = useRegisterForSession();
    const { mutate: cancelRegistration, isPending: isCancelling } = useCancelRegistration();

    if (!session) return null;

    const isPast = dayjs(session.date).isBefore(dayjs(), "day");

    const getStatusInfo = () => {
        switch (userRegistration?.status) {
            case RegistrationStatus.REGISTERED:
                return { label: "Đã đăng ký", color: "#DCFCE7" as const, icon: CalendarCheck };
            case RegistrationStatus.ATTENDED:
                return { label: "Đã tham gia", color: "#DBEAFE" as const, icon: CheckCircle2 };
            case RegistrationStatus.ABSENT:
                return { label: "Vắng mặt", color: "#FEE2E2" as const, icon: XCircle };
            default:
                return { label: "Chưa đăng ký", color: "#FEF9C3" as const, icon: AlertCircle };
        }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    const handleRegister = () => {
        if (!isAuthenticated) {
            onOpenChange(false);
            openAuthModal();
            return;
        }

        // Check if user has phone number
        if (!user?.phone) {
            setShowPhoneDialog(true);
            return;
        }

        confirm({
            title: "Xác nhận đăng ký",
            description: "Bạn có chắc chắn muốn đăng ký tham gia buổi học này không?",
            onConfirm: () => {
                // Proceed with registration
                registerForSession(
                    { sessionId: session._id },
                    {
                        onSuccess: () => {
                            addToast("Đăng ký thành công! Vui lòng kiểm tra email.", "success");
                        },
                        onError: (error: any) => {
                            addToast(error.message || "Có lỗi xảy ra", "error");
                        },
                    }
                );
            }
        })

    };

    const handlePhoneSubmit = (_phone: string) => {
        // In real app, this would update user profile
        // For now, just proceed with registration
        setShowPhoneDialog(false);
        if (user) {
            registerForSession(
                { sessionId: session._id },
                {
                    onSuccess: () => {
                        addToast("Đăng ký thành công! Vui lòng kiểm tra email.", "success");
                    },
                    onError: (error: any) => {
                        addToast(error.message || "Có lỗi xảy ra", "error");
                    },
                }
            );
        }
    };

    const handleCancelRegistration = () => {
        if (!userRegistration) return;

        cancelRegistration(userRegistration._id, {
            onSuccess: () => {
                addToast("Đã hủy đăng ký", "success");
            },
            onError: () => {
                addToast("Có lỗi xảy ra", "error");
            },
        });
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent size="lg" className="flex flex-col max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg max-w-full">
                            <Video className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="truncate pe-8">{session.title}</span>
                        </DialogTitle>
                        <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                            <span>
                                {dayjs(session.date).format("dddd, DD/MM/YYYY")}
                            </span>
                            <Badge size="sm" className="flex-shrink-0" style={{ backgroundColor: statusInfo.color, color: "#0F172A" }}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {/* Session Info */}
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 space-y-3">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Thời gian</p>
                                        <p className="font-medium">
                                            {session.startTime} - {session.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Đã đăng ký</p>
                                        <p className="font-medium">{participantCount} học viên</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Giảng viên</p>
                                        <p className="font-medium">{session.mentor?.full_name || "Khailingo"}</p>
                                    </div>
                                </div>
                            </div>

                            {session.description && (
                                <div className="pt-2 border-t border-primary/10">
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{session.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Meeting Link - Only show if registered */}
                        {userRegistration && (
                            <div className="bg-card border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-sm">Link tham gia</span>
                                </div>
                                <div className="flex items-center justify-between min-w-0 max-w-full">
                                    <Link
                                        href={session.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline truncate"
                                    >
                                        {session.link.slice(0, 40) + (session.link.length > 50 ? "..." : "")}
                                    </Link>

                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(session.link);
                                            addToast("Đã sao chép link", "success");
                                        }}
                                        className="p-1 rounded-md hover:bg-muted transition outline-none"
                                    >
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Đóng
                        </Button>

                        {!isPast && (
                            <>
                                {userRegistration ? (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleCancelRegistration}
                                        isLoading={isCancelling}
                                        className="w-full sm:w-auto"
                                    >
                                        Hủy đăng ký
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        onClick={handleRegister}
                                        isLoading={isRegistering || isCheckingRegistration}
                                        className="w-full sm:w-auto"
                                    >
                                        <CalendarCheck className="w-4 h-4 mr-2" />
                                        Đăng ký tham gia
                                    </Button>
                                )}
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Phone Input Dialog */}
            {showPhoneDialog &&
                <PhoneInputDialog
                    open={showPhoneDialog}
                    onOpenChange={setShowPhoneDialog}
                    onSubmit={handlePhoneSubmit}
                    isLoading={isRegistering}
                />
            }

        </>
    );
}