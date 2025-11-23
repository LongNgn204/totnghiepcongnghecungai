import React from 'react';
import { Bot, User, FileText, Image as ImageIcon, Copy, Check, Sparkles } from 'lucide-react';
import { ChatMessage } from '../utils/chatStorage';
import MessageContent from './MessageContent';

interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  researchStatus?: string;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSuggestionClick: (msg: string) => void;
  onFileInputClick: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  researchStatus,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onSuggestionClick,
  onFileInputClick,
  messagesEndRef
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-white"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50/90 z-50 flex items-center justify-center border-4 border-dashed border-blue-400 rounded-lg transition-all">
          <div className="text-center">
            <p className="text-2xl font-medium text-blue-600">Thả file vào đây</p>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-800 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Xin chào, tôi có thể giúp gì?
          </h3>
          <p className="text-center max-w-lg text-gray-500 mb-12 text-lg font-medium">
            Hỏi về Công nghệ, giải bài tập, hoặc tải lên hình ảnh để phân tích.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
            <SuggestionCard onClick={() => onSuggestionClick('Giải thích định luật Ohm?')} text="Giải thích định luật Ohm" icon="⚡" />
            <SuggestionCard onClick={() => onSuggestionClick('Giải bài tập điện xoay chiều?')} text="Giải bài tập điện xoay chiều" icon="📝" />
            <SuggestionCard onClick={onFileInputClick} text="Phân tích hình ảnh sơ đồ" icon="🖼️" />
            <SuggestionCard onClick={() => onSuggestionClick('Lộ trình ôn thi THPT môn Công nghệ?')} text="Tư vấn lộ trình ôn thi" icon="🎓" />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-2 ring-blue-100'
                  : 'bg-white border border-gray-100 text-blue-600 ring-2 ring-purple-50'
              }`}>
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] group ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative px-6 py-5 rounded-2xl shadow-sm transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-500/20'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:shadow-md shadow-gray-200/50'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Gemini AI</span>
                    </div>
                  )}

                  <div className={message.role === 'user' ? 'text-white/95 font-medium leading-relaxed' : 'leading-relaxed'}>
                    <MessageContent content={message.content} />
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {message.attachments.map((file, idx) => (
                        <div key={idx} className="group/file relative overflow-hidden rounded-xl border border-white/20 bg-black/5">
                          {file.preview ? (
                            <div className="relative">
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="max-w-[200px] max-h-[200px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => window.open(file.preview, '_blank')}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/file:bg-black/10 transition-colors pointer-events-none" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm">
                              <FileText className="w-5 h-5" />
                              <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions for Assistant */}
                {message.role === 'assistant' && (
                  <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(message.content)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Sao chép"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="flex gap-4 animate-slide-up">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <Bot size={20} className="text-blue-600 animate-pulse" />
              </div>
              <div className="flex flex-col gap-2 max-w-[75%]">
                <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-3">
                  {researchStatus ? (
                    <div className="flex items-center gap-3 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium text-sm animate-pulse">{researchStatus}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 h-4 items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-500 animate-pulse">Đang suy nghĩ...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

const SuggestionCard: React.FC<{ onClick: () => void; text: string; icon?: string }> = ({ onClick, text, icon }) => (
  <button
    onClick={onClick}
    className="p-4 bg-white hover:bg-blue-50 rounded-xl text-left transition-all duration-200 text-gray-700 font-medium border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md flex items-center gap-3 group"
  >
    <span className="text-xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span>{text}</span>
  </button>
);

export default MessageList;
