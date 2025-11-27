import React, { useState } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import ThemeToggle from '../components/ThemeToggle';
import MobileNav from '../components/MobileNav';
import MobileSidebar from '../components/MobileSidebar';
import { Menu } from 'lucide-react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background text-text-primary font-sans">
            {/* Desktop Sidebar */}
            <NavigationSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-background">
                {/* Top App Bar */}
                <div className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
                    <div className="h-12 px-3 md:px-6 flex items-center justify-between gap-2">
                        {/* Mobile menu button */}
                        <button
                          className="md:hidden btn-icon"
                          aria-label="Mở menu"
                          onClick={() => setMobileOpen(true)}
                        >
                          <Menu size={18} />
                        </button>
                        <div className="flex-1" />
                        <ThemeToggle compact />
                    </div>
                </div>

                {/* Page Content */}
                <div className="min-h-full p-4 md:p-6 pb-20 md:pb-6">
                    {children}
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileNav />
            </main>

            {/* Mobile Sidebar Drawer */}
            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        </div>
    );
};

export default MainLayout;
