import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Code, Cpu, BookOpen, Zap, Sparkles, Brain } from 'lucide-react';
import DemoModal from './DemoModal';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      cardRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50  overflow-hidden relative transition-colors duration-300">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 h-screen flex flex-col md:flex-row items-center justify-center relative z-10">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50  backdrop-blur border border-white/60  shadow-sm">
            <Sparkles size={16} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-600 ">Phiên bản 2.0 - Tích hợp Gemini 2.5 Pro</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight ">
            Hệ thống ôn thi <br />
            <span className="text-gradient">THPT môn Công nghệ</span>
          </h1>

          <p className="text-xl text-gray-600  max-w-xl mx-auto md:mx-0 leading-relaxed">
            Nền tảng học tập tiên phong tích hợp AI Coding, Vẽ Sơ Đồ & Luyện Đề chuẩn SGK "Kết Nối Tri Thức" & "Cánh Diều".
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={onStart}
              className="btn-primary flex items-center gap-3 text-lg px-8 py-4 group"
            >
              Bắt Đầu Học Ngay
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 rounded-xl bg-white  text-gray-700  font-medium border border-gray-200  hover:bg-gray-50 :bg-slate-700 transition-all shadow-sm hover:shadow-md"
            >
              Xem Demo
            </button>
          </div>

          <div className="flex items-center gap-8 justify-center md:justify-start pt-8 opacity-80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-500 ">Online 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium text-gray-500 ">10k+ Học sinh</span>
            </div>
          </div>
        </div>

        {/* Right Visual (3D Card) */}
        <div className="flex-1 w-full max-w-xl perspective-1000 mt-12 md:mt-0 hidden md:block">
          <div
            ref={cardRef}
            className="relative w-full aspect-[4/3] glass-card   rounded-3xl p-6 border border-white/60 transform-style-3d transition-transform duration-100 ease-out"
          >
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white  rounded-2xl shadow-xl flex items-center justify-center transform translate-z-20 animate-float">
              <Brain size={40} className="text-purple-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white  rounded-2xl shadow-xl flex items-center justify-center transform translate-z-20 animate-float animation-delay-2000">
              <Code size={40} className="text-blue-500" />
            </div>

            {/* Mock UI */}
            <div className="w-full h-full bg-slate-50  rounded-2xl overflow-hidden border border-gray-100  flex flex-col shadow-inner">
              <div className="h-10 bg-white  border-b border-gray-100  flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100  flex items-center justify-center text-blue-600 ">
                    <UserIcon size={16} />
                  </div>
                  <div className="bg-white  p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-600  max-w-[80%]">
                    Giải thích nguyên lý làm việc của mạch khuếch đại thuật toán?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-purple-100  flex items-center justify-center text-purple-600 ">
                    <BotIcon size={16} />
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-lg text-sm text-white max-w-[90%]">
                    <p className="mb-2">Mạch khuếch đại thuật toán (Op-Amp) hoạt động dựa trên hai quy tắc vàng:</p>
                    <ul className="list-disc pl-4 space-y-1 text-white/90 text-xs">
                      <li>Dòng điện vào hai cực đầu vào bằng 0.</li>
                      <li>Hiệu điện thế giữa hai cực đầu vào bằng 0 (khi có hồi tiếp âm).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Code className="w-6 h-6 text-blue-600" />}
            title="Hỗ trợ Lập trình"
            desc="Hỗ trợ lập trình C++, Python, Arduino với giải thích chi tiết từng dòng code."
          />
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-purple-600" />}
            title="Vẽ Sơ đồ Mạch"
            desc="Tự động vẽ sơ đồ nguyên lý, sơ đồ lắp đặt mạch điện chuẩn kỹ thuật."
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-pink-600" />}
            title="Luyện thi Trắc nghiệm"
            desc="Ngân hàng câu hỏi trắc nghiệm bám sát cấu trúc đề thi THPT Quốc gia."
          />
        </div>
      </div>

      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="glass-card   p-6 rounded-2xl hover:bg-white/80 :bg-slate-800/80 transition-all cursor-default group">
    <div className="w-12 h-12 rounded-xl bg-gray-50  flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900  mb-2">{title}</h3>
    <p className="text-gray-500  text-sm leading-relaxed">{desc}</p>
  </div>
);

const UserIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const BotIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
);

export default LandingPage;
