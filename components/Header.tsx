import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeLinkClass = "bg-blue-600 text-white";
  const inactiveLinkClass = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 backdrop-blur-xl border-b-2 border-white/20">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0 group">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3 group-hover:scale-110 transition-transform">
              <i className="fas fa-graduation-cap text-4xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Ôn Thi THPT Quốc Gia - Công Nghệ</h1>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <i className="fas fa-book-open text-[10px]"></i>
                SGK Kết nối tri thức & Cánh Diều
              </p>
            </div>
        </div>
        <nav className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-center gap-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600 shadow-lg scale-105' : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'} px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
          >
            <i className="fas fa-home"></i> 
            <span className="hidden sm:inline">Trang Chủ</span>
          </NavLink>
          <NavLink
            to="/san-pham-1"
            className={({ isActive }) => `${isActive ? 'bg-white text-purple-600 shadow-lg scale-105' : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'} px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
          >
            <i className="fas fa-comments"></i> 
            <span className="hidden sm:inline">Chat AI</span>
          </NavLink>
          <NavLink
            to="/san-pham-2"
            className={({ isActive }) => `${isActive ? 'bg-white text-green-600 shadow-lg scale-105' : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'} px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
          >
            <i className="fas fa-question-circle"></i> 
            <span className="hidden sm:inline">Câu hỏi</span>
          </NavLink>
          <NavLink
            to="/san-pham-3"
            className={({ isActive }) => `${isActive ? 'bg-white text-purple-600 shadow-lg scale-105' : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'} px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
          >
            <i className="fas fa-industry"></i> 
            <span className="hidden sm:inline">Công nghiệp</span>
          </NavLink>
          <NavLink
            to="/san-pham-4"
            className={({ isActive }) => `${isActive ? 'bg-white text-green-600 shadow-lg scale-105' : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'} px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
          >
            <i className="fas fa-tractor"></i> 
            <span className="hidden sm:inline">Nông nghiệp</span>
          </NavLink>
          <NavLink
            to="/lich-su"
            className={({ isActive }) => `${isActive ? 'bg-white text-pink-600 shadow-lg scale-105' : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'} px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2`}
          >
            <i className="fas fa-history"></i> 
            <span className="hidden sm:inline">Lịch sử</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;