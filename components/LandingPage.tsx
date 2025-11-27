import React, { useState } from 'react';
import { ArrowRight, Code, Cpu, BookOpen, Sparkles, Play } from 'lucide-react';
import DemoModal from './DemoModal';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-text-primary selection:bg-primary-200 selection:text-primary-900">
      {/* Background Abstract - STEAM Fusion */}
      {/* Background Abstract - Themed */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/bg-abstract.png"
          alt="Background Pattern"
          className="w-full h-full object-cover opacity-5 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-hover backdrop-blur-md border border-border shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-default">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary tracking-wide">GIÁO DỤC STEM 4.0</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Chinh Phục <br />
              <span className="text-primary">
                Công Nghệ THPT
              </span>
            </h1>

            <p className="text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Nền tảng ôn thi tích hợp <span className="text-primary font-semibold">AI Coding</span> & <span className="text-accent-purple-500 font-semibold">Tư duy STEM</span>.
              Chuẩn hóa kiến thức SGK "Kết Nối Tri Thức" & "Cánh Diều".
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <button
                onClick={onStart}
                className="btn-primary group text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Bắt Đầu Ngay
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => setShowDemo(true)}
                className="btn-secondary group text-lg"
              >
                <Play size={18} className="fill-current text-primary group-hover:scale-110 transition-transform mr-2" />
                Xem Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-6 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-text-primary">10k+</div>
                <div className="text-sm text-text-secondary">Học sinh tin dùng</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="text-2xl font-bold text-text-primary">24/7</div>
                <div className="text-sm text-text-secondary">AI Hỗ trợ</div>
              </div>
            </div>
          </div>

          {/* Right Visual - Collaborative Maker Space */}
          <div className="flex-1 w-full max-w-2xl relative perspective-1000 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-purple-600 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden border border-border bg-surface shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
              <img
                src="/assets/hero-steam.png"
                alt="STEAM Classroom"
                className="w-full h-auto object-cover"
              />

              {/* Overlay UI Elements for Tech Vibe */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-border flex items-center gap-4 animate-slide-up">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                  <Code size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-primary font-mono mb-1">TRẠNG THÁI HỆ THỐNG</div>
                  <div className="text-sm font-medium text-text-primary">Trợ Lý Học Tập AI: <span className="text-success">Đang Hoạt Động</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section - The \"Aha!\" Moment */}
      <div className="relative py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-border bg-background shadow-lg group">
                <img
                  src="/assets/feature-interaction.png"
                  alt="Student Interaction"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="text-accent-purple-500 font-mono text-sm mb-2">#TRAI_NGHIEM</div>
                  <h3 className="text-2xl font-bold text-text-primary">Trải nghiệm thực tế</h3>
                </div>
              </div>
            </div>

            <div className="flex-1 order-1 md:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-text-primary">
                Học không chỉ là <br />
                <span className="text-accent-purple-500">Ghi chép lý thuyết</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Chúng tôi mang đến phương pháp học tập <strong className="text-text-primary">Học Tập Qua Dự Án</strong>.
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
  <div className="p-4 rounded-xl bg-surface border border-border hover:bg-surface-hover hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-primary">{icon}</div>
      <h4 className="font-semibold text-text-primary">{title}</h4>
    </div>
    <p className="text-sm text-text-secondary">{desc}</p>
  </div>
);

export default LandingPage;
