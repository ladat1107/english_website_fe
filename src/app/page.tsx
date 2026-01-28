/**
 * Khailingo - Trang chủ
 * Trang landing page chính của website
 * Server Component để tối ưu SEO
 */

import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  FeaturesSection,
  TestCardsSection,
  PracticeSection,
  SamplesSection,
  CTASection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      {/* Header cố định */}
      <Header />

      {/* Main content */}
      <main>
        {/* Hero Section - Banner chính */}
        <HeroSection />

        {/* Features Section - Các tính năng */}
        <FeaturesSection />

        {/* Test Cards Section - Đề thi nổi bật */}
        <TestCardsSection />

        {/* Practice Section - Luyện tập Reading/Listening */}
        <PracticeSection />

        {/* Samples Section - Bài mẫu Writing/Speaking */}
        <SamplesSection />

        {/* CTA Section - Kêu gọi đăng ký */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
