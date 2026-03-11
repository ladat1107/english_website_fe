"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Users,
    Search,
    Trash2,
} from "lucide-react";
import {
    Button,
    Input,
    Card,
    Avatar,
    Pagination,
} from "@/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import LoadingCustom from "@/components/ui/loading-custom";
import { useConfirmDialogContext } from "@/components/ui/confirm-dialog-context";
import { useToast } from "@/components/ui/toaster";
import { useDebounce } from "@/hooks/use-debounce";

import { Pagination as PaginationType } from "@/types";
import dayjs from "dayjs";
import { useGetAllUsers, useUpdateUser } from "@/hooks";
import { UserParams, UserType } from "@/types/user.type";
import { getNameAvatar } from "@/utils/funtions";


const selectDateArr: { value: string; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "month", label: "Trong tháng" },
    { value: "week", label: "Trong tuần" },
    { value: "today", label: "Hôm nay" },
]

export default function AdminBookingTestManagementPage() {
    const router = useRouter();
    const { confirm } = useConfirmDialogContext();
    const { addToast } = useToast();

    // States
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectDate, setSelectDate] = useState<{ value: string; label: string }>(selectDateArr[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const searchDebounce = useDebounce(searchQuery, 300);

    const [params, setParams] = useState<UserParams>({
        page: 1,
        limit: 10,
        search: searchDebounce,
        booking_test: dayjs().subtract(3, "year").format("YYYY-MM-DD"),
    });

    // Queries
    const { data: usersRes, isLoading } = useGetAllUsers({
        ...params,
        search: searchDebounce,
    });
    const pagination: PaginationType = usersRes?.data?.pagination || {};

    const { mutate: updateUser } = useUpdateUser();

    useEffect(() => {
        if (usersRes) {
            setUsers(usersRes.data.items);
        }
    }, [usersRes]);

    const setFilter = (key: keyof UserParams, value: any) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            [key]: value,
        }));
    };


    // Handlers
    const handleView = (user: UserType) => {
        router.push(`/quan-ly/nguoi-dung/${user._id}`);
    };


    const handleDeleteClick = (user: UserType) => {
        confirm({
            title: "Xác nhận xóa lịch kiểm tra đầu vào",
            description: `Bạn có chắc chắn muốn xóa lịch kiểm tra đầu vào của "${user.full_name}" (${user.email}) không?`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                updateUser({ id: user._id, data: { booking_test: null } }, {
                    onSuccess: () => {
                        addToast("Xóa lịch kiểm tra đầu vào thành công", "success");
                    },
                    onError: () => {
                        addToast("Có lỗi xảy ra khi xóa lịch kiểm tra đầu vào", "error");
                    },
                });
            },
        });
    };

    const handlePageChange = (page: number) => {
        setParams((prev) => ({ ...prev, page }));
    };

    const handleChange = (key: keyof UserParams, value: any) => {
        if (key === "booking_test") {
            if (value === "all") {
                setFilter(key, dayjs().subtract(3, "year").format("YYYY-MM-DD"));
                setSelectDate(selectDateArr[0]);
            }
            else if (value === "month") {
                setFilter(key, dayjs().subtract(1, "month").format("YYYY-MM-DD"));
                setSelectDate(selectDateArr[1]);
            } else if (value === "week") {
                setFilter(key, dayjs().subtract(1, "week").format("YYYY-MM-DD"));
                setSelectDate(selectDateArr[2]);
            } else if (value === "today") {
                setFilter(key, dayjs().format("YYYY-MM-DD"));
                setSelectDate(selectDateArr[3]);
            }
        }
    }


    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground">
                                    Quản lý kiểm tra đầu vào
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm theo tên hoặc email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                            className="h-9"
                        />
                    </div>
                    <div className="w-36">
                        <Select
                            key={`select-booking-test-${selectDate.value}`} // Thêm key để reset Select khi params.booking_test thay đổi
                            value={selectDate.value}
                            onValueChange={(value) => handleChange("booking_test", value)
                            }
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {selectDateArr.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingCustom className="min-h-[300px]" />
                ) : users.length > 0 ? (
                    <Card className="overflow-hidden">
                        {/* Desktop Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Người dùng
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Điện thoại
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Ngày đăng ký
                                        </th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((user) => {
                                        return (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                                onClick={() => handleView(user)}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9">
                                                            {user.avatar_url ? (
                                                                <Image
                                                                    src={user.avatar_url}
                                                                    alt={user.full_name}
                                                                    width={36}
                                                                    height={36}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                                    <span className="text-primary font-semibold text-sm">
                                                                        {getNameAvatar(user.full_name)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-foreground text-sm">
                                                                {user.full_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {user?.phone || ""}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {dayjs(user.booking_test).format("DD/MM/YYYY HH:mm")}
                                                </td>
                                                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(user)}
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="border-t border-border px-4 py-3 bg-muted/30">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                variant="compact"
                                size="sm"
                            />
                        </div>
                    </Card>
                ) : (
                    <Card className="p-8 text-center">
                        <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                        <h3 className="font-semibold mb-1">Không tìm thấy người dùng đăng ký</h3>
                        <p className="text-sm text-muted-foreground">
                            Thử thay đổi bộ lọc để xem thêm kết quả
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
