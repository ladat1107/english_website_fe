/**
 * Khailingo - Trang chủ
 * Trang landing page chính của website
 * Server Component để tối ưu SEO
 */

import {
  HeroSection,
  FeaturesSection,
  TestCardsSection,
  PracticeSection,
  SamplesSection,
  CTASection,
} from "@/components/sections";
import BlogSection from "@/components/sections/blog-section";

export default function HomePage() {
  return (
    <>
      {/* Main content */}
      <main>
        {/* Hero Section - Banner chính */}
        <HeroSection />

        {/* Features Section - Các tính năng */}
        <FeaturesSection />

        {/* Samples Section - Bài mẫu Writing/Speaking */}
        <SamplesSection />

        {/* Blog Section - Bài viết nổi bật */}
        <BlogSection />

        {/* Test Cards Section - Đề thi nổi bật */}
        <TestCardsSection />

        {/* Practice Section - Luyện tập Reading/Listening */}
        <PracticeSection />

        {/* CTA Section - Kêu gọi đăng ký */}
        <CTASection />
      </main>
    </>
  );
}
