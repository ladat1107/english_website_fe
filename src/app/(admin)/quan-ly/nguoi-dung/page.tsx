/**
 * Khailingo - Admin User Management Page
 * Trang quản lý danh sách người dùng (Admin) - Table View
 */

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Users,
    Search,
    Filter,
    ChevronDown,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    UserCheck,
    GraduationCap,
    Shield,
} from "lucide-react";
import {
    Button,
    Input,
    Card,
    Badge,
    Avatar,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
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
import { cn } from "@/utils/cn";
import { UserRole, ProficiencyLevel } from "@/utils/constants/enum";
import { useDebounce } from "@/hooks/use-debounce";

import { Pagination as PaginationType } from "@/types";
import dayjs from "dayjs";
import { useDeleteUser, useGetAllUsers } from "@/hooks";
import { StatisticsRoleUser, UserParams, UserType } from "@/types/user.type";
import { getNameAvatar } from "@/utils/funtions";
import { levelOptions, roleOptions } from "@/utils/constants/select";

const getRoleBadge = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return { variant: "destructive" as const, label: "Admin", icon: Shield, color: "text-red-600 bg-red-50" };
        case UserRole.TEACHER:
            return { variant: "info" as const, label: "Giáo viên", icon: GraduationCap, color: "text-blue-600 bg-blue-50" };
        default:
            return { variant: "secondary" as const, label: "Học viên", icon: UserCheck, color: "text-gray-600 bg-gray-50" };
    }
};

const getLevelBadge = (level?: ProficiencyLevel) => {
    if (!level) return "";
    const colors: Record<ProficiencyLevel, string> = {
        [ProficiencyLevel.BEGINNER]: "bg-green-100 text-green-700",
        [ProficiencyLevel.ELEMENTARY]: "bg-yellow-100 text-yellow-700",
        [ProficiencyLevel.INTERMEDIATE]: "bg-blue-100 text-blue-700",
        [ProficiencyLevel.UPPER_INTERMEDIATE]: "bg-purple-100 text-purple-700",
        [ProficiencyLevel.ADVANCED]: "bg-orange-100 text-orange-700",
    };
    return colors[level] || "";
};

// =====================================================
// USER TABLE ROW - MOBILE
// =====================================================
interface UserRowMobileProps {
    user: UserType;
    onView: (user: UserType) => void;
    onEdit: (user: UserType) => void;
    onDelete: (user: UserType) => void;
}

