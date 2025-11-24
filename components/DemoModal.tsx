import React, { useState } from 'react';
import { X, CheckCircle, Send, Star } from 'lucide-react';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white  rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-scale-up relative border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-gray-100 :bg-slate-800 rounded-full transition-colors z-10"
                >
                    <X size={24} className="text-gray-600 " />
                </button>

                {/* Left Side - Sales Pitch */}
                <div className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-medium text-yellow-300 border border-yellow-300/30">
                            <Star size={14} fill="currentColor" />
                            <span>Ưu đãi đặc biệt cho Trường THPT</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Trải nghiệm Hệ thống Ôn thi Công nghệ 4.0
                        </h2>

                        <p className="text-primary text-lg">
                            Đăng ký ngay để nhận bản Demo miễn phí và tư vấn triển khai cho nhà trường.
                        </p>

                        <ul className="space-y-4 pt-4">
                            {[
                                'Ngân hàng 1000+ câu hỏi trắc nghiệm chuẩn',
                                'AI chấm điểm và giải thích chi tiết',
                                'Tự động tạo đề thi theo ma trận',
                                'Báo cáo thống kê kết quả học tập'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center shrink-0">
                                        <CheckCircle size={14} className="text-green-900" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8 bg-white  flex flex-col justify-center">
                    {submitted ? (
                        <div className="text-center space-y-4 py-12">
                            <div className="w-20 h-20 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={40} className="text-green-600 " />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 ">Đăng ký thành công!</h3>
                            <p className="text-gray-600 ">
                                Cảm ơn bạn đã quan tâm. Đội ngũ tư vấn sẽ liên hệ với bạn trong vòng 24h làm việc.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 px-6 py-3 bg-gray-100  hover:bg-gray-200 :bg-slate-700 text-gray-700  font-medium rounded-xl transition-colors"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900  mb-2">Đăng ký Demo</h3>
                                <p className="text-gray-500 ">Điền thông tin bên dưới để nhận tài khoản trải nghiệm.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ">Họ và tên</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200  focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50  focus:bg-white :bg-slate-900 "
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ">Email / Số điện thoại</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200  focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50  focus:bg-white :bg-slate-900 "
                                        placeholder="email@example.com hoặc 0912..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ">Đơn vị công tác (Trường/Tổ chức)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200  focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50  focus:bg-white :bg-slate-900 "
                                        placeholder="THPT..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <span>Gửi Đăng Ký Ngay</span>
                                    <Send size={18} />
                                </button>
                            </form>

                            <p className="text-xs text-center text-gray-400 mt-6">
                                Bằng việc đăng ký, bạn đồng ý với chính sách bảo mật của chúng tôi.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemoModal;
