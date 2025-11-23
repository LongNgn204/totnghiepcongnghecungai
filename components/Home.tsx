import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import {
  GraduationCap,
  MessageSquare,
  FileQuestion,
  BookOpen,
  CheckCircle,
  Zap,
  Rocket,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
  Brain,
  Target,
  Star,
  Play
} from 'lucide-react';

const Home: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  // Hero slides data
  const heroSlides = [
    {
      title: "Ôn Thi THPT Công Nghệ",
      subtitle: "Hệ thống luyện thi thông minh được hỗ trợ bởi Gemini 2.5 Pro",
      description: "Bám sát chương trình GDPT 2018 - Nâng cao điểm số môn Công nghệ",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      icon: GraduationCap,
      cta: "Bắt Đầu Học Ngay"
    },
    {
      title: "Chat AI Thông Minh",
      subtitle: "Trợ lý ảo 24/7 hỗ trợ giải đáp mọi thắc mắc",
      description: "Giải thích khái niệm, phân tích đề bài và hướng dẫn phương pháp giải chi tiết",
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      icon: MessageSquare,
      cta: "Trò Chuyện Ngay"
    },
    {
      title: "Tạo Đề Thi Tự Động",
      subtitle: "Kho đề vô tận với AI tạo đề thông minh",
      description: "Tùy chỉnh cấu trúc đề - Chấm điểm tự động - Lưu lịch sử làm bài",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: FileQuestion,
      cta: "Tạo Đề Ngay"
    },
    {
      title: "Tủ Sách Số Đầy Đủ",
      subtitle: "Toàn bộ SGK Công nghệ THPT trong tầm tay",
      description: "Kết nối tri thức & Cánh diều - Đọc online miễn phí 100%",
      gradient: "from-orange-600 via-amber-600 to-yellow-600",
      icon: BookOpen,
      cta: "Khám Phá Ngay"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlideData = heroSlides[currentSlide];
  const SlideIcon = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Slider Section */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} transition-all duration-1000`}>
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex-1 text-white animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-6 border border-white/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              LIVE - HỌC ONLINE
            </div>

            {/* Main Content */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {currentSlideData.title}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mb-4 text-white/90">
              {currentSlideData.subtitle}
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
              {currentSlideData.description}
            </p>

            {/* CTA Button */}
            <button
              onClick={handleStartLearning}
              className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 flex items-center gap-3 hover:scale-105 transform"
            >
              <Play size={24} className="group-hover:translate-x-1 transition-transform" />
              {currentSlideData.cta}
            </button>

            {/* Statistics */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">10K+</div>
                <div className="text-sm text-white/70">Học sinh</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">50K+</div>
                <div className="text-sm text-white/70">Câu hỏi</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">100%</div>
                <div className="text-sm text-white/70">Miễn phí</div>
              </div>
            </div>
          </div>

          {/* Icon Illustration */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="relative w-96 h-96 animate-float">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl" />
              <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-full border-4 border-white/30 flex items-center justify-center">
                <SlideIcon size={180} strokeWidth={1.5} className="text-white drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-all border border-white/30"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-all border border-white/30"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900  mb-4">Tại Sao Chọn Chúng Tôi?</h2>
          <p className="text-xl text-gray-600 ">Nền tảng ôn thi toàn diện với công nghệ AI tiên tiến</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="group bg-white  rounded-3xl p-8 border border-gray-100  hover:border-blue-200 :border-blue-700 hover:shadow-xl transition-all cursor-default">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <Brain className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900  mb-3">AI Thông Minh</h3>
            <p className="text-gray-600 ">
              Gemini 2.5 Pro hỗ trợ giải đáp mọi thắc mắc 24/7
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white  rounded-3xl p-8 border border-gray-100  hover:border-purple-200 :border-purple-700 hover:shadow-xl transition-all cursor-default">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
              <Target className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900  mb-3">Bám Sát SGK</h3>
            <p className="text-gray-600 ">
              Đầy đủ chương trình GDPT 2018, KNTT & Cánh Diều
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white  rounded-3xl p-8 border border-gray-100  hover:border-green-200 :border-green-700 hover:shadow-xl transition-all cursor-default">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
              <Zap className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900  mb-3">Học Tập Hiệu Quả</h3>
            <p className="text-gray-600 ">
              Theo dõi tiến độ, thống kê chi tiết từng ngày
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-white  rounded-3xl p-8 border border-gray-100  hover:border-orange-200 :border-orange-700 hover:shadow-xl transition-all cursor-default">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900  mb-3">Cộng Đồng Lớn</h3>
            <p className="text-gray-600 ">
              10,000+ học sinh đang tin dùng hàng ngày
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50   py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900  mb-4">Bắt Đầu Học Ngay</h2>
            <p className="text-xl text-gray-600 ">Chọn công cụ phù hợp với mục tiêu học tập</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Chat AI Card */}
            <Link
              to="/san-pham-1"
              className="group bg-white  rounded-3xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 :border-blue-700"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <MessageSquare className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900  mb-3 group-hover:text-blue-600 :text-blue-400 transition-colors">
                Chat AI
              </h3>
              <p className="text-gray-600  mb-6">
                Hỏi đáp trực tiếp với AI Gemini 2.5 Pro. Giải thích chi tiết, dễ hiểu.
              </p>
              <div className="flex items-center text-blue-600  font-semibold group-hover:gap-3 gap-2 transition-all">
                Bắt đầu ngay <ArrowRight size={20} />
              </div>
            </Link>

            {/* Create Exam Card */}
            <Link
              to="/san-pham-2"
              className="group bg-white  rounded-3xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200 :border-green-700"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <FileQuestion className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900  mb-3 group-hover:text-green-600 :text-green-400 transition-colors">
                Tạo Đề Thi
              </h3>
              <p className="text-gray-600  mb-6">
                Tự tạo đề thi theo cấu trúc THPT QG. Chấm điểm tự động.
              </p>
              <div className="flex items-center text-green-600  font-semibold group-hover:gap-3 gap-2 transition-all">
                Tạo đề ngay <ArrowRight size={20} />
              </div>
            </Link>

            {/* Bookshelf Card */}
            <Link
              to="/product8"
              className="group bg-white  rounded-3xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200 :border-orange-700"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <BookOpen className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900  mb-3 group-hover:text-orange-600 :text-orange-400 transition-colors">
                Tủ Sách Số
              </h3>
              <p className="text-gray-600  mb-6">
                Toàn bộ SGK Công nghệ THPT. Đọc online miễn phí 100%.
              </p>
              <div className="flex items-center text-orange-600  font-semibold group-hover:gap-3 gap-2 transition-all">
                Khám phá ngay <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Rocket size={80} className="mx-auto mb-8 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn Sàng Chinh Phục Kỳ Thi?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Tham gia cùng 10,000+ học sinh và nâng cao điểm số môn Công nghệ ngay hôm nay
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartLearning}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl flex items-center gap-2 hover:scale-105 transform"
            >
              <Star size={24} className="text-yellow-500" />
              Trải Nghiệm Miễn Phí
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 mt-12 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" /> SGK KNTT & Cánh Diều
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" /> AI Gemini 2.5 Pro
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-300" /> Miễn phí 100%
            </span>
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

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
