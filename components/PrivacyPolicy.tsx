import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary px-8 py-10 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold">Chính Sách Bảo Mật</h1>
                    </div>
                    <p className="text-primary text-lg">
                        Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của bạn.
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            1. Thu thập thông tin
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn, bao gồm:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-gray-600 ml-4 space-y-1">
                            <li>Thông tin tài khoản (Tên, Email) khi bạn đăng ký.</li>
                            <li>Dữ liệu học tập (Lịch sử làm bài, điểm số) để theo dõi tiến độ.</li>
                            <li>Thông tin thiết bị để đồng bộ hóa dữ liệu.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" />
                            2. Sử dụng thông tin
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Thông tin của bạn được sử dụng để:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-gray-600 ml-4 space-y-1">
                            <li>Cá nhân hóa trải nghiệm học tập.</li>
                            <li>Cải thiện chất lượng đề thi và gợi ý của AI.</li>
                            <li>Liên hệ hỗ trợ khi cần thiết.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Bảo mật dữ liệu</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn để bảo vệ dữ liệu của bạn khỏi truy cập trái phép. Mọi dữ liệu nhạy cảm đều được mã hóa.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Chia sẻ thông tin</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Chúng tôi cam kết <strong>không bán</strong> hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100 text-sm text-gray-500">
                        Cập nhật lần cuối: 23/11/2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
