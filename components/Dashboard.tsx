import React, { useState, useEffect } from 'react';
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
  Loader2,
  AlertCircle,
  Copy,
  TrendingUp,
  Target,
  AlertTriangle,
  Sparkles,
  Calendar,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/apiClient';
import { getStats, getAllSessions, StudySession, getAchievements, Achievement } from '../utils/studyProgress';

interface DashboardStats {
  totalStudyTime: number;
  totalExams: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  flashcardsLearned: number;
  chatSessions: number;
  weeklyActiveDays: number;
  completedExams?: number;
  streak?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get recent activities and achievements from local storage
        const sessions = getAllSessions();
        setRecentActivities(sessions.slice(0, 5)); // Get top 5 recent sessions
        setAchievements(getAchievements());

        // Try to fetch from backend API first
        try {
          const dashboardStats = await api.dashboard.getStats();
          setStats({
            totalStudyTime: dashboardStats.totalStudyTime || 0,
            totalExams: dashboardStats.totalExams || dashboardStats.completedExams || 0,
            averageScore: dashboardStats.averageScore || 0,
            currentStreak: dashboardStats.currentStreak || dashboardStats.streak || 0,
            longestStreak: dashboardStats.longestStreak || 0,
            flashcardsLearned: dashboardStats.flashcardsLearned || 0,
            chatSessions: dashboardStats.chatSessions || 0,
            weeklyActiveDays: dashboardStats.weeklyActiveDays || 0,
          });
        } catch (apiError) {
          // Fallback to local storage data
          console.log('Using local storage data:', apiError);
          const localStats = getStats();
          setStats({
            totalStudyTime: localStats.totalStudyTime,
            totalExams: localStats.totalExams,
            averageScore: localStats.averageScore,
            currentStreak: localStats.currentStreak,
            longestStreak: localStats.longestStreak,
            flashcardsLearned: localStats.flashcardsLearned,
            chatSessions: localStats.chatSessions,
            weeklyActiveDays: localStats.weeklyActiveDays,
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Không thể tải dữ liệu. Đang sử dụng dữ liệu cục bộ.');
        // Use local data as final fallback
        const localStats = getStats();
        setStats({
          totalStudyTime: localStats.totalStudyTime,
          totalExams: localStats.totalExams,
          averageScore: localStats.averageScore,
          currentStreak: localStats.currentStreak,
          longestStreak: localStats.longestStreak,
          flashcardsLearned: localStats.flashcardsLearned,
          chatSessions: localStats.chatSessions,
          weeklyActiveDays: localStats.weeklyActiveDays,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock Data for Learning Path (this will be dynamic in future)
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
      progress: stats ? Math.min((stats.totalExams / 10) * 100, 100) : 65,
      icon: Terminal,
      color: 'text-primary',
      bg: 'bg-surface-hover',
      border: 'border-border'
    },
    {
      id: 3,
      title: 'Điện Tử & IoT',
      desc: 'Mạch điện, Arduino & Cảm biến',
      status: stats && stats.totalExams >= 5 ? 'in-progress' : 'locked',
      icon: Cpu,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      id: 4,
      title: 'Trí Tuệ Nhân Tạo (AI)',
      desc: 'Machine Learning & Ứng dụng thực tế',
      status: stats && stats.totalExams >= 10 ? 'in-progress' : 'locked',
      icon: BrainCircuit,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  ];

  // Mock AI Analysis Data
  const aiAnalysis = {
    strengths: ['Tư duy Logic', 'Lập trình cơ bản'],
    weaknesses: ['Lý thuyết mạch điện', 'Từ vựng chuyên ngành'],
    focus: 85,
    efficiency: 92,
    recommendation: 'Dựa trên kết quả gần đây, bạn nên dành 30 phút ôn tập lại công thức tính công suất mạch 3 pha để cải thiện điểm số.',
    nextGoal: 'Hoàn thành bài kiểm tra Chương 2 với >8 điểm'
  };

  // Format time display
  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-border p-8 shadow-lg">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-text-secondary font-medium">Đang tải dữ liệu học tập...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Error Alert */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {/* Hero Section with AI Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome & Stats */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <Microscope size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Xin chào, {user?.displayName || 'Nhà Sáng Tạo'}! <span className="text-2xl">👋</span>
                </h1>
                <p className="text-slate-300 mt-1">
                  Hôm nay là một ngày tuyệt vời để khám phá công nghệ mới!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                  <Clock size={14} /> Thời gian học
                </div>
                <div className="text-2xl font-bold">
                  {stats ? formatStudyTime(stats.totalStudyTime) : '0m'}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                  <Zap size={14} /> Điểm EXP
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {stats ? (stats.totalExams * 100 + stats.chatSessions * 50 + stats.flashcardsLearned * 10).toLocaleString() : 0}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                  <Activity size={14} /> Chuỗi ngày
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {stats?.currentStreak || 0} <span className="text-sm font-normal text-slate-400">ngày</span>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                  <Trophy size={14} /> Huy hiệu
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {achievements.filter(a => a.unlockedAt).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Widget */}
        <div className="bg-surface rounded-3xl p-6 shadow-lg border border-border flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 blur-[50px] rounded-full pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Trợ Lý AI</h3>
              <p className="text-xs text-text-secondary">Phân tích học tập thông minh</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text-secondary uppercase">Độ tập trung</span>
                <span className="text-sm font-bold text-emerald-600">{aiAnalysis.focus}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${aiAnalysis.focus}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-text-secondary italic">
                "{aiAnalysis.recommendation}"
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <Target size={14} />
                Mục tiêu: {aiAnalysis.nextGoal}
              </div>
            </div>
          </div>

          <Link
            to="/san-pham-1"
            className="mt-4 w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02]"
          >
            Hỏi chi tiết <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Path & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Path */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Code2 className="text-primary" />
                Lộ Trình Học Tập
              </h2>
              <Link to="/learning-path" className="text-sm text-primary hover:text-primary-hover transition-colors font-medium">
                Xem chi tiết &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPath.map((item) => (
                <div
                  key={item.id}
                  className={`relative group transition-all duration-300 ${item.status === 'locked' ? 'opacity-60' : 'hover:-translate-y-1'}`}
                >
                  <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${item.bg} ${item.color} border ${item.border}`}>
                        <item.icon size={24} />
                      </div>
                      {item.status === 'completed' && <CheckCircle2 className="text-emerald-500" size={20} />}
                      {item.status === 'locked' && <div className="text-slate-400"><AlertCircle size={20} /></div>}
                    </div>

                    <h3 className="font-bold text-lg text-text-primary mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 flex-1">{item.desc}</p>

                    {item.status === 'in-progress' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-text-secondary">Tiến độ</span>
                          <span className="text-primary">{Math.round(item.progress || 0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-primary-hover h-full rounded-full transition-all"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {item.status === 'locked' && (
                      <div className="w-full py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-lg text-center uppercase tracking-wider">
                        Chưa mở khóa
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Detail */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
              <BrainCircuit className="text-purple-500" size={20} />
              Phân Tích Chuyên Sâu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-emerald-600 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} /> Điểm Mạnh
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.strengths.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-sm text-emerald-800 border border-emerald-100">
                      <CheckCircle2 size={14} /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} /> Cần Cải Thiện
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.weaknesses.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-surface-hover rounded-lg text-sm text-accent-red-800 border border-border">
                      <Target size={14} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              Truy Cập Nhanh
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
              <Link to="/product-3" className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex flex-col items-center gap-2 text-center group">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <span className="text-xs font-bold">Thi Thử</span>
              </Link>
              <Link to="/san-pham-1" className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors flex flex-col items-center gap-2 text-center group">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <BrainCircuit size={20} />
                </div>
                <span className="text-xs font-bold">Hỏi AI</span>
              </Link>
              <Link to="/flashcards" className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex flex-col items-center gap-2 text-center group">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Copy size={20} />
                </div>
                <span className="text-xs font-bold">Flashcard</span>
              </Link>
              <Link to="/ide" className="p-3 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors flex flex-col items-center gap-2 text-center group">
                <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Terminal size={20} />
                </div>
                <span className="text-xs font-bold">Smart IDE</span>
              </Link>
            </div>
          </div>

          {/* Daily Missions */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Nhiệm Vụ Hôm Nay
            </h3>
            <div className="space-y-3">
              {[
                { task: 'Hoàn thành bài Python số 3', xp: 50, done: true },
                { task: 'Đặt 3 câu hỏi cho AI', xp: 30, done: false },
                { task: 'Đọc bài viết về IoT', xp: 20, done: false },
              ].map((mission, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-all cursor-pointer group"
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
                      className={`text-sm font-medium ${mission.done ? 'text-slate-400 line-through' : 'text-slate-700'
                        }`}
                    >
                      {mission.task}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-lg">+{mission.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Clock className="text-slate-400" size={20} />
              Hoạt Động Gần Đây
            </h3>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.activity === 'exam' ? 'bg-blue-100 text-blue-600' :
                      activity.activity === 'chat' ? 'bg-purple-100 text-purple-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                      {activity.activity === 'exam' ? <BookOpen size={14} /> :
                        activity.activity === 'chat' ? <BrainCircuit size={14} /> :
                          <Copy size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {activity.activity === 'exam' ? 'Làm bài thi' :
                          activity.activity === 'chat' ? 'Trò chuyện với AI' :
                            'Ôn tập Flashcard'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(activity.date).toLocaleDateString('vi-VN')} • {activity.duration} phút
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary text-center py-4">Chưa có hoạt động nào gần đây.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
