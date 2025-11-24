import React from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { groupChatsByTime } from '../utils/chatStorage';
import { Plus, MessageSquare, Settings, User, Trash2, Search, X } from 'lucide-react';

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

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-[280px] h-full
          bg-white border-r border-slate-100
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden'}
        `}
      >
        {/* Header */}
        <div className="p-4 md:p-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold shadow-md shadow-orange-200">
                OT
              </div>
              <span className="font-bold text-lg text-slate-800">Ôn Thi THPT</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full group relative overflow-hidden bg-primary text-white p-3.5 rounded-xl transition-all duration-200 shadow-md shadow-orange-100 hover:shadow-lg hover:bg-primary-hover flex items-center justify-center gap-2 mb-6"
          >
            <Plus size={20} className="stroke-[2.5]" />
            <span className="font-semibold">Cuộc trò chuyện mới</span>
          </button>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm lịch sử..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-transparent focus:border-primary rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          {chatHistory.length === 0 && !searchQuery && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
              <MessageSquare size={32} className="mb-2 opacity-20" />
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          )}

          {Object.entries(groupedChats).map(([key, sessions]) => sessions.length > 0 && (
            <div key={key}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">
                {key === 'today' ? 'Hôm nay' : key === 'yesterday' ? 'Hôm qua' : '7 ngày qua'}
              </h3>
              <div className="space-y-1">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => selectChat(session)}
                    className={`
                      group relative flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200
                      ${currentSession?.id === session.id
                        ? 'bg-orange-50 text-primary font-medium shadow-sm border border-orange-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <MessageSquare size={16} className={`flex-shrink-0 ${currentSession?.id === session.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                    <span className="truncate text-sm flex-1">{session.title}</span>

                    {/* Delete Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Xóa cuộc trò chuyện này?')) deleteChat(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: User Profile */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-white shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="font-bold">{user?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                {user?.displayName || 'Học Sinh'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'Học viên THPT'}</p>
            </div>
            <Settings size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
