/**
 * Khailingo - Trang Điều Khoản Sử Dụng
 * Các điều khoản và điều kiện sử dụng dịch vụ
 */

import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
    title: "Điều Khoản Sử Dụng - Khailingo",
    description: "Điều khoản và điều kiện sử dụng dịch vụ Khailingo. Vui lòng đọc kỹ trước khi sử dụng.",
};

export default function TermsOfServicePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background py-12">
                <div className="container-custom max-w-4xl">
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Điều Khoản Sử Dụng
                        </h1>
                        <p className="text-muted-foreground">
                            Cập nhật lần cuối: Tháng 1, 2024
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-6 md:p-10 prose prose-gray max-w-none">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Chấp nhận điều khoản</h2>
                                <p className="text-muted-foreground mb-4">
                                    Bằng việc truy cập và sử dụng dịch vụ Khailingo, bạn đồng ý tuân thủ
                                    và bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không
                                    đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không
                                    sử dụng dịch vụ của chúng tôi.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Mô tả dịch vụ</h2>
                                <p className="text-muted-foreground mb-4">
                                    Khailingo là nền tảng học tiếng Anh và luyện thi IELTS trực tuyến,
                                    cung cấp các dịch vụ bao gồm:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Bộ đề thi IELTS đầy đủ 4 kỹ năng</li>
                                    <li>Flashcard học từ vựng</li>
                                    <li>Bài luyện nghe chép chính tả</li>
                                    <li>Theo dõi tiến độ học tập</li>
                                    <li>Các tài liệu học tập khác</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. Tài khoản người dùng</h2>
                                <p className="text-muted-foreground mb-4">
                                    Để sử dụng đầy đủ tính năng của Khailingo, bạn cần tạo tài khoản.
                                    Khi tạo tài khoản, bạn đồng ý:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Cung cấp thông tin chính xác và cập nhật</li>
                                    <li>Bảo mật tài khoản và mật khẩu của bạn</li>
                                    <li>Chịu trách nhiệm về mọi hoạt động dưới tài khoản của bạn</li>
                                    <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">4. Quy tắc sử dụng</h2>
                                <p className="text-muted-foreground mb-4">
                                    Khi sử dụng Khailingo, bạn cam kết không:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Vi phạm pháp luật hoặc quyền của người khác</li>
                                    <li>Sao chép, phân phối hoặc sử dụng nội dung cho mục đích thương mại</li>
                                    <li>Tải lên nội dung độc hại, virus hoặc mã nguy hiểm</li>
                                    <li>Can thiệp vào hoạt động bình thường của hệ thống</li>
                                    <li>Tạo nhiều tài khoản giả mạo</li>
                                    <li>Quấy rối hoặc gây phiền toái cho người dùng khác</li>
                                    <li>Cố gắng truy cập trái phép vào hệ thống</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">5. Quyền sở hữu trí tuệ</h2>
                                <p className="text-muted-foreground mb-4">
                                    Tất cả nội dung trên Khailingo, bao gồm nhưng không giới hạn văn bản,
                                    hình ảnh, âm thanh, video, thiết kế và mã nguồn, thuộc quyền sở hữu
                                    của Khailingo hoặc các nhà cung cấp nội dung được cấp phép.
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    Bạn được phép sử dụng nội dung cho mục đích học tập cá nhân.
                                    Mọi hình thức sao chép, phân phối hoặc sử dụng thương mại đều
                                    cần có sự đồng ý bằng văn bản từ Khailingo.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">6. Nội dung người dùng</h2>
                                <p className="text-muted-foreground mb-4">
                                    Khi bạn tạo nội dung trên Khailingo (như flashcard tự tạo, bình luận, v.v.),
                                    bạn:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Giữ quyền sở hữu nội dung của bạn</li>
                                    <li>Cấp cho Khailingo giấy phép không độc quyền để sử dụng, hiển thị
                                        và phân phối nội dung đó trên nền tảng</li>
                                    <li>Chịu trách nhiệm về tính hợp pháp của nội dung</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">7. Miễn trừ trách nhiệm</h2>
                                <p className="text-muted-foreground mb-4">
                                    Dịch vụ được cung cấp "nguyên trạng" mà không có bất kỳ bảo đảm nào.
                                    Khailingo không chịu trách nhiệm về:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Gián đoạn hoặc lỗi kỹ thuật của dịch vụ</li>
                                    <li>Mất mát dữ liệu</li>
                                    <li>Kết quả học tập hoặc thi cử của người dùng</li>
                                    <li>Nội dung của bên thứ ba được liên kết</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">8. Giới hạn trách nhiệm</h2>
                                <p className="text-muted-foreground mb-4">
                                    Trong mọi trường hợp, Khailingo không chịu trách nhiệm về bất kỳ
                                    thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc do hậu quả nào
                                    phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">9. Chấm dứt</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:
                                </p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Vi phạm các điều khoản sử dụng</li>
                                    <li>Có hành vi gian lận hoặc lạm dụng</li>
                                    <li>Không hoạt động trong thời gian dài</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    Bạn cũng có thể xóa tài khoản bất cứ lúc nào thông qua cài đặt tài khoản.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">10. Thay đổi điều khoản</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi có thể sửa đổi các điều khoản này bất cứ lúc nào.
                                    Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với
                                    việc bạn chấp nhận các điều khoản mới. Chúng tôi sẽ thông báo
                                    về các thay đổi quan trọng qua email hoặc thông báo trên website.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">11. Luật áp dụng</h2>
                                <p className="text-muted-foreground mb-4">
                                    Các điều khoản này được điều chỉnh và giải thích theo pháp luật
                                    Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án
                                    có thẩm quyền tại Việt Nam.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">12. Liên hệ</h2>
                                <p className="text-muted-foreground mb-4">
                                    Nếu bạn có câu hỏi về các điều khoản sử dụng này, vui lòng liên hệ:
                                </p>
                                <ul className="list-none text-muted-foreground space-y-2">
                                    <li><strong>Email:</strong> support@khailingo.vn</li>
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
