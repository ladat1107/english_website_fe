/**
 * BeeStudy - Auth Modal Component
 * Modal đăng nhập/đăng ký với Google
 */

"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiX, FiShield, FiZap, FiAward } from "react-icons/fi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { ANIMATION_VARIANTS } from "@/lib/constants";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Các lợi ích khi đăng ký
const benefits = [
    {
        icon: FiZap,
        title: "Truy cập không giới hạn",
        description: "Làm bài thi IELTS, flashcard và chép chính tả không giới hạn",
    },
    {
        icon: FiAward,
        title: "Theo dõi tiến độ",
        description: "Xem lịch sử làm bài và thống kê chi tiết kết quả học tập",
    },
    {
        icon: FiShield,
        title: "Lưu trữ an toàn",
        description: "Dữ liệu được lưu trữ an toàn trên cloud",
    },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    // Xử lý đăng nhập với Google
    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth login
        // Sẽ gọi API backend khi tích hợp
        console.log("Login with Google");

        // Giả lập redirect đến Google OAuth
        // window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent size="md" className="p-0 overflow-hidden">
                {/* Header với gradient */}
                <div className="bg-gradient-primary p-6 text-white">
                    <div className="flex items-center justify-center mb-4">
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-10 h-10"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2Z"
                                    fill="white"
                                />
                                <path
                                    d="M9 13H15M9 16H15"
                                    stroke="#FBBF24"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle cx="9" cy="10" r="1" fill="#FBBF24" />
                                <circle cx="15" cy="10" r="1" fill="#FBBF24" />
                            </svg>
                        </div>
                    </div>
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-bold text-white">
                            Chào mừng đến BeeStudy!
                        </DialogTitle>
                        <DialogDescription className="text-white/80">
                            Đăng nhập để trải nghiệm đầy đủ tính năng
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Google Login Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Button
                            onClick={handleGoogleLogin}
                            variant="outline"
                            size="lg"
                            className="w-full h-14 text-base border-2 hover:bg-primary/5 hover:border-primary"
                        >
                            <FcGoogle className="w-6 h-6 mr-3" />
                            Tiếp tục với Google
                        </Button>
                    </motion.div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-background px-3 text-muted-foreground">
                                Lợi ích khi đăng ký
                            </span>
                        </div>
                    </div>

                    {/* Benefits List */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={{
                            animate: {
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                        className="space-y-4"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                variants={ANIMATION_VARIANTS.fadeInUp}
                                className="flex items-start gap-4 p-3 rounded-xl bg-secondary/50"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <benefit.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Terms */}
                    <p className="text-xs text-center text-muted-foreground mt-6">
                        Bằng việc đăng nhập, bạn đồng ý với{" "}
                        <a href="/dieu-khoan-su-dung" className="text-primary hover:underline">
                            Điều khoản sử dụng
                        </a>{" "}
                        và{" "}
                        <a href="/chinh-sach-bao-mat" className="text-primary hover:underline">
                            Chính sách bảo mật
                        </a>{" "}
                        của BeeStudy.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
