import React from 'react';
import { useChat } from '../contexts/ChatContext';
import { groupChatsByTime } from '../utils/chatStorage';
import { Plus, MessageSquare, Settings, User, Trash2, Search, X } from 'lucide-react';

const ChatSidebar: React.FC = () => {
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
          glass-panel border-r border-white/50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden'}
        `}
      >
        {/* Header */}
        <div className="p-4 md:p-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                OT
              </div>
              <span className="font-bold text-lg text-gradient">Ôn Thi THPT</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-black/5 rounded-full text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full group relative overflow-hidden bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 hover:border-blue-200 p-3.5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={20} className="stroke-[2.5]" />
            <span className="font-semibold">Cuộc trò chuyện mới</span>
          </button>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm lịch sử..."
              className="w-full bg-gray-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {chatHistory.length === 0 && !searchQuery && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
              <MessageSquare size={32} className="mb-2 opacity-20" />
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          )}

          {Object.entries(groupedChats).map(([key, sessions]) => sessions.length > 0 && (
            <div key={key}>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">
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
                        ? 'bg-blue-100/50 text-blue-700 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-blue-50/50 hover:text-gray-900'
                      }
                    `}
                  >
                    <MessageSquare size={16} className={`flex-shrink-0 ${currentSession?.id === session.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'}`} />
                    <span className="truncate text-sm flex-1">{session.title}</span>

                    {/* Delete Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Xóa cuộc trò chuyện này?')) deleteChat(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
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
        <div className="p-4 border-t border-white/50 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 truncate">Học Sinh</p>
              <p className="text-xs text-gray-500 truncate">Học viên THPT</p>
            </div>
            <Settings size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
