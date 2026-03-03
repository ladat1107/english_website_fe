import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    Label,
    Input,
    Button,
} from "@/components/ui";
import { useUpdateProfile } from "@/hooks";
import { cn } from "@/utils";
import { Phone } from "lucide-react";
import { useState } from "react";

interface PhoneInputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (phone: string) => void;
    isLoading: boolean;
}

export function PhoneInputDialog({ open, onOpenChange, onSubmit, isLoading }: PhoneInputDialogProps) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const { mutate: updateProfile } = useUpdateProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate phone number (Vietnam format)
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
            setError("Số điện thoại không hợp lệ");
            return;
        }
        setError("");
        updateProfile({ phone }, {
            onSuccess: () => {
                onSubmit(phone);
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Cập nhật số điện thoại
                    </DialogTitle>
                    <DialogDescription>
                        Vui lòng cung cấp số điện thoại để đăng ký buổi học. Chúng tôi sẽ liên hệ khi cần thiết.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setError("");
                            }}
                            placeholder="0912 345 678"
                            className={cn(error && "border-destructive")}
                        />
                        {error && <p className="text-xs text-destructive">{error}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Xác nhận & Đăng ký
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}