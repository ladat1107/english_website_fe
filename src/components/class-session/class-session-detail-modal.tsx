import { useGetClassSessionById } from "@/hooks";
import { ClassSession, Participant } from "@/types/class-session.type";
import { useToast } from "../ui/toaster";
import { RegistrationStatus } from "@/utils/constants/enum";
import dayjs from "dayjs";
import { Badge, Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";
import { CheckCircle, Copy, Edit, HelpCircle, Info, LinkIcon, Users, Video, XCircle } from "lucide-react";
import Link from "next/link";
import LoadingCustom from "../ui/loading-custom";
import { getNameAvatar } from "@/utils/funtions";
import { PATHS } from "@/utils/constants";
import { useRouter } from "next/navigation";


interface SessionDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session_id: string | null;
    onEdit: (session: ClassSession) => void;
}

export function SessionDetailDialog({ open, onOpenChange, session_id, onEdit }: SessionDetailDialogProps) {
    const router = useRouter();

    const { data: participantsRes, isLoading } = useGetClassSessionById(session_id || "");
    const session: ClassSession | null = participantsRes?.data || null;
    const participants: Participant[] = participantsRes?.data?.participants || [];


    const { addToast } = useToast();

    if (!session) return null;

    const isPast = dayjs(session.date).isBefore(dayjs(), "day");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="lg" className="flex flex-col max-h-[90vh] min-h-[65vh] pe-0">
                <DialogHeader className="truncate pe-4">
                    <DialogTitle className="flex items-center gap-2 text-lg ">
                        <Video className="flex-shrink-0 w-5 h-5 text-primary" />
                        <span className="truncate pe-8" title={session.title}>
                            {session.title}
                        </span>
                    </DialogTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground gap-2">
                        <span>
                            {dayjs(session.date).format("dddd, DD/MM/YYYY")} | {session.startTime} - {session.endTime}
                        </span>
                        <Badge variant={isPast ? "secondary" : "success"} size="sm">
                            {isPast ? "Đã kết thúc" : "Sắp diễn ra"}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 mt-2 overflow-y-auto pe-4">
                    {/* Session Info */}
                    <div className={`bg-muted/50 rounded-lg space-y-3 px-3`}>
                        {/* Info icon + Description */}
                        {session.description && (
                            <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-muted-foreground mt-0.5" />
                                <p className="text-sm text-muted-foreground">{session.description}</p>
                            </div>
                        )}

                        {/* Link + Copy */}
                        <div className="flex items-center justify-between gap-2 max-w-full">
                            <div className="flex items-center gap-2 min-w-0">
                                <LinkIcon className="w-3 h-3 text-muted-foreground" />

                                <Link
                                    href={session.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline truncate"
                                >
                                    {session.link}
                                </Link>
                            </div>

                            {/* Copy button */}
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

                    {/* Participants */}
                    <div className={`mt-3`}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Học viên đăng ký ({participants.length})
                            </h4>
                        </div>

                        {/* Đang tải */}
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <LoadingCustom />
                            </div>
                        ) : participants.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Chưa có học viên đăng ký
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {participants.map((participant) => (
                                    <div
                                        key={participant._id}
                                        className="flex items-center justify-between p-3 bg-card border rounded-lg"
                                    >
                                        {/* Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-xs font-medium text-primary">
                                                    {getNameAvatar(participant.user?.full_name || "?")}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium">
                                                    {participant.user?.full_name || "Unknown"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {participant.user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {participant.status === RegistrationStatus.ATTENDED ? (
                                                <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Có mặt
                                                </div>
                                            ) : participant.status === RegistrationStatus.ABSENT ? (
                                                <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                                                    <XCircle className="w-3 h-3" />
                                                    Vắng mặt
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-muted-foreground bg-muted/40 px-2 py-1 rounded-full text-xs font-medium">
                                                    <HelpCircle className="w-3 h-3" />
                                                    Chưa điểm danh
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className={` mt-2 flex-col sm:flex-row gap-2 pe-4`}>
                    <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Đóng
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {!isPast &&
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false);
                                    onEdit(session);
                                }}
                                className="flex-1"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Sửa
                            </Button>
                        }

                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                router.push(PATHS.ADMIN.CLASS_SESSION_DETAIL(session._id));
                            }}
                            className="flex-1"
                        >
                            <Info className="w-4 h-4 mr-1" />
                            Chi tiết
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}