/**
 * BeeStudy - Footer Component
 * Component footer của website
 */

import Link from "next/link";
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { SITE_CONFIG, FOOTER_NAV } from "@/lib/constants";
import Logo from "../common/Logo";

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-foreground text-white">
            {/* CTA Section */}
            <div className="bg-gradient-primary">
                <div className="container-custom py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">
                                Bắt đầu học tiếng Anh ngay hôm nay!
                            </h3>
                            <p className="text-white/80">
                                Đăng ký miễn phí và trải nghiệm các tính năng premium
                            </p>
                        </div>
                        <Link
                            href="/dang-ky"
                            className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
                        >
                            Đăng ký miễn phí ngay
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-8 h-8 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.31 7 20 9.69 20 13V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V13C4 9.69 6.69 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2Z"
                                        fill="currentColor"
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
                            <span className="text-2xl font-bold">
                                <span className="text-primary">Bee</span>Study
                            </span>
                        </div>
                        <p className="text-white/70 mb-6 max-w-md">
                            {SITE_CONFIG.description}. Học tiếng Anh thông minh như chú ong chăm chỉ!
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-white/70">
                            <a
                                href={`tel:${SITE_CONFIG.phone}`}
                                className="flex items-center gap-3 hover:text-primary transition-colors"
                            >
                                <FiPhone className="w-5 h-5" />
                                <span>Hotline: {SITE_CONFIG.phone}</span>
                            </a>
                            <a
                                href={`mailto:${SITE_CONFIG.email}`}
                                className="flex items-center gap-3 hover:text-primary transition-colors"
                            >
                                <FiMail className="w-5 h-5" />
                                <span>{SITE_CONFIG.email}</span>
                            </a>
                            <div className="flex items-start gap-3">
                                <FiMapPin className="w-5 h-5 mt-0.5" />
                                <span>{SITE_CONFIG.address}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-6">
                            <a
                                href={SITE_CONFIG.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a
                                href={SITE_CONFIG.social.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                aria-label="Youtube"
                            >
                                <FaYoutube className="w-5 h-5" />
                            </a>
                            <a
                                href={SITE_CONFIG.social.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                aria-label="TikTok"
                            >
                                <FaTiktok className="w-5 h-5" />
                            </a>
                            <a
                                href={SITE_CONFIG.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Features Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">
                            {FOOTER_NAV.features.title}
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_NAV.features.items.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-white/70 hover:text-primary transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">
                            {FOOTER_NAV.resources.title}
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_NAV.resources.items.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-white/70 hover:text-primary transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">
                            {FOOTER_NAV.company.title}
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_NAV.company.items.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-white/70 hover:text-primary transition-colors"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
                        <p>© {currentYear} BeeStudy. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/chinh-sach-bao-mat" className="hover:text-primary transition-colors">
                                Chính sách bảo mật
                            </Link>
                            <Link href="/dieu-khoan-su-dung" className="hover:text-primary transition-colors">
                                Điều khoản sử dụng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
