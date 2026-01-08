/**
 * BeeStudy - Trang chủ
 * Trang landing page chính của website
 */

"use client";

import { useState } from "react";
import { Header, Footer, AuthModal } from "@/components/layout";
import {
  HeroSection,
  FeaturesSection,
  TestCardsSection,
  PracticeSection,
  SamplesSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  // State quản lý modal đăng nhập
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Hàm mở modal đăng nhập
  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  // Hàm đóng modal đăng nhập
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      {/* Header cố định */}
      <Header onOpenAuthModal={handleOpenAuthModal} />

      {/* Main content */}
      <main>
        {/* Hero Section - Banner chính */}
        <HeroSection onOpenAuthModal={handleOpenAuthModal} />

        {/* Features Section - Các tính năng */}
        <FeaturesSection />

        {/* Test Cards Section - Đề thi nổi bật */}
        <TestCardsSection />

        {/* Practice Section - Luyện tập Reading/Listening */}
        <PracticeSection />

        {/* Samples Section - Bài mẫu Writing/Speaking */}
        <SamplesSection />

        {/* CTA Section - Kêu gọi đăng ký */}
        <CTASection onOpenAuthModal={handleOpenAuthModal} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal - Modal đăng nhập với Google */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
}
