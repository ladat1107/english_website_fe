/**
 * Khailingo - Auth Modal Component
 * Modal đăng nhập/đăng ký với Google
 */

"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { getGoogleAuthUrl } from "@/apiRequest";
import { useAuth } from "@/contexts";
import Image from "next/image";
import { getNameAvatar } from "@/utils/funtions";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const { isAuthenticated, checkAuthStatus, user } = useAuth();

    const handleGoogleSignIn = async () => {
        // Redirect đến Google OAuth với path hiện tại để quay lại sau login
        window.location.href = getGoogleAuthUrl(pathname);
    }

    // Handle khi modal đóng - refresh auth status
    const handleClose = () => {
        onClose();
        // Delay để đảm bảo modal đã đóng hoàn toàn
        setTimeout(() => {
            checkAuthStatus();
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent size="md" className="p-0 gap-0 overflow-hidden">
                {/* Header với gradient */}
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        {/* Logo */}
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            {/* Logo */}
                            <Image src="/logo/logo-small.png" alt="KhaiLingo Logo" width={80} height={80} priority />
                        </div>
                    </div>
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-center text-2xl font-bold">
                            Chào mừng đến Khailingo!
                        </DialogTitle>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isAuthenticated ? (
                        /* Đã đăng nhập */
                        <div className="text-center space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center"
                            >
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                                    {user?.avatar_url ? (
                                        <Image
                                            src={user.avatar_url}
                                            alt={user.full_name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-primary">
                                            {getNameAvatar(user?.full_name || '')}
                                        </span>
                                    )}
                                </div>

                                {/* User Info */}
                                <h3 className="text-xl font-semibold mb-1">
                                    {user?.full_name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {user?.email}
                                </p>

                            </motion.div>

                            {/* Close Button */}
                            <Button
                                onClick={handleClose}
                                size="lg"
                                className="w-full h-12 text-base"
                            >
                                Tiếp tục học tập
                            </Button>
                        </div>
                    ) : (
                        /* Chưa đăng nhập */
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Button
                                    onClick={handleGoogleSignIn}
                                    size="lg"
                                    className="w-full h-12 text-base"
                                >
                                    <FaGoogle className="w-6 h-6 mr-3" />
                                    Tiếp tục với Google
                                </Button>
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
                                của Khailingo.
                            </p>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
