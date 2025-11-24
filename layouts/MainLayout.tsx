import React from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-text-main font-sans">
            {/* Sidebar (Navigation) */}
            <NavigationSidebar />

            {/* Main Content Area - Light Theme */}
            <main className="flex-1 overflow-y-auto relative bg-background">
                <div className="min-h-full p-0 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
