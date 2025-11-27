import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  GraduationCap,
  Code2,
  MessageSquare,
  FileQuestion,
  Cpu,
  Sprout,
  BookOpen,
  Users,
  User,
  Settings,
  LogOut,
  Atom,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: '/dashboard', label: 'Góc học tập', icon: GraduationCap },
    { path: '/smart-ide', label: 'Code Studio', icon: Code2 },
    { path: '/san-pham-1', label: 'Trợ lý AI', icon: MessageSquare },
    { path: '/san-pham-2', label: 'Tạo đề thi', icon: FileQuestion },
  ];

  const libraryItems = [
    { path: '/san-pham-3', label: 'Công nghệ CN', icon: Cpu },
    { path: '/san-pham-4', label: 'Công nghệ NN', icon: Sprout },
    { path: '/product8', label: 'Tủ sách số', icon: BookOpen },
  ];

  const systemItems = [
    { path: '/community', label: 'Cộng đồng', icon: Users },
    { path: '/profile', label: 'Hồ sơ', icon: User },
    { path: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      // focus close button
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const Section: React.FC<{ title: string; items: typeof mainNavItems }> = ({ title, items }) => (
    <div className="mt-4">
      <h3 className="text-[11px] font-bold text-text-tertiary mb-2 px-2 uppercase tracking-wider">{title}</h3>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
              isActive(item.path)
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'text-text-secondary border-transparent hover:bg-neutral-100'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="overlay" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 left-0 w-[84%] max-w-sm bg-surface border-r border-border shadow-xl p-4 flex flex-col animate-slide-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-600 text-white shadow-orange-glow">
              <Atom size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold">STEM MASTER</div>
              <div className="text-[10px] text-text-tertiary uppercase">Học tập Công nghệ</div>
            </div>
          </div>
          <button ref={closeBtnRef} onClick={onClose} className="btn-icon" aria-label="Đóng menu">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 -mr-1">
          <Section title="Chức năng chính" items={mainNavItems} />
          <Section title="Kho tri thức" items={libraryItems} />
          <Section title="Hệ thống" items={systemItems} />
        </div>

        <div className="pt-2 border-t border-border">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-accent-red-600 hover:bg-accent-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;

