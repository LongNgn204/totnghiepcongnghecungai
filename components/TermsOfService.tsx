import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-900 dark:bg-black px-8 py-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FileText className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold">Điều Khoản Sử Dụng</h1>
                    </div>
                    <p className="text-gray-400 text-lg relative z-10">
                        Quy định về việc sử dụng nền tảng Ôn Thi THPT QG môn Công Nghệ.
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            1. Chấp nhận điều khoản
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Quyền sở hữu trí tuệ</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Toàn bộ nội dung, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, mã nguồn, và dữ liệu đề thi đều thuộc quyền sở hữu của chúng tôi hoặc được cấp phép sử dụng hợp pháp. Nghiêm cấm sao chép dưới mọi hình thức khi chưa có sự đồng ý.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            3. Trách nhiệm người dùng
                        </h2>
                        <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 ml-4 space-y-2">
                            <li>Sử dụng dịch vụ cho mục đích học tập lành mạnh.</li>
                            <li>Không thực hiện các hành vi phá hoại, tấn công hệ thống.</li>
                            <li>Tự chịu trách nhiệm bảo mật tài khoản của mình.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Miễn trừ trách nhiệm</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Mặc dù chúng tôi nỗ lực đảm bảo tính chính xác của nội dung (được hỗ trợ bởi AI), chúng tôi không chịu trách nhiệm cho bất kỳ sai sót nào có thể xảy ra. Người dùng nên đối chiếu với Sách Giáo Khoa chính thức.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                        Cập nhật lần cuối: 23/11/2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
