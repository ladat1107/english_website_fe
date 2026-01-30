"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboardPage() {
    const stats = [
        {
            title: "Bài chờ chấm",
            value: "12",
            description: "Bài nộp cần duyệt",
            icon: AlertCircle,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
            href: "/quan-ly/giao-tiep/cham-bai",
        },
        {
            title: "Đã chấm hôm nay",
            value: "8",
            description: "Bài đã hoàn thành",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-100",
            href: "/quan-ly/giao-tiep/cham-bai",
        },
        {
            title: "Tổng học viên",
            value: "156",
            description: "Đang hoạt động",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            href: "/quan-ly/nguoi-dung",
        },
        {
            title: "Số đề giao tiếp",
            value: "24",
            description: "Đã xuất bản",
            icon: BookOpen,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            href: "/quan-ly/de-thi",
        },
    ];

    const recentSubmissions = [
        {
            id: "1",
            userName: "Nguyễn Văn An",
            examTitle: "Job Interview - Phỏng vấn xin việc",
            submittedAt: "2 giờ trước",
            status: "pending",
        },
        {
            id: "2",
            userName: "Trần Thị Bình",
            examTitle: "Ordering Food at a Restaurant",
            submittedAt: "3 giờ trước",
            status: "pending",
        },
        {
            id: "3",
            userName: "Lê Văn Cường",
            examTitle: "Asking for Directions",
            submittedAt: "5 giờ trước",
            status: "graded",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Tổng quan hệ thống quản lý</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </motion.div>

            {/* Recent Submissions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Bài nộp gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-primary font-medium">
                                                {submission.userName.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {submission.userName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {submission.examTitle}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            {submission.submittedAt}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${submission.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {submission.status === "pending" ? "Chờ chấm" : "Đã chấm"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/quan-ly/giao-tiep/cham-bai">
                            <div className="mt-4 text-center">
                                <span className="text-primary hover:underline text-sm font-medium">
                                    Xem tất cả bài nộp →
                                </span>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
