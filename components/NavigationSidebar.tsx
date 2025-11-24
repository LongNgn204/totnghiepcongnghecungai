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

    // Các mục hệ thống còn lại (trừ Settings đã chuyển xuống footer)
    const systemItems = [
        { path: '/profile', label: 'Hồ Sơ Học Viên', icon: User },
        { path: '/community', label: 'Cộng Đồng STEM', icon: Users },
    ];

    return (
        <>
            {/* Inject CSS to hide scrollbar */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            
            <aside 
                className={`hidden lg:flex lg:flex-col h-screen bg-white/90 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.05)] rounded-r-3xl sticky top-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-[280px]'} z-40 border-r border-white/20`}
            >
                {/* Logo Section */}
                <div className="h-[80px] flex items-center justify-between px-5 mb-2">
                    {!collapsed && (
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2.5 bg-gradient-to-br from-primary to-primary-hover rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                                <Atom className="text-white" size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base text-slate-800 tracking-tight group-hover:text-primary transition-colors leading-none mb-1">
                                    STEM MASTER
                                </span>
                                <span className="font-medium text-[10px] text-slate-400 tracking-widest uppercase">
                                    Edutech System
                                </span>
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-primary transition-all ${collapsed ? 'mx-auto' : ''}`}
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation Content - Scrollable Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-8 pb-4">
                    {/* Main Navigation */}
                    <div>
                        {!collapsed && <h3 className="text-[11px] font-bold text-slate-400 mb-4 px-3 uppercase tracking-wider">Chức năng chính</h3>}
                        <div className="space-y-1.5">
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 group font-medium ${isActive(item.path)
                                        ? 'bg-primary text-white shadow-md shadow-primary/30 translate-x-1'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary hover:scale-[1.02]'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Library Section */}
                    <div>
                        {!collapsed && <h3 className="text-[11px] font-bold text-slate-400 mb-4 px-3 uppercase tracking-wider">Kho tri thức</h3>}
                        <div className="space-y-1.5">
                            {libraryItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 group font-medium ${isActive(item.path)
                                        ? 'bg-white text-primary shadow-sm ring-1 ring-orange-100 translate-x-1'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary hover:scale-[1.02]'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive(item.path) ? 'text-primary fill-current' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* System Section (Partial) */}
                    <div>
                        {!collapsed && <h3 className="text-[11px] font-bold text-slate-400 mb-4 px-3 uppercase tracking-wider">Hệ thống</h3>}
                        <div className="space-y-1.5">
                            {systemItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 group font-medium ${isActive(item.path)
                                        ? 'bg-slate-100 text-primary font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary hover:scale-[1.02]'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive(item.path) ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Card - Settings & Logout */}
                <div className={`mx-4 mb-6 mt-2 ${collapsed ? 'mx-2' : ''}`}>
                    <div className={`bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 border border-slate-100 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                        
                        {/* Settings Button */}
                        <Link 
                            to="/settings" 
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white hover:shadow-sm hover:text-primary transition-all group w-full ${collapsed ? 'justify-center px-0' : ''}`}
                            title="Cài đặt"
                        >
                            <Settings size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                            {!collapsed && <span className="text-sm font-medium">Cài đặt</span>}
                        </Link>

                        {/* Divider if not collapsed */}
                        {!collapsed && <div className="h-px bg-slate-200 mx-2 my-1"></div>}

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:shadow-sm transition-all group w-full ${collapsed ? 'justify-center px-0' : ''}`}
                            title="Đăng xuất"
                        >
                            <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors" />
                            {!collapsed && <span className="text-sm font-medium">Đăng xuất</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default NavigationSidebar;
