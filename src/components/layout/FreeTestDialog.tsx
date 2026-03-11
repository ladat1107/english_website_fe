"use client";

import { useState } from "react";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import envConfig from "@/utils/env-config";
import { useUpdateBookingTest } from "@/hooks";
import { useToast } from "../ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constants/querykey";
import { Loader2 } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function FreeLevelTestDialog({
    open,
    onOpenChange,
}: Props) {
    const [phone, setPhone] = useState("");
    const { mutate: updateBookingTest, isPending: isUpdating } = useUpdateBookingTest();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const handleSubmit = (title: string) => {
        if (title === "Tham gia nhóm Zalo") {
            window.open(envConfig.NEXT_PUBLIC_ZALO_GROUP_URL, "_blank");
        } else if (title === "Chat Zalo tư vấn") {
            window.open(envConfig.NEXT_PUBLIC_ZALO_URL, "_blank");
        } else if (title === "Để lại số điện thoại") {
            if (!phone) {
                addToast("Vui lòng nhập số điện thoại", "error");
                return;
            }
            updateBookingTest({ phone }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.auth.checkStatus] });
                    addToast("Cảm ơn bạn đã để lại số điện thoại! Chúng tôi sẽ liên hệ sớm nhất!", "success");
                    onOpenChange(false);
                }
            });
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl p-6">

                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold">
                        🎁 Kiểm tra trình độ miễn phí
                    </DialogTitle>

                    <p className="text-sm text-gray-600">
                        Tiếng Anh & Tiếng Trung
                    </p>

                    <p className="text-xs text-gray-500">
                        Nhận đánh giá trình độ và lộ trình học phù hợp
                    </p>
                </DialogHeader>

                <div className="space-y-4 mt-6">

                    <OptionCard
                        icon="/image/group_zalo.png"
                        title="Tham gia nhóm Zalo"
                        desc="Nhận lịch kiểm tra miễn phí mỗi tuần"
                        button="Vào nhóm"
                        onClick={handleSubmit}
                    />

                    <OptionCard
                        icon="/image/zalo.png"
                        title="Chat Zalo tư vấn"
                        desc="Giáo viên tư vấn lộ trình học"
                        button="Chat ngay"
                        onClick={handleSubmit}
                    />

                    <div className="border rounded-xl p-4">

                        <div className="flex items-center gap-3 mb-3">

                            <Image
                                src="/image/pngegg.png"
                                alt="phone"
                                width={48}
                                height={48}
                            />

                            <div>
                                <h3 className="font-semibold text-sm">
                                    Để lại số điện thoại
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Chúng tôi sẽ liên hệ đặt lịch kiểm tra
                                </p>
                            </div>

                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            <Button onClick={() => handleSubmit("Để lại số điện thoại")}>
                                {isUpdating && <Loader2 className="animate-spin mr-2" />}
                                Gửi
                            </Button>
                        </div>

                    </div>

                </div>

                <p className="text-center text-xs text-gray-500 mt-4">
                    ✔ 100% miễn phí • ✔ Không bắt buộc đăng ký khóa học
                </p>

            </DialogContent>
        </Dialog>
    );
}

type OptionProps = {
    icon: string;
    title: string;
    desc: string;
    button: string;
    onClick?: (title: string) => void;
};

function OptionCard({
    icon,
    title,
    desc,
    button,
    onClick,
}: OptionProps) {
    return (
        <div className="flex items-center gap-4 border rounded-xl p-4 hover:shadow-md transition">

            <Image
                src={icon}
                alt={title}
                width={56}
                height={56}
            />

            <div className="flex-1">

                <h3 className="font-semibold text-sm">
                    {title}
                </h3>

                <p className="text-xs text-gray-500">
                    {desc}
                </p>

            </div>

            <Button size="sm" onClick={() => onClick && onClick(title)}>
                {button}
            </Button>

        </div>
    );
}