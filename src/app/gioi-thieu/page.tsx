/**
 * Khailingo - Trang Giới Thiệu
 * Giới thiệu về Khailingo và sứ mệnh
 */

import { Metadata } from "next";
import Link from "next/link";
import { FiTarget, FiHeart, FiUsers, FiAward, FiArrowRight } from "react-icons/fi";
import { Card, Button, Badge } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Giới Thiệu - Khailingo",
    description: "Khailingo - Nền tảng học tiếng Anh và luyện thi IELTS miễn phí hàng đầu Việt Nam.",
};

// Team members data
const teamMembers = [
    {
        name: "Nguyễn Văn A",
        role: "Founder & CEO",
        avatar: "/images/team/member-1.jpg",
        description: "IELTS 8.5, 10+ năm kinh nghiệm giảng dạy",
    },
    {
        name: "Trần Thị B",
        role: "Head of Content",
        avatar: "/images/team/member-2.jpg",
        description: "IELTS 8.0, Chuyên gia phát triển nội dung",
    },
    {
        name: "Lê Văn C",
        role: "Tech Lead",
        avatar: "/images/team/member-3.jpg",
        description: "10+ năm kinh nghiệm phát triển phần mềm",
    },
    {
        name: "Phạm Thị D",
        role: "Community Manager",
        avatar: "/images/team/member-4.jpg",
        description: "Chuyên gia xây dựng cộng đồng học tập",
    },
];

// Milestones data
const milestones = [
    { year: "2020", event: "Khailingo được thành lập" },
    { year: "2021", event: "Đạt 10,000 người dùng đầu tiên" },
    { year: "2022", event: "Ra mắt tính năng Flashcard và Dictation" },
    { year: "2023", event: "Đạt 100,000 người dùng" },
    { year: "2024", event: "Mở rộng tính năng AI đánh giá Speaking" },
];

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                    <div className="container-custom">
                        <div className="text-center max-w-3xl mx-auto">
                            <Badge variant="secondary" size="lg" className="mb-4">
                                Về Khailingo
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Sứ mệnh mang <span className="text-primary">tiếng Anh</span> đến với mọi người
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                Khailingo được thành lập với mục tiêu giúp người Việt Nam học tiếng Anh
                                và luyện thi IELTS một cách hiệu quả và hoàn toàn miễn phí.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission & Values */}
                <section className="py-16">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card variant="bordered" className="text-center p-6">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <FiTarget className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Sứ mệnh</h3>
                                <p className="text-sm text-muted-foreground">
                                    Mang đến nền giáo dục tiếng Anh chất lượng cao và miễn phí cho mọi người Việt Nam
                                </p>
                            </Card>
                            <Card variant="bordered" className="text-center p-6">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <FiHeart className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Đam mê</h3>
                                <p className="text-sm text-muted-foreground">
                                    Đội ngũ tâm huyết với giáo dục, luôn cải tiến để mang đến trải nghiệm học tập tốt nhất
                                </p>
                            </Card>
                            <Card variant="bordered" className="text-center p-6">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <FiUsers className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Cộng đồng</h3>
                                <p className="text-sm text-muted-foreground">
                                    Xây dựng cộng đồng học tập hỗ trợ lẫn nhau, cùng nhau tiến bộ mỗi ngày
                                </p>
                            </Card>
                            <Card variant="bordered" className="text-center p-6">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <FiAward className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Chất lượng</h3>
                                <p className="text-sm text-muted-foreground">
                                    Nội dung được biên soạn kỹ lưỡng bởi đội ngũ chuyên gia IELTS hàng đầu
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-primary text-white">
                    <div className="container-custom">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-5xl font-bold mb-2">100K+</div>
                                <div className="text-white/80">Người học</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">500+</div>
                                <div className="text-white/80">Bộ đề IELTS</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">5000+</div>
                                <div className="text-white/80">Flashcard</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">4.8/5</div>
                                <div className="text-white/80">Đánh giá</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-16">
                    <div className="container-custom">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Câu chuyện của chúng tôi</h2>
                            <p className="text-muted-foreground">
                                Khailingo bắt đầu từ ước mơ đơn giản: giúp mọi người Việt Nam có thể
                                tiếp cận nguồn tài liệu học IELTS chất lượng mà không phải lo lắng về chi phí.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20"></div>
                            {milestones.map((milestone, index) => (
                                <div
                                    key={milestone.year}
                                    className={`relative flex items-center mb-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                        }`}
                                >
                                    <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                                        <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                                        <div className="text-muted-foreground">{milestone.event}</div>
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                                    <div className="w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-16 bg-secondary/30">
                    <div className="container-custom">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Những người tâm huyết đằng sau Khailingo, luôn nỗ lực mang đến
                                trải nghiệm học tập tốt nhất cho bạn.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {teamMembers.map((member) => (
                                <Card key={member.name} variant="default" className="text-center p-6">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-primary">
                                            {member.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-lg">{member.name}</h4>
                                    <div className="text-sm text-primary mb-2">{member.role}</div>
                                    <p className="text-sm text-muted-foreground">{member.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16">
                    <div className="container-custom">
                        <Card className="bg-gradient-primary text-white p-8 md:p-12 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Bắt đầu hành trình chinh phục IELTS
                            </h2>
                            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                                Tham gia cùng hơn 100,000+ người học đang sử dụng Khailingo
                                để cải thiện tiếng Anh mỗi ngày.
                            </p>
                            <Link href="/luyen-thi-ielts">
                                <Button size="lg" variant="secondary">
                                    Bắt đầu học ngay
                                    <FiArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
