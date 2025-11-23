import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import { Menu } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sidebarOpen, setSidebarOpen } = useChat();

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <ChatSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header for Sidebar Toggle */}
                {!sidebarOpen && (
                    <div className="md:hidden absolute top-4 left-4 z-30">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-gray-200 text-gray-600"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
