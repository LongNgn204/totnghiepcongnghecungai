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
    Code2
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

    return (
        <aside className={`hidden lg:flex lg:flex-col h-screen bg-orange-50 border-r border-orange-100 sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-[260px]'} z-40`}>
            {/* Logo Section */}
            <div className="h-[72px] flex items-center justify-between px-4 bg-orange-50 border-b border-orange-100">
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-gradient-to-br from-primary to-primary-hover rounded-xl shadow-sm">
                            <Atom className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-orange-900 tracking-tight group-hover:text-primary transition-colors leading-none mb-1">
                                STEM MASTER
                            </span>
                            <span className="font-medium text-[10px] text-orange-700/60 tracking-wider">
                                EDUTECH SYSTEM
                            </span>
                        </div>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-orange-700/50 hover:text-primary transition-all ${collapsed ? 'mx-auto' : ''}`}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto py-6 space-y-8">
                {/* Main Navigation */}
                <div className="px-4">
                    {!collapsed && <h3 className="text-[11px] font-bold text-orange-900/50 mb-3 px-2 uppercase tracking-wider">Chức năng chính</h3>}
                    <div className="space-y-1">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium ${isActive(item.path)
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-orange-900/70 hover:bg-white hover:text-primary hover:shadow-sm group-hover:text-primary'
                                    }`}
                            >
                                <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-orange-900/50 group-hover:text-primary transition-colors'} />
                                {!collapsed && <span className="text-sm group-hover:text-primary transition-colors">{item.label}</span>}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Library Section */}
                <div className="px-4">
                    {!collapsed && <h3 className="text-[11px] font-bold text-orange-900/50 mb-3 px-2 uppercase tracking-wider">Kho tri thức</h3>}
                    <div className="space-y-1">
                        {libraryItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium ${isActive(item.path)
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-orange-100'
                                    : 'text-orange-900/70 hover:bg-white hover:text-primary hover:shadow-sm group-hover:text-primary'
                                    }`}
                            >
                                <item.icon size={20} className={isActive(item.path) ? 'text-primary fill-current' : 'text-orange-900/50 group-hover:text-primary transition-colors'} />
                                {!collapsed && <span className="text-sm group-hover:text-primary transition-colors">{item.label}</span>}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System Section */}
                <div className="px-4">
                    {!collapsed && <h3 className="text-[11px] font-bold text-orange-900/50 mb-3 px-2 uppercase tracking-wider">Hệ thống</h3>}
                    <div className="space-y-1">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-orange-900/70 hover:bg-white hover:text-primary hover:shadow-sm transition-all group font-medium group-hover:text-primary">
                            <User size={20} className="text-orange-900/50 group-hover:text-primary" />
                            {!collapsed && <span className="text-sm group-hover:text-primary transition-colors">Hồ Sơ Học Viên</span>}
                        </Link>
                        <Link to="/community" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-orange-900/70 hover:bg-white hover:text-primary hover:shadow-sm transition-all group font-medium group-hover:text-primary">
                            <Users size={20} className="text-orange-900/50 group-hover:text-primary" />
                            {!collapsed && <span className="text-sm group-hover:text-primary transition-colors">Cộng Đồng STEM</span>}
                        </Link>
                        <Link to="/settings" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-orange-900/70 hover:bg-white hover:text-primary hover:shadow-sm transition-all group font-medium group-hover:text-primary">
                            <Settings size={20} className="text-orange-900/50 group-hover:text-primary" />
                            {!collapsed && <span className="text-sm group-hover:text-primary transition-colors">Cài Đặt</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-orange-100 bg-orange-50">
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-orange-900/70 hover:bg-red-50 hover:text-red-600 transition-all group ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} className="group-hover:stroke-2" />
                    {!collapsed && <span className="font-medium text-sm">Đăng Xuất</span>}
                </button>
            </div>
        </aside>
    );
};

export default NavigationSidebar;
