import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Cpu,
  Code2,
  Trophy,
  Zap,
  BookOpen,
  Save,
  X,
  Shield,
  Quote,
  Clock,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/apiClient';
import { toast } from 'react-hot-toast';


const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    examsCompleted: 0,
    studyTime: 0,
    flashcardsLearned: 0,
    currentStreak: 0
  });

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    bio: user?.bio || 'Đang học tập chăm chỉ để đạt kết quả tốt!',
    phone: '0987 654 321',
    address: 'Hà Nội, Việt Nam',
    school: 'THPT Chuyên KHTN',
    dob: '01/01/2008'
  });

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    return hours > 0 ? `${hours}h` : `${Math.floor(seconds / 60)}m`;
  };

  const statCards = [
    {
      label: 'Dự án',
      value: stats.examsCompleted,
      icon: BookOpen,
      chip: 'Hoàn thành',
      bg: 'from-accent-blue-50 dark:from-accent-blue-900/50 to-surface',
      iconColor: 'text-accent-blue-500'
    },
    {
      label: 'XP',
      value: '1.2k',
      icon: Zap,
      chip: 'Tăng 12%',
      bg: 'from-accent-purple-50 dark:from-accent-purple-900/50 to-surface',
      iconColor: 'text-accent-purple-500'
    },
    {
      label: 'Chứng chỉ',
      value: stats.flashcardsLearned,
      icon: Shield,
      chip: 'STEM',
      bg: 'from-accent-green-50 dark:from-accent-green-900/50 to-surface',
      iconColor: 'text-accent-green-500'
    },
    {
      label: 'Giờ học',
      value: formatTime(stats.studyTime),
      icon: Clock,
      chip: 'Tuần này',
      bg: 'from-primary-50 dark:from-primary-900/50 to-surface',
      iconColor: 'text-primary-500'
    }
  ];

  const infoFields = [
    { key: 'name', label: 'Họ và tên', icon: User, placeholder: 'Nhập họ và tên...' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'Nhập email...' },
    { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: 'Nhập số điện thoại...' },
    { key: 'address', label: 'Địa chỉ', icon: MapPin, placeholder: 'Nhập địa chỉ...' },
    { key: 'dob', label: 'Ngày sinh', icon: Calendar, placeholder: 'DD/MM/YYYY' },
    { key: 'school', label: 'Trường học', icon: Shield, placeholder: 'Nhập tên trường...' }
  ] as const;

  const interestTags = ['Lập trình Web', 'Trí tuệ nhân tạo', 'Robotics', 'IoT', 'Thiết kế 3D', 'Blockchain', 'Game Dev'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.dashboard.getStats();
        if (data) {
          setStats({
            examsCompleted: data.completedExams || 0,
            studyTime: parseInt(localStorage.getItem('total_reading_time') || '0', 10),
            flashcardsLearned: data.flashcardsLearned || 0,
            currentStreak: data.streak || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({
        displayName: formData.name,
        bio: formData.bio
      });
      setIsEditing(false);
      toast.success('Cập nhật hồ sơ thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl gradient-primary text-white shadow-lg shadow-primary-500/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-lighten" />
          <div className="relative px-8 py-10 flex flex-col lg:flex-row gap-8 lg:items-center">
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-surface/10 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} className="text-white/70" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 bg-surface text-primary rounded-full p-2 shadow-lg hover:scale-105 transition">
                  <Camera size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">{formData.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-surface/15 border border-white/30 text-sm font-semibold flex items-center gap-1">
                    <Trophy size={14} />
                    LV.5
                  </span>
                </div>
                <p className="text-white/80 text-base flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2">
                    <Code2 size={18} />
                    Nhà phát triển tương lai
                  </span>
                  <span className="h-1 w-1 rounded-full bg-surface/60" />
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Tham gia T9/2024
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Chinh phục STEM', 'Nhà vô địch tỉnh', 'Top 5 Leaderboard'].map((badge) => (
                    <span key={badge} className="px-3 py-1 text-xs font-semibold rounded-full bg-surface/10 border border-white/20">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="self-start lg:self-auto px-6 py-3 bg-surface text-primary font-semibold rounded-2xl shadow-lg hover:shadow-xl transition flex items-center gap-2"
              >
                <Edit2 size={18} />
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>

        {/* Stats + Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="rounded-3xl bg-surface shadow-md border border-border p-6">
              <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2 mb-6">
                <Trophy className="text-accent-yellow-500" size={22} />
                Thành tích học tập
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {statCards.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border border-slate-100 bg-gradient-to-br ${stat.bg} p-4 shadow-sm hover:shadow-md transition`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface/60 text-slate-600">{stat.chip}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                      <stat.icon size={28} className={`${stat.iconColor}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-surface border border-slate-100 shadow-[0_20px_45px_rgba(15,23,42,0.06)] p-6">
              <h3 className="text-slate-800 font-bold text-lg flex items-center gap-3 mb-4">
                <Cpu className="text-accent-purple-500" size={22} />
                Sở thích công nghệ
              </h3>
              <div className="flex flex-wrap gap-3">
                {interestTags.map((tag, idx) => (
                  <span
                    key={tag}
                    className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition ${
                      idx % 2 === 0
                        ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                        : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                <button className="px-4 py-2 rounded-2xl border border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-primary hover:text-primary transition flex items-center gap-2">
                  <Plus size={16} />
                  Thêm sở thích
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-surface shadow-md border border-border p-6">
              <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2 mb-6">
                <User className="text-primary" size={20} />
                Thông tin cá nhân
              </h3>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {infoFields.map((field) => {
                      const Icon = field.icon;
                      const inputType = field.key === 'email' ? 'email' : 'text';
                      return (
                        <div key={field.key} className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <Icon size={14} /> {field.label}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                              <Icon size={18} />
                            </div>
                            <input
                              type={inputType}
                              value={formData[field.key]}
                              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                              placeholder={field.placeholder}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div className="col-span-full space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <Quote size={14} /> Giới thiệu
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 p-4 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none"
                        placeholder="Viết đôi dòng giới thiệu về bản thân..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition flex items-center justify-center gap-2"
                    >
                      <Save size={20} /> Lưu thay đổi
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 rounded-2xl border border-border text-text-secondary hover:border-neutral-300 hover:text-text-primary transition flex items-center justify-center gap-2 bg-surface"
                    >
                      <X size={20} /> Hủy bỏ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {infoFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.key} className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                          <Icon size={14} /> {field.label}
                        </label>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-900 font-semibold flex items-center gap-3">
                          <Icon size={18} className="text-slate-400" />
                          <span className="truncate">{formData[field.key]}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      <Code2 size={14} /> Giới thiệu
                    </label>
                    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-6 relative overflow-hidden">
                      <Quote size={60} className="absolute top-4 left-4 text-primary/10 rotate-180" />
                      <p className="text-slate-600 italic relative z-10 pl-8">"{formData.bio}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;