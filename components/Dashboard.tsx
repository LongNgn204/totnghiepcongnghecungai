import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Zap,
  Clock,
  BookOpen,
  Terminal,
  Microscope,
  Code2,
  BrainCircuit,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock Data for Learning Path
  const learningPath = [
    {
      id: 1,
      title: 'Nhập Môn Công Nghệ',
      desc: 'Làm quen với tư duy máy tính & STEM',
      status: 'completed',
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      id: 2,
      title: 'Lập Trình Python Cơ Bản',
      desc: 'Cú pháp, biến, vòng lặp & hàm',
      status: 'in-progress',
      progress: 65,
      icon: Terminal,
      color: 'text-primary',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    {
      id: 3,
      title: 'Điện Tử & IoT',
      desc: 'Mạch điện, Arduino & Cảm biến',
      status: 'locked',
      icon: Cpu,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      id: 4,
      title: 'Trí Tuệ Nhân Tạo (AI)',
      desc: 'Machine Learning & Ứng dụng thực tế',
      status: 'locked',
      icon: BrainCircuit,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <span className="p-2 bg-orange-50 rounded-lg text-primary">
                <Microscope size={28} />
              </span>
              Xin chào, {user?.displayName || 'Nhà Sáng Tạo'}!
            </h1>
            <p className="text-slate-600 max-w-xl">
              Chào mừng trở lại <strong className="text-primary">Future Lab</strong>. Hôm nay bạn muốn khám phá công nghệ gì?
              Hãy tiếp tục hành trình chinh phục tri thức nhé! 🚀
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[140px]">
              <div className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-2">
                <Clock size={12} /> Thời gian học
              </div>
              <div className="text-2xl font-bold text-slate-800">12h 30m</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 min-w-[140px]">
              <div className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-2">
                <Zap size={12} /> Điểm EXP
              </div>
              <div className="text-2xl font-bold text-primary">1,250</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Code2 className="text-primary" />
              Lộ Trình Học Tập
            </h2>
            <Link to="/learning-path" className="text-sm text-primary hover:text-primary-hover transition-colors font-medium">
              Xem tất cả &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {learningPath.map((item) => (
              <div
                key={item.id}
                className={`relative group transition-all duration-300 ${item.status === 'locked' ? 'opacity-50' : 'hover:-translate-y-1'
                  }`}
              >
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md flex items-center gap-5 h-full transition-all">
                  <div className={`p-4 rounded-xl ${item.bg} ${item.color} border ${item.border}`}>
                    <item.icon size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.status === 'completed' && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200 font-medium">
                          ✓ Hoàn thành
                        </span>
                      )}
                      {item.status === 'in-progress' && (
                        <span className="px-3 py-1 bg-orange-50 text-primary text-xs rounded-full border border-orange-200 font-medium">
                          • Đang học
                        </span>
                      )}
                      {item.status === 'locked' && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full border border-slate-200 font-medium">
                          🔒 Chưa mở
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mb-3">{item.desc}</p>

                    {item.status === 'in-progress' && (
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-primary-hover h-full rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {item.status !== 'locked' && (
                    <button className="p-3 rounded-lg bg-slate-50 hover:bg-primary text-slate-600 hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* AI Assistant Widget - Clean Style */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 h-full flex flex-col items-center text-center group hover:border-orange-300 transition-colors">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <BrainCircuit className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Trợ Lý AI</h3>
            <p className="text-slate-500 text-sm mb-6">
              Gặp khó khăn? Hãy hỏi ngay gia sư công nghệ AI của bạn!
            </p>
            <Link
              to="/san-pham-1"
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              Trò chuyện ngay <ArrowRight size={16} />
            </Link>
          </div>

          {/* Daily Missions - Clean Style */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              Nhiệm Vụ Hàng Ngày
            </h3>
            <div className="space-y-3">
              {[
                { task: 'Hoàn thành bài Python số 3', xp: 50, done: true },
                { task: 'Đặt 3 câu hỏi cho AI', xp: 30, done: false },
                { task: 'Đọc bài viết về IoT', xp: 20, done: false },
              ].map((mission, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-orange-200 transition-all cursor-pointer group hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${mission.done
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-300 group-hover:border-primary bg-white'
                        }`}
                    >
                      {mission.done && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span
                      className={`text-sm ${mission.done ? 'text-slate-400 line-through' : 'text-slate-700'
                        }`}
                    >
                      {mission.task}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-yellow-600">+{mission.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
