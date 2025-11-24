import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'TRANG CHỦ', path: '/' },
    { label: 'GÓC HỌC TẬP', path: '/dashboard' },
    { label: 'CỘNG ĐỒNG', path: '/community' },
    { label: 'HỒ SƠ', path: '/profile' },
  ];

  return (
    <>
      <header className="bg-white text-text-main h-[80px] flex flex-col relative z-50 shadow-sm">
        {/* Top Bar (Small) */}
        <div className="h-[30px] flex justify-end items-center px-4 text-xs space-x-4 bg-slate-50">
          {user ? (
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 hover:text-primary transition-colors text-slate-600">
                <Mail size={14} />
                <span>Thông báo</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Xin chào,</span>
                <span className="font-bold text-primary">{user.displayName}</span>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="hover:text-primary text-slate-600">
              Đăng nhập
            </button>
          )}
        </div>

        {/* Main Header Content */}
        <div className="flex-1 flex items-center justify-between px-4 sm:px-8 bg-white">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 hover:text-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links (Big) */}
          <nav className="hidden md:flex items-center space-x-8 mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-sm font-bold tracking-wider transition-all duration-200 pb-1 ${isActive(item.path)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-600 hover:text-primary'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-slate-50 text-sm text-slate-700 px-4 py-1.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary w-48 transition-all placeholder-slate-400"
              />
              <Search size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-[80px] left-0 w-full bg-white p-4 flex flex-col space-y-4 md:hidden shadow-lg animate-slide-down">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-bold ${isActive(item.path) ? 'text-primary' : 'text-slate-600'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;
