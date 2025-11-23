import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Target,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Circle,
  Award,
  Calendar,
  Clock
} from 'lucide-react';
import { api } from '../utils/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  streak: number;
  weeklyProgress: number;
  avgScore: number;
  recentActivity: any[];
  chartData: number[];
  totalStudyTime?: number;
  completedExams?: number;
  level?: number;
  points?: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  steps: { title: string; completed: boolean; }[];
  color: string;
  locked: boolean;
}

// Motivational quotes
const motivationalQuotes = [
  "Học là hành trình, không phải đích đến! 🚀",
  "Mỗi ngày học một chút, kiến thức sẽ tích lũy thành núi! ⛰️",
  "Đừng so sánh với người khác, hãy so sánh với chính mình ngày hôm qua!💪",
  "Thành công là tổng của những nỗ lực nhỏ mỗi ngày! ✨",
  "Khó khăn tạo nên kỳ tích! 🌟",
  "Bạn giỏi hơn mình nghĩ rất nhiều! 🎯",
  "Học không biết chán, vui vẻ mỗi ngày! 😊",
  "Hôm nay khó, ngày mai khó, nhưng ngày kia sẽ tươi sáng! ☀️"
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    // Load reading time
    const savedReadingTime = parseInt(localStorage.getItem('total_reading_time') || '0', 10);
    setReadingTime(savedReadingTime);

    // Random quote
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    // Timer
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSessionTime(prev => prev + 1);
      // Update reading time from localStorage every second
      const current = parseInt(localStorage.getItem('total_reading_time') || '0', 10);
      setReadingTime(current);
    }, 1000);

    // Fetch stats
    const fetchStats = async () => {
      try {
        const data = await api.dashboard.getStats();
        if (data) {
          setStats(data);
          updateLearningPaths(data, savedReadingTime);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    generateAIRecommendation(savedReadingTime);

    return () => clearInterval(timer);
  }, []);

  const updateLearningPaths = (statsData: DashboardStats, readingMinutes: number) => {
    const completedExams = statsData.completedExams || 0;
    const totalStudyTime = statsData.totalStudyTime || 0;
    const readingMins = Math.floor(readingMinutes / 60);

    // Check if reading threshold is met
    const isUnlocked = readingMins >= 30;

    const paths: LearningPath[] = [
      {
        id: 'industrial',
        title: 'Công nghệ Công nghiệp',
        description: 'Điện, Điện tử, Kỹ thuật cơ khí',
        progress: isUnlocked ? Math.min(100, completedExams * 10) : Math.min(30, readingMins),
        color: 'indigo',
        locked: !isUnlocked,
        steps: [
          { title: 'Điện cơ bản', completed: isUnlocked && completedExams >= 1 },
          { title: 'Điện tử ứng dụng', completed: isUnlocked && completedExams >= 3 },
          { title: 'Kỹ thuật cơ khí', completed: isUnlocked && completedExams >= 5 },
          { title: 'Thực hành dự án', completed: isUnlocked && completedExams >= 8 }
        ]
      },
      {
        id: 'agricultural',
        title: 'Công nghệ Nông nghiệp',
        description: 'Trồng trọt, Chăn nuôi, Lâm nghiệp',
        progress: isUnlocked ? Math.min(100, (totalStudyTime / 3600) * 10) : Math.min(30, readingMins),
        color: 'green',
        locked: !isUnlocked,
        steps: [
          { title: 'Kỹ thuật trồng trọt', completed: isUnlocked && totalStudyTime >= 3600 },
          { title: 'Chăn nuôi gia súc', completed: isUnlocked && totalStudyTime >= 7200 },
          { title: 'Lâm nghiệp bền vững', completed: isUnlocked && totalStudyTime >= 10800 },
          { title: 'Thực hành nông trại', completed: isUnlocked && totalStudyTime >= 14400 }
        ]
      }
    ];

    setLearningPaths(paths);
  };

  const generateAIRecommendation = async (readingSeconds: number) => {
    setLoadingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const readingMins = Math.floor(readingSeconds / 60);
      let recommendations = [];

      if (readingMins < 30) {
        recommendations = [
          `Hãy bắt đầu bằng việc **đọc sách** từ Tủ sách số! Bạn cần ít nhất 30 phút để mở khóa lộ trình. Hiện tại: **${readingMins} phút**. 📚`,
          `Để tiến xa hơn, hãy dành thời gian đọc sách giáo khoa. Mục tiêu: **30 phút** (đã đạt ${readingMins} phút). Đọc càng nhiều, hiểu càng sâu! 📖`,
          `Lộ trình học tập đang chờ bạn! Cần đọc thêm **${30 - readingMins} phút** nữa. Vào Tủ sách số ngay! 🎯`
        ];
      } else {
        recommendations = [
          `Tuyệt vời! Bạn đã đọc **${readingMins} phút**. Tiếp tục với chủ đề **Điện tử ứng dụng**! 💡`,
          `Với **${readingMins} phút** đọc sách, bạn đã sẵn sàng thử nghiệm với **Đề thi thử**! 🎯`,
          `Lộ trình tiến triển tốt! Kết hợp đọc sách với **Chat AI** để củng cố kiến thức! 🚀`,
          `Thời gian đọc: **${readingMins} phút** - xuất sắc! Hãy thực hành ngay! ✨`
        ];
      }

      setAiRecommendation(recommendations[Math.floor(Math.random() * recommendations.length)]);
    } catch (error) {
      console.error('Failed to generate AI recommendation:', error);
      setAiRecommendation("Hãy bắt đầu bằng đọc sách, chatAI hoặc làm đề thi! 💪");
    } finally {
      setLoadingAI(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const level = stats?.level || Math.floor((stats?.completedExams || 0) / 5) + 1;
  const points = stats?.points || ((stats?.completedExams || 0) * 100) + (stats?.streak || 0) * 50;
  const readingMins = Math.floor(readingTime / 60);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50  p-4 md:p-8 space-y-8 animate-fade-in transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">{user?.displayName || 'Học sinh'}</span>!
          </h1>

          <p className="text-indigo-100 text-lg mb-6">{currentQuote}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[160px]">
              <div className="text-indigo-200 text-xs font-bold uppercase flex items-center gap-2 mb-1">
                <Award className="w-3 h-3" /> Level
              </div>
              <div className="text-3xl font-bold">{level}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[160px]">
              <div className="text-indigo-200 text-xs font-bold uppercase flex items-center gap-2 mb-1">
                <Sparkles className="w-3 h-3" /> Điểm
              </div>
              <div className="text-3xl font-bold">{points.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[160px]">
              <div className="text-indigo-200 text-xs font-bold uppercase flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3" /> Đọc sách
              </div>
              <div className="text-3xl font-bold">{readingMins}m</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[160px]">
              <div className="text-indigo-200 text-xs font-bold uppercase flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3" /> Thời gian
              </div>
              <div className="text-2xl font-mono font-bold">{formatTime(sessionTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50   rounded-3xl p-6 border-2 border-purple-100 ">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900  mb-2 flex items-center gap-2">
              Gợi ý học tập từ AI
              <button
                onClick={() => generateAIRecommendation(readingTime)}
                className="text-sm px-3 py-1 bg-purple-100  hover:bg-purple-200 :bg-purple-900/60 text-purple-700  rounded-full transition-colors"
              >
                Làm mới
              </button>
            </h3>
            {loadingAI ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang phân tích...</span>
              </div>
            ) : (
              <p className="text-gray-700  leading-relaxed" dangerouslySetInnerHTML={{ __html: aiRecommendation }} />
            )}
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900  mb-6 flex items-center gap-2">
          <Target className="text-blue-600" />
          Lộ trình học tập của bạn
        </h2>
        {readingMins < 30 && (
          <div className="mb-6 p-4 bg-amber-50  border-2 border-amber-200  rounded-2xl flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-bold text-amber-900 ">Cần đọc sách để mở khóa lộ trình!</p>
              <p className="text-sm text-amber-700 ">
                Bạn cần đọc ít nhất 30 phút (còn {30 - readingMins} phút). Tiến độ: {readingMins}/30 phút
              </p>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {learningPaths.map((path) => (
            <div key={path.id} className={`bg-white  rounded-3xl p-6 shadow-sm border transition-all ${path.locked ? 'border-gray-200  opacity-60' : 'border-gray-100  hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900  flex items-center gap-2">
                    {path.title}
                    {path.locked && <span className="text-sm bg-gray-200  text-gray-600  px-2 py-1 rounded-full">🔒 Khóa</span>}
                  </h3>
                  <p className="text-sm text-gray-500  mt-1">{path.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(path.progress)}%</div>
                  <div className="text-xs text-gray-400">Tiến độ</div>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-100  rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-600 transition-all duration-500 rounded-full"
                  style={{ width: `${path.progress}%` }}
                />
              </div>

              <div className="space-y-3 mb-6">
                {path.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${step.completed ? 'text-gray-900  font-medium' : 'text-gray-500 '}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

              {path.locked ? (
                <Link
                  to="/product8"
                  className="block w-full text-center px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all"
                >
                  📚 Đọc sách để mở khóa
                </Link>
              ) : (
                <Link
                  to={path.id === 'industrial' ? '/san-pham-3' : '/san-pham-4'}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Tiếp tục học
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link to="/san-pham-1" className="flex flex-col items-center p-6 bg-blue-50  hover:bg-blue-100 :bg-blue-900/30 text-blue-600  rounded-2xl hover:scale-105 transition-all">
          <div className="text-4xl mb-2">💬</div>
          <span className="font-bold">Chat AI</span>
        </Link>
        <Link to="/san-pham-2" className="flex flex-col items-center p-6 bg-green-50  hover:bg-green-100 :bg-green-900/30 text-green-600  rounded-2xl hover:scale-105 transition-all">
          <div className="text-4xl mb-2">📝</div>
          <span className="font-bold">Tạo Đề</span>
        </Link>
        <Link to="/product8" className="flex flex-col items-center p-6 bg-orange-50  hover:bg-orange-100 :bg-orange-900/30 text-orange-600  rounded-2xl hover:scale-105 transition-all">
          <div className="text-4xl mb-2">📚</div>
          <span className="font-bold">Tủ Sách</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
