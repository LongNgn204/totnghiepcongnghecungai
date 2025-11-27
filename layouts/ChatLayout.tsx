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
        <div className="flex h-screen overflow-hidden bg-background text-text-primary animate-fade-in transition-colors duration-300">
            {/* Chat Sidebar */}
            <ChatSidebar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Sidebar Toggle */}
                {!sidebarOpen && (
                    <div className="md:hidden absolute top-4 left-4 z-30 animate-slide-right">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-3 bg-surface/80 backdrop-blur-md rounded-2xl shadow-lg border border-border text-text-secondary hover:bg-surface-hover hover:shadow-xl transition-all hover-lift"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                )}

                {/* Chat Interface - Full Screen */}
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>


            </div>
        </div>
    );
};

export default ChatLayout;
