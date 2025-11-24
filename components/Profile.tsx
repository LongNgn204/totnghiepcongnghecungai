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
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/apiClient';
import { toast } from 'react-hot-toast';
import TechBadge from './TechBadge';

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

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    return hours > 0 ? `${hours}h` : `${Math.floor(seconds / 60)}m`;
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 w-full rounded-2xl bg-gradient-to-r from-primary to-primary-hover relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-stem-bg to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-6 relative -mt-16 flex flex-col md:flex-row items-end md:items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-surface border-4 border-stem-bg shadow-xl overflow-hidden relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface text-slate-500">
                  <User size={48} />
                </div>
              )}
              <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </button>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-lg border-4 border-stem-bg shadow-lg">
              <Zap size={16} fill="currentColor" />
            </div>
          </div>

          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {formData.name}
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30 font-mono">LV.5</span>
            </h1>
            <p className="text-slate-400 flex items-center gap-2 mt-1">
              <Code2 size={16} className="text-primary" />
              Nhà Phát Triển Tương Lai
            </p>
          </div>

          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary mb-4">
              <Edit2 size={16} />
              Chỉnh Sửa Hồ Sơ
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats & Badge */}
        <div className="space-y-6">
          {/* Tech Badge */}
          <TechBadge />

          {/* Stats Card */}
          <div className="bg-surface border border-surface-highlight rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-400" size={20} />
              Thành Tích
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-3 rounded-lg border border-surface-highlight text-center">
                <div className="text-2xl font-bold text-white">{stats.examsCompleted}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Dự Án</div>
              </div>
              <div className="bg-background p-3 rounded-lg border border-surface-highlight text-center">
                <div className="text-2xl font-bold text-primary">1.2k</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Điểm XP</div>
              </div>
              <div className="bg-background p-3 rounded-lg border border-surface-highlight text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.flashcardsLearned}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Chứng Chỉ</div>
              </div>
              <div className="bg-background p-3 rounded-lg border border-surface-highlight text-center">
                <div className="text-2xl font-bold text-primary">{formatTime(stats.studyTime)}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Giờ Học</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface border border-surface-highlight rounded-xl p-6">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <User className="text-primary" size={20} />
              Thông Tin Cá Nhân
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">Họ và Tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-stem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">Giới thiệu</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-stem min-h-[100px]"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-surface-highlight">
                  <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                    <Save size={18} /> Lưu Thay Đổi
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1 justify-center">
                    <X size={18} /> Hủy Bỏ
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Họ và Tên</label>
                  <div className="input-stem flex items-center gap-3">
                    <User size={18} className="text-slate-500" />
                    <span>{formData.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                  <div className="input-stem flex items-center gap-3">
                    <Mail size={18} className="text-slate-500" />
                    <span>{formData.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Số Điện Thoại</label>
                  <div className="input-stem flex items-center gap-3">
                    <Phone size={18} className="text-slate-500" />
                    <span>{formData.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Địa Chỉ</label>
                  <div className="input-stem flex items-center gap-3">
                    <MapPin size={18} className="text-slate-500" />
                    <span>{formData.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ngày Sinh</label>
                  <div className="input-stem flex items-center gap-3">
                    <Calendar size={18} className="text-slate-500" />
                    <span>{formData.dob}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Trường Học</label>
                  <div className="input-stem flex items-center gap-3">
                    <Shield size={18} className="text-slate-500" />
                    <span>{formData.school}</span>
                  </div>
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Giới thiệu</label>
                  <div className="p-4 bg-background rounded-lg border border-surface-highlight text-slate-300 italic">
                    "{formData.bio}"
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface border border-surface-highlight rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="text-primary" size={20} />
              Sở Thích Công Nghệ
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Lập trình Web', 'Trí tuệ nhân tạo', 'Robotics', 'IoT', 'Thiết kế 3D'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-background border border-surface-highlight rounded-full text-sm text-slate-300 hover:border-primary hover:text-primary transition-colors cursor-default">
                  {tag}
                </span>
              ))}
              <button className="px-3 py-1 border border-dashed border-slate-600 rounded-full text-sm text-slate-500 hover:text-white hover:border-white transition-colors">
                + Thêm sở thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
