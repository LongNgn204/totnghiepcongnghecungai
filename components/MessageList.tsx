import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, FileText, Copy, Sparkles } from 'lucide-react';
import { ChatMessage } from '../utils/chatStorage';
import CodeBlock from './CodeBlock';

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
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 ${message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-2 ring-blue-100'
                  : 'bg-white border border-gray-100 text-blue-600 ring-2 ring-purple-50'
                }`}>
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] group ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative px-6 py-5 shadow-sm transition-all duration-200 ${message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-blue-500/20'
                    : 'bg-white/80 backdrop-blur border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm hover:shadow-md'
                  }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Gemini AI</span>
                    </div>
                  )}

                  <div className={`prose ${message.role === 'user' ? 'prose-invert' : 'prose-slate'} max-w-none`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <CodeBlock code={String(children).replace(/\n$/, '')} language={match[1]} />
                          ) : (
                            <code className={`${className} bg-black/10 px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                              {children}
                            </code>
                          );
                        },
                        img({ src, alt }) {
                          return (
                            <div className="my-4 relative group/img">
                              <img
                                src={src}
                                alt={alt}
                                className="rounded-xl shadow-lg max-w-full h-auto mx-auto border border-gray-200"
                              />
                              <div className="absolute inset-0 rounded-xl ring-1 ring-black/5 pointer-events-none" />
                            </div>
                          );
                        },
                        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 border-b pb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 bg-gray-50 py-2 pr-2 rounded-r">{children}</blockquote>,
                        table: ({ children }) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200"><table className="min-w-full divide-y divide-gray-200">{children}</table></div>,
                        th: ({ children }) => <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>,
                        td: ({ children }) => <td className="px-4 py-2 whitespace-nowrap text-sm border-t border-gray-100">{children}</td>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
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