function UserRowMobile({ user, onView, onEdit, onDelete }: UserRowMobileProps) {
    const roleInfo = getRoleBadge(user.role );

    return (
        <div className="p-3 border-b border-border last:border-0 hover:bg-muted/50">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                    {user.avatar_url ? (
                        <Image
                            src={user.avatar_url}
                            alt={user.full_name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                                {getNameAvatar(user.full_name)}
                            </span>
                        </div>
                    )}
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant={roleInfo.variant} size="sm">
                    {roleInfo.label}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function AdminUserManagementPage() {
    const router = useRouter();
    const { confirm } = useConfirmDialogContext();
    const { addToast } = useToast();

    // States
    const [users, setUsers] = useState<UserType[]>([]);
    const [statistics, setStatistics] = useState<StatisticsRoleUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const searchDebounce = useDebounce(searchQuery, 300);

    const [params, setParams] = useState<UserParams>({
        page: 1,
        limit: 10,
        search: searchDebounce,
        role: undefined,
        current_level: undefined,
    });

    // Queries
    const { data: usersRes, isLoading } = useGetAllUsers({
        ...params,
        search: searchDebounce,
    });
    const pagination: PaginationType = usersRes?.data?.pagination || {};

    const { mutate: deleteUser } = useDeleteUser();

    useEffect(() => {
        if (usersRes) {
            setUsers(usersRes.data.items);
            setStatistics(usersRes.data.statistics);
        }
    }, [usersRes]);

    const setFilter = (key: keyof UserParams, value: any) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            [key]: value,
        }));
    };

    // Stats
    const stats = useMemo(() => ({
        total: pagination.totalItems,
        students: statistics?.find(s => s.role === UserRole.STUDENT)?.count || 0,
        teachers: statistics?.find(s => s.role === UserRole.TEACHER)?.count || 0,
        admins: statistics?.find(s => s.role === UserRole.ADMIN)?.count || 0,
    }), [pagination.totalItems, statistics]);

    // Handlers
    const handleView = (user: UserType) => {
        router.push(`/quan-ly/nguoi-dung/${user._id}`);
    };

    const handleEdit = (user: UserType) => {
        router.push(`/quan-ly/nguoi-dung/chinh-sua/${user._id}`);
    };

    const handleDeleteClick = (user: UserType) => {
        confirm({
            title: "Xác nhận xóa tài khoản",
            description: `Bạn có chắc chắn muốn xóa tài khoản "${user.full_name}" (${user.email}) không?`,
            confirmText: "Xóa",
            cancelText: "Hủy",
            onConfirm: () => {
                deleteUser(user._id, {
                    onSuccess: () => {
                        addToast("Xóa tài khoản thành công", "success");
                    },
                    onError: () => {
                        addToast("Có lỗi xảy ra khi xóa tài khoản", "error");
                    },
                });
            },
        });
    };

    const handlePageChange = (page: number) => {
        setParams((prev) => ({ ...prev, page }));
    };

    const clearFilters = () => {
        setSearchQuery("");
        setParams({
            page: 1,
            limit: 10,
            search: "",
            role: undefined,
            current_level: undefined,
        });
    };

    const hasActiveFilters = searchQuery || params.role || params.current_level;

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
                                    Quản lý người dùng
                                </h1>
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    {stats.total} người dùng
                                </p>
                            </div>
                        </div>
                        {/* Stats inline for desktop */}
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-muted-foreground">{stats.students} học viên</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-muted-foreground">{stats.teachers} giáo viên</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-muted-foreground">{stats.admins} admin</span>
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
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="gap-2 h-9"
                        >
                            <Filter className="w-4 h-4" />
                            Lọc
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                            )}
                            <ChevronDown
                                className={cn(
                                    "w-3 h-3 transition-transform",
                                    showFilterDropdown && "rotate-180"
                                )}
                            />
                        </Button>

                        <AnimatePresence>
                            {showFilterDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-3 z-20"
                                >
                                    <div className="mb-3">
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                                            Vai trò
                                        </label>
                                        <Select
                                            value={params.role ?? "all"}
                                            onValueChange={(value) =>
                                                setFilter("role", value === "all" ? undefined : value)
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {roleOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">
                                            Trình độ
                                        </label>
                                        <Select
                                            value={params.current_level ?? "all"}
                                            onValueChange={(value) =>
                                                setFilter("current_level", value === "all" ? undefined : value)
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Tất cả" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                {levelOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="w-full h-8 text-xs"
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {searchQuery && (
                            <Badge variant="secondary" size="sm" className="gap-1 pr-1">
                                &quot;{searchQuery}&quot;
                                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                        )}
                        {params.role && (
                            <Badge variant="secondary" size="sm" className="gap-1 pr-1">
                                {roleOptions.find((r) => r.value === params.role)?.label}
                                <button onClick={() => setFilter("role", undefined)} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                        )}
                        {params.current_level && (
                            <Badge variant="secondary" size="sm" className="gap-1 pr-1">
                                {levelOptions.find((l) => l.value === params.current_level)?.label}
                                <button onClick={() => setFilter("current_level", undefined)} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                        )}
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <LoadingCustom className="min-h-[300px]" />
                ) : users.length > 0 ? (
                    <Card className="overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Người dùng
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Trình độ
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Ngày tham gia
                                        </th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((user) => {
                                        const roleInfo = getRoleBadge(user.role);
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
                                                <td className="py-3 px-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                                                        roleInfo.color
                                                    )}>
                                                        <roleInfo.icon className="w-3 h-3" />
                                                        {roleInfo.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {user.current_level ? (
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-md text-xs font-medium",
                                                            getLevelBadge(user.current_level)
                                                        )}>
                                                            {user.current_level}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {dayjs(user.createdAt).format("DD/MM/YYYY")}
                                                </td>
                                                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleView(user)}
                                                            className="h-8 w-8 p-0"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(user)}
                                                            className="h-8 w-8 p-0"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
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

                        {/* Mobile List */}
                        <div className="md:hidden">
                            {users.map((user) => (
                                <UserRowMobile
                                    key={user._id}
                                    user={user}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
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
                        <h3 className="font-semibold mb-1">Không tìm thấy người dùng</h3>
                        <p className="text-sm text-muted-foreground">
                            Thử thay đổi bộ lọc để xem thêm kết quả
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
