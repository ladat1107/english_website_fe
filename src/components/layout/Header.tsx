/**
 * BeeStudy - Header Component
 * Component header chính của website
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui";
import Logo from "../common/Logo";

interface HeaderProps {
    onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
    // State để kiểm tra scroll
    const [isScrolled, setIsScrolled] = useState(false);
    // State menu mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // State dropdown đang mở
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Theo dõi scroll để thay đổi style header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Đóng mobile menu khi resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-soft"
                    : "bg-transparent"
            )}
        >
            <div className="container-custom">
                <nav className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {MAIN_NAV_ITEMS.map((item) => (
                            <div
                                key={item.href}
                                className="relative"
                                onMouseEnter={() => item.children && setOpenDropdown(item.title)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                {/* Nav Item */}
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        "hover:bg-primary/10 hover:text-primary",
                                        openDropdown === item.title && "bg-primary/10 text-primary"
                                    )}
                                >
                                    {item.title}
                                    {item.children && (
                                        <FiChevronDown
                                            className={cn(
                                                "w-4 h-4 transition-transform",
                                                openDropdown === item.title && "rotate-180"
                                            )}
                                        />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {item.children && openDropdown === item.title && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg border p-2"
                                        >
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                                                >
                                                    <span className="font-medium text-foreground group-hover:text-primary">
                                                        {child.title}
                                                    </span>
                                                    {child.description && (
                                                        <span className="block text-sm text-muted-foreground mt-0.5">
                                                            {child.description}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Nút Đăng nhập */}
                        <Button
                            onClick={onOpenAuthModal}
                            variant="outline"
                            className="hidden sm:flex"
                        >
                            <FiUser className="w-4 h-4 mr-2" />
                            Đăng nhập
                        </Button>

                        {/* Nút Đăng ký miễn phí */}
                        <Button onClick={onOpenAuthModal} className="hidden md:flex">
                            <FcGoogle className="w-4 h-4 mr-2" />
                            Đăng ký miễn phí
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-white border-t overflow-hidden"
                    >
                        <div className="container-custom py-4 space-y-2">
                            {MAIN_NAV_ITEMS.map((item) => (
                                <div key={item.href}>
                                    {/* Mobile Nav Item */}
                                    <div
                                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => {
                                            if (item.children) {
                                                setOpenDropdown(
                                                    openDropdown === item.title ? null : item.title
                                                );
                                            }
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="font-medium"
                                            onClick={() => !item.children && setIsMobileMenuOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                        {item.children && (
                                            <FiChevronDown
                                                className={cn(
                                                    "w-5 h-5 transition-transform",
                                                    openDropdown === item.title && "rotate-180"
                                                )}
                                            />
                                        )}
                                    </div>

                                    {/* Mobile Dropdown */}
                                    <AnimatePresence>
                                        {item.children && openDropdown === item.title && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pl-4 overflow-hidden"
                                            >
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {child.title}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Mobile Auth Buttons */}
                            <div className="pt-4 border-t space-y-2">
                                <Button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        onOpenAuthModal?.();
                                    }}
                                    className="w-full"
                                >
                                    <FcGoogle className="w-5 h-5 mr-2" />
                                    Đăng ký / Đăng nhập với Google
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
