import React, { useState, useEffect } from 'react';
import { 
  Cpu, Code2, Brain, PenTool, 
  ArrowRight, Sparkles, BookOpen, 
  Zap, GraduationCap, Layout,
  CheckCircle2, Terminal, Search
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      tag: "AI CODING TUTOR",
      title: "Lập Trình Viên AI",
      desc: "Hỗ trợ viết code Arduino, C++, Python cho IoT & Vi điều khiển. Tự động giải thích từng dòng code bằng tiếng Việt, giúp bạn hiểu sâu bản chất.",
      color: "from-blue-600 to-cyan-500",
      bgGlow: "bg-blue-500/30",
      icon: <Code2 className="w-12 h-12 text-white" />,
      visualContent: (
        <div className="font-mono text-xs text-blue-300 space-y-1">
          <div className="flex"><span className="text-purple-400">void</span> <span className="text-yellow-300 ml-2">setup</span>() {'{'}</div>
          <div className="pl-4 text-gray-400">// Khởi tạo Serial 9600</div>
          <div className="pl-4">Serial.<span className="text-blue-400">begin</span>(9600);</div>
          <div className="pl-4">pinMode(LED_BUILTIN, <span className="text-purple-400">OUTPUT</span>);</div>
          <div>{'}'}</div>
        </div>
      )
    },
    {
      id: 2,
      tag: "DEEP RESEARCH",
      title: "Tra Cứu Chuyên Sâu",
      desc: "Phân tích kiến thức bám sát SGK Cánh Diều & Kết Nối Tri Thức. Giải thích nguyên lý kỹ thuật phức tạp một cách trực quan.",
      color: "from-purple-600 to-pink-500",
      bgGlow: "bg-purple-500/30",
      icon: <Brain className="w-12 h-12 text-white" />,
      visualContent: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-200 text-sm">
            <Search size={16} />
            <span>Đang phân tích SGK Công Nghệ 10...</span>
          </div>
          <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-purple-500 animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-400">Found: Nguyên lý mạch khuếch đại thuật toán (Op-Amp)</div>
        </div>
      )
    },
    {
      id: 3,
      tag: "AUTO SCHEMATICS",
      title: "Vẽ Sơ Đồ Tự Động",
      desc: "Chỉ cần mô tả, AI sẽ vẽ sơ đồ mạch điện, bảng vẽ kỹ thuật chuẩn sách giáo khoa ngay lập tức thông qua Pollinations.ai.",
      color: "from-orange-500 to-red-500",
      bgGlow: "bg-orange-500/30",
      icon: <PenTool className="w-12 h-12 text-white" />,
      visualContent: (
        <div className="relative h-24 border border-orange-500/30 rounded-lg bg-orange-900/10 flex items-center justify-center">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-orange-500/20"></div>
            ))}
          </div>
          <span className="text-orange-300 text-xs font-mono">Generating Schematic...</span>
        </div>
      )
    },
    {
      id: 4,
      tag: "EXAM PREP",
      title: "Luyện Thi Thông Minh",
      desc: "Hệ thống câu hỏi Trắc nghiệm & Đúng/Sai. Tự động chấm điểm và đưa ra lộ trình ôn tập cá nhân hóa.",
      color: "from-emerald-500 to-teal-400",
      bgGlow: "bg-emerald-500/30",
      icon: <GraduationCap className="w-12 h-12 text-white" />,
      visualContent: (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-emerald-300">
            <span>Tiến độ ôn tập</span>
            <span>85%</span>
          </div>
          <div className="flex gap-1">
            <div className="h-8 w-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={16} /></div>
            <div className="h-8 w-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={16} /></div>
            <div className="h-8 w-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 size={16} /></div>
            <div className="h-8 w-8 rounded bg-gray-700 border border-gray-600"></div>
          </div>
        </div>
      )
    }
  ];

  // Auto-play logic with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* 1. HERO SECTION (CINEMATIC SLIDER) */}
      <div className="relative min-h-[90vh] w-full overflow-hidden flex items-center justify-center bg-gray-900">
        
        {/* Dynamic Background Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 opacity-20 ${slides[activeSlide].color}`} />
        
        {/* Noise Texture for Cinematic Feel */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
        
        {/* Floating Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 opacity-40 ${slides[activeSlide].bgGlow}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] transition-colors duration-1000 opacity-30 ${slides[activeSlide].bgGlow}`} />

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20 lg:pt-0">
          
          {/* Left: Text Content */}
          <div className="space-y-8 animate-fade-in-up z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-300 font-mono text-sm shadow-[0_0_15px_rgba(0,255,255,0.1)]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI Learning Platform 2025</span>
            </div>
            
            <div className="space-y-4">
               <h2 className={`text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${slides[activeSlide].color} transition-all duration-500`}>
                 {slides[activeSlide].tag}
               </h2>
               <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                 {slides[activeSlide].title}
               </h1>
            </div>

            <p className="text-xl text-gray-300 max-w-lg leading-relaxed border-l-4 border-white/10 pl-6 transition-all duration-500">
              {slides[activeSlide].desc}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onStart}
                className="group relative flex items-center gap-4 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">Bắt đầu học ngay</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
              
              <button className="px-8 py-4 rounded-2xl font-semibold text-white border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm">
                Xem Demo
              </button>
            </div>
          </div>

          {/* Right: Visual Card (Glassmorphism) */}
          <div 
            className="hidden lg:flex justify-center perspective-1000"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="relative w-[500px] h-[400px] transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6 preserve-3d">
              
              {/* Glass Card */}
              <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl p-8 flex flex-col justify-between z-10">
                
                {/* Header of Card */}
                <div className="flex justify-between items-start">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${slides[activeSlide].color} shadow-lg transition-all duration-500`}>
                    {slides[activeSlide].icon}
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                </div>
                
                {/* Dynamic Content Area */}
                <div className="mt-8 flex-1 bg-black/20 rounded-2xl p-6 border border-white/5 overflow-hidden relative group">
                   <div className="absolute top-2 right-2 opacity-50"><Terminal size={16} /></div>
                   {slides[activeSlide].visualContent}
                </div>

                {/* Footer of Card */}
                <div className="mt-6 flex justify-between items-center text-white/40 text-xs font-mono">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Gemini-2.5-Flash Connected
                  </span>
                  <span>Latency: 45ms</span>
                </div>
              </div>
              
              {/* Decorative Elements behind card */}
              <div className={`absolute -z-10 top-[-20px] right-[-20px] w-full h-full border border-white/5 rounded-[40px] translate-x-4 translate-y-4`}></div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-12 bg-white shadow-[0_0_10px_white]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* 2. FEATURE GRID (BELOW THE FOLD) */}
      <div className="py-24 px-6 bg-slate-50 text-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Hệ sinh thái <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Công Nghệ 4.0</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Không chỉ là Chatbot, đây là môi trường học tập tích hợp công nghệ AI tiên tiến nhất giúp bạn chinh phục môn Công Nghệ THPT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="text-blue-600" />}
              title="IoT & Vi điều khiển"
              desc="Hỗ trợ viết code và giải thích mạch Arduino, ESP32, cảm biến cho các dự án thực tế."
              delay="0"
            />
            <FeatureCard 
              icon={<Layout className="text-purple-600" />}
              title="Sơ đồ khối & Mạch điện"
              desc="Tự động vẽ sơ đồ nguyên lý mạch điện, sơ đồ khối hệ thống thông tin, viễn thông."
              delay="100"
            />
            <FeatureCard 
              icon={<Zap className="text-yellow-500" />}
              title="Kỹ thuật điện tử"
              desc="Giải bài tập về R, L, C, Diode, Transistor và các mạch khuếch đại, tạo xung."
              delay="200"
            />
            <FeatureCard 
              icon={<BookOpen className="text-emerald-600" />}
              title="Bám sát SGK Mới"
              desc="Dữ liệu được tinh chỉnh theo bộ sách Cánh Diều, Kết Nối Tri Thức và Chân Trời Sáng Tạo."
              delay="300"
            />
            <FeatureCard 
              icon={<GraduationCap className="text-pink-600" />}
              title="Luyện thi trắc nghiệm"
              desc="Tạo đề thi thử, câu hỏi Đúng/Sai với lời giải chi tiết giúp ôn thi THPT hiệu quả."
              delay="400"
            />
            <FeatureCard 
              icon={<Code2 className="text-indigo-600" />}
              title="Hỗ trợ Python/C++"
              desc="Giải bài toán kỹ thuật bằng ngôn ngữ lập trình, hỗ trợ debug và tối ưu code."
              delay="500"
            />
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <div className="bg-slate-100 py-12 border-t border-slate-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white">
              <Brain size={20} />
            </div>
            AI Tech Tutor
          </div>
          <div className="text-slate-500 text-sm">
            © 2025 AI Tech Tutor. Powered by Google Gemini.
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: any) => (
  <div 
    className="group p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
