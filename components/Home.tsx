import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import {
  GraduationCap,
  MessageSquare,
  FileQuestion,
  Settings,
  BookOpen,
  CheckCircle,
  Zap,
  Clock,
  Smartphone,
  Mail,
  Phone,
  HelpCircle,
  Rocket,
  ArrowRight,
  Cpu,
  Users
} from 'lucide-react';

const Home: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (user) {
      navigate('/san-pham-1');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12 bg-white border border-gray-100 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-50"></div>
        <div className="relative z-10 p-12 md:p-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full">
              <GraduationCap size={64} className="text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Nền Tảng Ôn Thi THPT <span className="text-blue-600">Công Nghệ</span>
          </h1>

          <h2 className="text-xl md:text-2xl font-medium mb-8 text-gray-600 max-w-3xl mx-auto">
            Hệ thống luyện thi thông minh được hỗ trợ bởi <span className="text-blue-600 font-bold">Gemini 2.5 Pro</span>.
            Bám sát chương trình GDPT 2018.
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={handleStartLearning}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2 transform hover:-translate-y-1"
            >
              Bắt Đầu Học Ngay <ArrowRight size={20} />
            </button>
            <Link to="/san-pham-3" className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2">
              <FileQuestion size={20} /> Làm Đề Thi Thử
            </Link>
          </div>

          <div className="mt-10 flex justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> SGK KNTT & Cánh Diều</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> AI Gemini 2.5 Pro</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Miễn phí 100%</span>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="mb-20 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Về Nền Tảng Ôn Thi Công Nghệ</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Chúng tôi xây dựng một hệ sinh thái học tập toàn diện, nơi công nghệ AI tiên tiến gặp gỡ chương trình giáo dục chuẩn mực.
          Mục tiêu là biến việc ôn thi môn Công nghệ trở nên thú vị, hiệu quả và dễ dàng tiếp cận cho mọi học sinh THPT trên cả nước.
        </p>
      </div>

      {/* Value Proposition Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20 px-4">
        <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
            <Rocket className="text-white" size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Mục Tiêu Của Chúng Tôi</h3>
          <p className="text-gray-600">
            Giúp học sinh nắm vững kiến thức cốt lõi, phát triển tư duy giải quyết vấn đề và đạt điểm số tối đa trong kỳ thi THPT Quốc gia.
          </p>
        </div>

        <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
            <Users className="text-white" size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Dành Cho Ai?</h3>
          <p className="text-gray-600">
            Học sinh lớp 10, 11, 12 đang theo học bộ sách Kết nối tri thức hoặc Cánh diều, và các thầy cô giáo cần nguồn tài liệu phong phú.
          </p>
        </div>

        <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20">
            <Zap className="text-white" size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Phương Pháp Học</h3>
          <p className="text-gray-600">
            Kết hợp học lý thuyết qua Chat AI, luyện tập với ngân hàng câu hỏi thông minh và theo dõi tiến độ qua biểu đồ trực quan.
          </p>
        </div>
      </div>

      {/* Detailed Features */}
      <div className="space-y-20 mb-20 px-4">
        {/* Feature 1: Curriculum */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6">
              <BookOpen size={16} /> Chương Trình Chuẩn
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Đầy Đủ Chương Trình Học Tập</h3>
            <p className="text-gray-600 text-lg mb-6">
              Hệ thống bao phủ toàn bộ kiến thức của hai bộ sách giáo khoa phổ biến nhất hiện nay:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700"><strong>Công nghệ Công nghiệp:</strong> Điện, Điện tử, Kỹ thuật cơ khí...</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700"><strong>Công nghệ Nông nghiệp:</strong> Trồng trọt, Chăn nuôi, Lâm nghiệp...</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Cập nhật liên tục theo các văn bản hướng dẫn mới nhất của Bộ GD&ĐT.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-gray-100 rounded-3xl p-8 aspect-video flex items-center justify-center">
            {/* Placeholder for Curriculum Image */}
            <BookOpen size={120} className="text-gray-300" />
          </div>
        </div>

        {/* Feature 2: AI Q&A */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6">
              <MessageSquare size={16} /> Trợ Lý Ảo Thông Minh
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Hỏi Đáp Với AI Gemini 2.5 Pro</h3>
            <p className="text-gray-600 text-lg mb-6">
              Không còn nỗi lo "bí" bài. Trợ lý AI của chúng tôi sẵn sàng giải đáp mọi thắc mắc 24/7:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Giải thích khái niệm khó hiểu một cách đơn giản, trực quan.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Phân tích đề bài và hướng dẫn phương pháp giải chi tiết.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Gợi ý các tài liệu tham khảo liên quan để mở rộng kiến thức.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-gray-100 rounded-3xl p-8 aspect-video flex items-center justify-center">
            {/* Placeholder for AI Image */}
            <MessageSquare size={120} className="text-gray-300" />
          </div>
        </div>

        {/* Feature 3: Exam Creation */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-6">
              <FileQuestion size={16} /> Luyện Thi Cực Chất
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tạo Đề Thi Tự Động</h3>
            <p className="text-gray-600 text-lg mb-6">
              Công cụ mạnh mẽ giúp bạn làm chủ phòng thi với kho đề vô tận:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-purple-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Tùy chỉnh cấu trúc đề: Số lượng câu, mức độ khó, phạm vi kiến thức.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-purple-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Chấm điểm tự động và nhận xét chi tiết ngay sau khi nộp bài.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-purple-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">Lưu lịch sử làm bài để theo dõi sự tiến bộ từng ngày.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-gray-100 rounded-3xl p-8 aspect-video flex items-center justify-center">
            {/* Placeholder for Exam Image */}
            <FileQuestion size={120} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Cpu className="text-blue-600" /> Công Nghệ Lõi
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Google Gemini 2.5 Pro
          </div>
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> React 19
          </div>
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> TypeScript
          </div>
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Vite
          </div>
        </div>
      </div>

      {/* Contact & Support - Light Theme */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Phone className="text-blue-600" /> Liên Hệ Hỗ Trợ
          </h3>
          <div className="space-y-4">
            <a href="mailto:longhngn.hnue@gmail.com" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">longhngn.hnue@gmail.com</p>
              </div>
            </a>
            <a href="https://zalo.me/0896636181" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Zalo / Hotline</p>
                <p className="font-medium text-gray-900">0896636181</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="text-blue-600" /> Câu Hỏi Thường Gặp
          </h3>
          <div className="space-y-3">
            <details className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <span>Sử dụng có mất phí không?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-3 pb-3 text-sm text-gray-500 leading-relaxed">
                Hoàn toàn miễn phí. Dự án phi lợi nhuận hỗ trợ cộng đồng học sinh THPT.
              </p>
            </details>
            <div className="h-px bg-gray-100"></div>
            <details className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <span>Đăng ký tài khoản thế nào?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-3 pb-3 text-sm text-gray-500 leading-relaxed">
                Nhấn nút "Đăng nhập" góc phải → chọn tab "Đăng ký". Chỉ cần Email là đủ.
              </p>
            </details>
            <div className="h-px bg-gray-100"></div>
            <details className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <span>Đề thi có chuẩn không?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-3 pb-3 text-sm text-gray-500 leading-relaxed">
                Đề thi được AI tạo dựa trên SGK chuẩn của Bộ GD&ĐT (Cánh Diều, KNTT).
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* CTA Section - Professional Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-center text-white mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Sẵn Sàng Chinh Phục Kỳ Thi?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Tham gia cùng hàng ngàn học sinh khác và nâng cao điểm số môn Công nghệ ngay hôm nay.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartLearning}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-md"
            >
              Trải Nghiệm Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default Home;

