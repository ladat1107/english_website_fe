import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Pin, FileText } from "lucide-react";
import { WritingAnswer } from "@/types/writing.type";
import { UserType } from "@/types/user.type";
import { getNameAvatar } from "@/utils/funtions";
import dayjs from "dayjs";

interface PinnedAnswerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    answer: WritingAnswer | null;
}

export function PinnedAnswerModal({ open, onOpenChange, answer }: PinnedAnswerModalProps) {
    if (!answer) return null;

    const user = answer.user as UserType;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0" showCloseButton={false}>
                {/* HEADER */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                            <AvatarFallback>{getNameAvatar(user?.full_name || "U")}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user?.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                                {dayjs(answer.submitted_at).format("DD/MM/YYYY HH:mm")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {answer.score > 0 && (
                            <Badge variant="success">{answer.score} điểm</Badge>
                        )}
                        <button
                            className="border-none outline-none"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Pin className="w-4 h-4 text-amber-500" />
                        Bài viết mẫu
                    </h4>

                    <div className="prose prose-sm max-w-none text-justify">
                        <p className="whitespace-pre-wrap">{answer.answer}</p>
                    </div>

                    {/* FILES */}
                    {answer?.files && answer?.files?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Tệp đính kèm:</p>
                            <div className="flex flex-wrap gap-2">
                                {answer.files.map((file, idx) => (
                                    <a
                                        key={idx}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <FileText className="w-4 h-4" />
                                        {file.name || `Tệp ${idx + 1}`}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TEACHER FEEDBACK */}
                    {answer.teacher_feedback && (
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm font-medium text-emerald-700 mb-1">
                                Nhận xét giáo viên:
                            </p>
                            <p className="text-sm text-emerald-800">
                                {answer.teacher_feedback}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}