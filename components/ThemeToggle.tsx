import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ||
                localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return true; // Default to dark
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-gray-100  text-gray-600  hover:bg-gray-200 :bg-slate-700 transition-all shadow-sm border border-gray-200  group cursor-pointer relative z-50"
            title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        >
            {isDark ? (
                <Sun size={20} className="group-hover:text-yellow-500 transition-colors" />
            ) : (
                <Moon size={20} className="group-hover:text-blue-500 transition-colors" />
            )}
        </button>
    );
};

export default ThemeToggle;
