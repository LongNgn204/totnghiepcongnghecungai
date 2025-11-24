import React, { useState } from 'react';
import { ArrowRight, Code, Cpu, BookOpen, Sparkles, Play } from 'lucide-react';
import DemoModal from './DemoModal';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-white selection:bg-cyan-500 selection:text-white">
      {/* Background Abstract - STEAM Fusion */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <img
          src="/assets/bg-abstract.png"
          alt="Background Pattern"
          className="w-full h-full object-cover opacity-50 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:bg-white/20 transition-all cursor-default">
              <Sparkles size={16} className="text-cyan-400 animate-pulse" />
              <span className="text-sm font-semibold text-cyan-100 tracking-wide">GIÁO DỤC STEM 4.0</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Chinh Phục <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-shimmer bg-[length:200%_auto]">
                Công Nghệ THPT
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Nền tảng ôn thi tích hợp <span className="text-cyan-400 font-semibold">AI Coding</span> & <span className="text-purple-400 font-semibold">Tư duy STEM</span>.
              Chuẩn hóa kiến thức SGK "Kết Nối Tri Thức" & "Cánh Diều".
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <button
                onClick={onStart}
                className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Bắt Đầu Ngay
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => setShowDemo(true)}
                className="group px-8 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <Play size={18} className="fill-current text-purple-400 group-hover:scale-110 transition-transform" />
                Xem Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">10k+</div>
                <div className="text-sm text-slate-400">Học sinh tin dùng</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-slate-400">AI Hỗ trợ</div>
              </div>
            </div>
          </div>

          {/* Right Visual - Collaborative Maker Space */}
          <div className="flex-1 w-full max-w-2xl relative perspective-1000 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
              <img
                src="/assets/hero-steam.png"
                alt="STEAM Classroom"
                className="w-full h-auto object-cover"
              />

              {/* Overlay UI Elements for Tech Vibe */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4 animate-slide-up">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Code size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-cyan-300 font-mono mb-1">TRẠNG THÁI HỆ THỐNG</div>
                  <div className="text-sm font-medium text-white">Trợ Lý Học Tập AI: <span className="text-green-400">Đang Hoạt Động</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section - The "Aha!" Moment */}
      <div className="relative py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(189,0,255,0.15)] group">
                <img
                  src="/assets/feature-interaction.png"
                  alt="Student Interaction"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="text-purple-300 font-mono text-sm mb-2">#TRAI_NGHIEM</div>
                  <h3 className="text-2xl font-bold text-white">Trải nghiệm thực tế</h3>
                </div>
              </div>
            </div>

            <div className="flex-1 order-1 md:order-2 space-y-6">
              <h2 className="text-4xl font-bold">
                Học không chỉ là <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Ghi chép lý thuyết</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Chúng tôi mang đến phương pháp học tập <strong className="text-white">Học Tập Qua Dự Án</strong>.
                Bạn sẽ được trực tiếp lập trình, mô phỏng mạch điện và giải quyết các vấn đề thực tế ngay trên nền tảng.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem icon={<Code />} title="Lập Trình Trực Tiếp" desc="Trình biên dịch trực tiếp" />
                <FeatureItem icon={<Cpu />} title="Mạch điện tử" desc="Mô phỏng 3D trực quan" />
                <FeatureItem icon={<BookOpen />} title="Luyện đề" desc="Ngân hàng câu hỏi thông minh" />
                <FeatureItem icon={<Sparkles />} title="Trợ lý AI" desc="Giải đáp thắc mắc 24/7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-cyan-400">{icon}</div>
      <h4 className="font-semibold text-white">{title}</h4>
    </div>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);

export default LandingPage;
