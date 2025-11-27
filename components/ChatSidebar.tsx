import React from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { groupChatsByTime } from '../utils/chatStorage';
import { Plus, MessageSquare, Settings, User, Trash2, Search } from 'lucide-react';
import Button from './atoms/Button';

const ChatSidebar: React.FC = () => {
  const { user } = useAuth();
  const {
    sidebarOpen,
    setSidebarOpen,
    chatHistory,
    currentSession,
    searchQuery,
    setSearchQuery,
    startNewChat,
    selectChat,
    deleteChat
  } = useChat();

  const groupedChats = groupChatsByTime(chatHistory);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-surface">
      <div className="p-4 border-b border-border">
        <Button onClick={startNewChat} isFullWidth size="lg">
          <Plus size={18} className="mr-2" />
          Cuộc trò chuyện mới
        </Button>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="input w-full pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {Object.entries(groupedChats).map(([key, sessions]) => sessions.length > 0 && (
          <div key={key}>
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider px-2 mb-2">
              {key === 'today' ? 'Hôm nay' : key === 'yesterday' ? 'Hôm qua' : '7 ngày qua'}
            </h3>
            <div className="space-y-1">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => selectChat(session)}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    currentSession?.id === session.id
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}>
                  <MessageSquare size={16} />
                  <span className="truncate text-sm flex-1">{session.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('Xóa?')) deleteChat(session.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent-red-100 rounded-md"
                    aria-label={`Xóa cuộc trò chuyện ${session.title}`}>
                    <Trash2 size={14} className="text-accent-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-border">
        <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors group">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.displayName || 'Học Sinh'}</p>
            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
          </div>
          <Settings size={16} className="text-text-tertiary group-hover:text-text-primary" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay & Drawer */}
      <div className={`fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-50 w-[280px] h-full border-r border-border transition-transform md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop static view */}
      <div className="hidden md:block h-full w-full">
        {sidebarContent}
      </div>
    </>
  );
};

export default ChatSidebar;
