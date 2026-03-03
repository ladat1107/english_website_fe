import { ClassSession, CreateClassSessionDto } from "@/types/class-session.type";
import { useToast } from "../ui/toaster";
import { useCreateClassSession, useUpdateClassSession } from "@/hooks";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Textarea } from "@/components/ui";
import { Calendar } from "lucide-react";
import { Label } from "../ui/label";

interface SessionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate: string | null;
    editSession?: ClassSession | null;
    onSuccess: () => void;
}

export function SessionDialog({ open, onOpenChange, selectedDate, editSession, onSuccess }: SessionDialogProps) {
    const { addToast } = useToast();
    const { mutate: createSession, isPending: isCreating } = useCreateClassSession();
    const { mutate: updateSession, isPending: isUpdating } = useUpdateClassSession();

    const [formData, setFormData] = useState<CreateClassSessionDto>({
        title: "",
        description: "",
        link: "",
        date: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        if (editSession) {
            setFormData({
                title: editSession.title,
                description: editSession.description || "",
                link: editSession.link,
                date: editSession.date ? dayjs(editSession.date).format("YYYY-MM-DD") : "",
                startTime: editSession.startTime,
                endTime: editSession.endTime,
            });
        } else if (selectedDate) {
            setFormData({
                title: "",
                description: "",
                link: "",
                date: selectedDate,
                startTime: "19:00",
                endTime: "20:30",
            });
        }
    }, [editSession, selectedDate, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.link || !formData.date || !formData.startTime || !formData.endTime) {
            addToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        if (editSession) {
            updateSession(
                { id: editSession._id, data: formData },
                {
                    onSuccess: () => {
                        addToast("Cập nhật buổi học thành công", "success");
                        onOpenChange(false);
                        onSuccess();
                    }
                }
            );
        } else {
            createSession(formData, {
                onSuccess: () => {
                    addToast("Tạo buổi học thành công", "success");
                    onOpenChange(false);
                    onSuccess();
                }
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="lg" className="flex max-h-[90vh] flex-col pe-0">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {editSession ? "Chỉnh sửa buổi học" : "Tạo buổi học mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {editSession
                            ? "Cập nhật thông tin buổi học"
                            : `Tạo buổi học cho ngày ${selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}`}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto pe-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề buổi học *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="VD: IELTS Speaking Practice"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Mô tả chi tiết buổi học..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link">Link tham gia *</Label>
                        <Input
                            id="link"
                            value={formData.link}
                            onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                            placeholder="https://zoom.us/j/..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="date">Ngày *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Giờ bắt đầu *</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">Giờ kết thúc *</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={isCreating || isUpdating}>
                            {editSession ? "Cập nhật" : "Tạo buổi học"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}