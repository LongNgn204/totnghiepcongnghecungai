import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import { Menu } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

/**
 * ChatLayout - Dedicated full-screen layout for Chat experience
 * Features:
 * - Full-screen immersive design
 * - Collapsible sidebar (hidden by default on mobile)
 * - Glass morphism effects
 * - Optimized for conversation focus
 */
const ChatLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sidebarOpen, setSidebarOpen } = useChat();

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 animate-fade-in transition-colors duration-300">
            {/* Chat Sidebar */}
            <ChatSidebar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Sidebar Toggle */}
                {!sidebarOpen && (
                    <div className="md:hidden absolute top-4 left-4 z-30 animate-slide-right">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all hover-lift"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                )}

                {/* Chat Interface - Full Screen */}
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none animate-float" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
            </div>
        </div>
    );
};

export default ChatLayout;
