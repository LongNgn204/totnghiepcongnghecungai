import React from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import MobileNav from '../components/MobileNav';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Desktop Sidebar */}
            <NavigationSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800 relative pb-20 lg:pb-0">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
};

export default MainLayout;
