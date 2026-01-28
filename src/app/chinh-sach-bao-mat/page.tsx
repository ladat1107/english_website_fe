/**
 * Khailingo - Trang Chính Sách Bảo Mật
 * Thông tin về bảo mật và quyền riêng tư
 */

import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
    title: "Chính Sách Bảo Mật - Khailingo",
    description: "Chính sách bảo mật và quyền riêng tư của Khailingo. Tìm hiểu cách chúng tôi bảo vệ thông tin của bạn.",
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background py-12">
                <div className="container-custom max-w-4xl">
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Chính Sách Bảo Mật
                        </h1>
                        <p className="text-muted-foreground">
                            Cập nhật lần cuối: Tháng 1, 2024
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-6 md:p-10 prose prose-gray max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Giới thiệu</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chào mừng bạn đến với Khailingo. Chúng tôi cam kết bảo vệ quyền riêng tư
                                    và thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách
                                    chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi sử dụng
                                    dịch vụ của Khailingo.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Thông tin chúng tôi thu thập</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi có thể thu thập các loại thông tin sau:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>
                                        <strong>Thông tin tài khoản:</strong> Khi bạn đăng ký tài khoản thông qua
                                        Google, chúng tôi thu thập tên, địa chỉ email và ảnh đại diện của bạn.
                                    </li>
                                    <li>
                                        <strong>Dữ liệu học tập:</strong> Thông tin về tiến độ học tập, kết quả
                                        bài thi, từ vựng đã học và các hoạt động khác trên nền tảng.
                                    </li>
                                    <li>
                                        <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt,
                                        thiết bị, hệ điều hành và dữ liệu nhật ký truy cập.
                                    </li>
                                    <li>
                                        <strong>Cookies:</strong> Chúng tôi sử dụng cookies để cải thiện
                                        trải nghiệm người dùng và phân tích lưu lượng truy cập.
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. Cách chúng tôi sử dụng thông tin</h2>
                                <p className="text-muted-foreground mb-4">
                                    Thông tin của bạn được sử dụng cho các mục đích sau:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Cung cấp và duy trì dịch vụ học tập</li>
                                    <li>Cá nhân hóa trải nghiệm học tập của bạn</li>
                                    <li>Theo dõi và hiển thị tiến độ học tập</li>
                                    <li>Gửi thông báo về cập nhật và tính năng mới</li>
                                    <li>Cải thiện và phát triển nền tảng</li>
                                    <li>Hỗ trợ khách hàng khi cần thiết</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">4. Chia sẻ thông tin</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba.
                                    Thông tin chỉ được chia sẻ trong các trường hợp sau:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Với sự đồng ý của bạn</li>
                                    <li>Để tuân thủ yêu cầu pháp lý</li>
                                    <li>Với các đối tác cung cấp dịch vụ hỗ trợ (lưu trữ, phân tích)</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">5. Bảo mật dữ liệu</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp
                                    để bảo vệ thông tin của bạn, bao gồm:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Mã hóa dữ liệu truyền tải qua HTTPS</li>
                                    <li>Lưu trữ dữ liệu an toàn trên máy chủ bảo mật</li>
                                    <li>Kiểm soát truy cập nghiêm ngặt</li>
                                    <li>Kiểm tra bảo mật định kỳ</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">6. Quyền của bạn</h2>
                                <p className="text-muted-foreground mb-4">
                                    Bạn có các quyền sau đối với thông tin cá nhân của mình:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Quyền truy cập và xem thông tin cá nhân</li>
                                    <li>Quyền chỉnh sửa thông tin không chính xác</li>
                                    <li>Quyền xóa tài khoản và dữ liệu</li>
                                    <li>Quyền xuất dữ liệu học tập</li>
                                    <li>Quyền từ chối nhận email marketing</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi sử dụng cookies để:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Duy trì phiên đăng nhập của bạn</li>
                                    <li>Lưu trữ tùy chọn của bạn</li>
                                    <li>Phân tích cách bạn sử dụng trang web</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng điều này
                                    có thể ảnh hưởng đến một số tính năng.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">8. Trẻ em</h2>
                                <p className="text-muted-foreground mb-4">
                                    Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi.
                                    Chúng tôi không cố ý thu thập thông tin từ trẻ em dưới 13 tuổi.
                                    Nếu bạn là phụ huynh và phát hiện con bạn đã cung cấp thông tin
                                    cho chúng tôi, vui lòng liên hệ để chúng tôi xóa thông tin đó.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">9. Thay đổi chính sách</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                                    Mọi thay đổi sẽ được thông báo trên trang này với ngày cập nhật mới.
                                    Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">10. Liên hệ</h2>
                                <p className="text-muted-foreground mb-4">
                                    Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
                                </p>
                                <ul className="list-none text-muted-foreground space-y-2">
                                    <li><strong>Email:</strong> privacy@khailingo.vn</li>
                                    <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</li>
                                    <li><strong>Hotline:</strong> 1900-123-456</li>
                                </ul>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
