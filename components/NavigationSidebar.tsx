import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    FileQuestion,
    Factory,
    Tractor,
    BookOpen,
    History,
    User,
    Settings,
    ChevronRight,
    GraduationCap,
    ChevronLeft,
    LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NavigationSidebar: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const mainNavItems = [
        { path: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard, color: 'blue' },
        { path: '/san-pham-1', label: 'Chat AI', icon: MessageSquare, color: 'purple' },
        { path: '/san-pham-2', label: 'Tạo đề thi', icon: FileQuestion, color: 'green' },
    ];

    const learningNavItems = [
        { path: '/san-pham-3', label: 'Công nghiệp', icon: Factory, color: 'indigo' },
        { path: '/san-pham-4', label: 'Nông nghiệp', icon: Tractor, color: 'teal' },
        { path: '/product8', label: 'Tủ sách số', icon: BookOpen, color: 'orange' },
    ];

    const statsNavItems = [
        { path: '/history', label: 'Lịch sử thi', icon: History, color: 'pink' },
    ];

    const settingsNavItems = [
        { path: '/profile', label: 'Hồ sơ', icon: User, color: 'gray' },
        { path: '/settings', label: 'Cài đặt', icon: Settings, color: 'gray' },
    ];

    const getColorClasses = (color: string, active: boolean) => {
        const colorMap: Record<string, { active: string, icon: string, indicator: string }> = {
            blue: {
                active: 'bg-blue-50  border-blue-200  text-blue-700 ',
                icon: 'bg-blue-100  text-blue-600 ',
                indicator: 'bg-blue-600 '
            },
            purple: {
                active: 'bg-purple-50  border-purple-200  text-purple-700 ',
                icon: 'bg-purple-100  text-purple-600 ',
                indicator: 'bg-purple-600 '
            },
            green: {
                active: 'bg-green-50  border-green-200  text-green-700 ',
                icon: 'bg-green-100  text-green-600 ',
                indicator: 'bg-green-600 '
            },
            indigo: {
                active: 'bg-indigo-50  border-indigo-200  text-indigo-700 ',
                icon: 'bg-indigo-100  text-indigo-600 ',
                indicator: 'bg-indigo-600 '
            },
            teal: {
                active: 'bg-teal-50  border-teal-200  text-teal-700 ',
                icon: 'bg-teal-100  text-teal-600 ',
                indicator: 'bg-teal-600 '
            },
            orange: {
                active: 'bg-orange-50  border-orange-200  text-orange-700 ',
                icon: 'bg-orange-100  text-orange-600 ',
                indicator: 'bg-orange-600 '
            },
            yellow: {
                active: 'bg-yellow-50  border-yellow-200  text-yellow-700 ',
                icon: 'bg-yellow-100  text-yellow-600 ',
                indicator: 'bg-yellow-600 '
            },
            pink: {
                active: 'bg-pink-50  border-pink-200  text-pink-700 ',
                icon: 'bg-pink-100  text-pink-600 ',
                indicator: 'bg-pink-600 '
            },
            gray: {
                active: 'bg-gray-50  border-gray-200  text-gray-700 ',
                icon: 'bg-gray-100  text-gray-600 ',
                indicator: 'bg-gray-600 '
            }
        };
        return colorMap[color] || colorMap.blue;
    };

    const NavItem = ({ item }: any) => {
        const active = isActive(item.path);
        const Icon = item.icon;
        const colors = getColorClasses(item.color, active);

        return (
            <Link
                to={item.path}
                className={`
          group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
          ${active
                        ? `${colors.active} shadow-sm border`
                        : 'text-gray-600  hover:bg-gray-50 :bg-slate-800 hover:text-gray-900 :text-gray-200'
                    }
        `}
                title={collapsed ? item.label : ''}
            >
                {/* Active indicator */}
                {active && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${colors.indicator} rounded-r-full`} />
                )}

                <div className={`
          p-2 rounded-lg transition-colors
          ${active
                        ? colors.icon
                        : 'bg-gray-100  group-hover:bg-gray-200 :bg-slate-700'
                    }
        `}>
                    <Icon size={18} className={active ? '' : 'text-gray-500 '} />
                </div>

                {!collapsed && (
                    <>
                        <span className="flex-1 font-medium text-sm">{item.label}</span>
                        {active && <ChevronRight size={16} />}
                    </>
                )}
            </Link>
        );
    };

    return (
        <aside className={`hidden lg:flex lg:flex-col h-screen bg-white  border-r border-gray-200  sticky top-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-100  relative">
                <Link to="/" className={`flex items-center gap-3 group ${collapsed ? 'justify-center' : ''}`}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                            <GraduationCap className="text-white" size={28} />
                        </div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-gray-900  leading-tight">
                                Ôn Thi THPT
                            </span>
                            <span className="text-xs text-gray-500  font-medium">
                                Môn Công Nghệ
                            </span>
                        </div>
                    )}
                </Link>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white  border border-gray-200  rounded-full flex items-center justify-center text-gray-600  hover:bg-gray-50 :bg-slate-700 transition-all shadow-sm"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* User Profile Card - Hidden when collapsed */}
            {!collapsed && user && (
                <div className="px-4 pt-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50   rounded-2xl p-4 border border-blue-100 ">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900  truncate">{user.displayName || 'Học sinh'}</p>
                                <p className="text-xs text-gray-500  truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed User Avatar */}
            {collapsed && user && (
                <div className="px-4 pt-4 flex justify-center">
                    <Link to="/profile" title={user.displayName || user.email}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform">
                            {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </Link>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 ">
                {/* Main Section */}
                <div>
                    {!collapsed && (
                        <h3 className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Chính
                        </h3>
                    )}
                    <div className="space-y-1">
                        {mainNavItems.map((item) => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </div>
                </div>

                {/* Learning Section */}
                <div>
                    {!collapsed && (
                        <h3 className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Học tập
                        </h3>
                    )}
                    <div className="space-y-1">
                        {learningNavItems.map((item) => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div>
                    {!collapsed && (
                        <h3 className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Thống kê
                        </h3>
                    )}
                    <div className="space-y-1">
                        {statsNavItems.map((item) => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </div>
                </div>

                {/* Settings Section */}
                <div>
                    {!collapsed && (
                        <h3 className="px-3 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Cài đặt
                        </h3>
                    )}
                    <div className="space-y-1">
                        {settingsNavItems.map((item) => (
                            <NavItem key={item.path} item={item} />
                        ))}

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600 transition-all">
                                <LogOut size={18} />
                            </div>
                            {!collapsed && (
                                <span className="font-medium text-sm">Đăng xuất</span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-100">
                    <div className="text-center text-xs text-gray-400">
                        <p className="font-medium">Phiên bản 2.0</p>
                        <p className="mt-1">Powered by Gemini 2.5 Pro</p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default NavigationSidebar;
