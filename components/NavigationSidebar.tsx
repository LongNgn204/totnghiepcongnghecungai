import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  FileQuestion,
  Cpu,
  Sprout,
  BookOpen,
  User,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Atom,
  Users,
  GraduationCap,
  Code2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NavigationSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: '/dashboard', label: 'GÓC HỌC TẬP', icon: GraduationCap },
    { path: '/smart-ide', label: 'CODE STUDIO', icon: Code2 },
    { path: '/san-pham-1', label: 'TRỢ LÝ AI', icon: MessageSquare },
    { path: '/san-pham-2', label: 'TẠO ĐỀ THI', icon: FileQuestion },
  ];

  const libraryItems = [
    { path: '/san-pham-3', label: 'CÔNG NGHỆ CN', icon: Cpu },
    { path: '/san-pham-4', label: 'CÔNG NGHỆ NN', icon: Sprout },
    { path: '/product8', label: 'TỦ SÁCH SỐ', icon: BookOpen },
  ];

  const systemItems = [
    { path: '/profile', label: 'Hồ Sơ Học Viên', icon: User },
    { path: '/community', label: 'Cộng Đồng STEM', icon: Users },
  ];

  const NavGroup: React.FC<{ title: string; items: typeof mainNavItems }> = ({ title, items }) => (
    <div>
      {!collapsed && (
        <h3 className="text-[11px] font-bold text-text-tertiary mb-3 px-3 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1.5">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all duration-200 group font-medium
                ${active
                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-900/40'
                  : 'text-text-secondary border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'}
              `}
            >
              <item.icon
                size={20}
                className={`${active ? 'text-primary-600 dark:text-primary-300' : 'text-text-secondary group-hover:text-text-primary'} transition-colors`}
              />
              {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Hide scrollbar utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <aside
        className={`hidden lg:flex lg:flex-col h-screen bg-surface sticky top-0 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } z-40 border-r border-border shadow-sm`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-3">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-primary-600 text-white shadow-orange-glow">
                <Atom size={20} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-extrabold text-sm tracking-tight text-text-primary">STEM MASTER</span>
                <span className="font-medium text-[10px] text-text-tertiary tracking-wide uppercase leading-3">Học tập Công nghệ</span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-secondary transition-all ${
              collapsed ? 'mx-auto' : ''
            }`}
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 space-y-6 pb-4">
          <NavGroup title="Chức năng chính" items={mainNavItems} />
          <NavGroup title="Kho tri thức" items={libraryItems} />
          <NavGroup title="Hệ thống" items={systemItems} />
        </div>

        {/* Footer Card - Settings & Logout */}
        <div className={`mx-3 mb-4 mt-1 ${collapsed ? 'mx-2' : ''}`}>
          <div className={`bg-surface rounded-xl p-2 border border-border ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group w-full ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title="Cài đặt" aria-label="Cài đặt"
            >
              <Settings size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
              {!collapsed && <span className="text-sm font-medium">Cài đặt</span>}
            </Link>

            {!collapsed && <div className="h-px bg-border mx-2 my-1" />}

            <button
              onClick={logout}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-accent-red-600 hover:bg-accent-red-50 dark:hover:bg-accent-red-900/20 transition-all group w-full ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title="Đăng xuất" aria-label="Đăng xuất"
            >
              <LogOut size={18} className="text-accent-red-500 group-hover:text-accent-red-700 transition-colors" />
              {!collapsed && <span className="text-sm font-medium">Đăng xuất</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
