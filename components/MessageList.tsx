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
  // New props for Scroll handling
  chatContainerRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
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
  messagesEndRef,
  chatContainerRef,
  onScroll
}) => {
  return (
    <div
      ref={chatContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-background custom-scrollbar scroll-smooth"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-primary m-4 rounded-3xl transition-all animate-fade-in">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-4">
               <FileText className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <p className="text-2xl font-bold text-text-primary">Thả file vào đây</p>
            <p className="text-text-secondary mt-2">Hỗ trợ ảnh và tài liệu</p>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-text-primary animate-fade-in py-10">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-[2rem] flex items-center justify-center mb-8">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-text-primary text-center tracking-tight">
            Hôm nay bạn muốn học gì?
          </h3>
          <p className="text-center max-w-lg text-text-secondary mb-10 text-base leading-relaxed">
            Trợ lý AI sẵn sàng hỗ trợ giải bài tập, lập trình và tư vấn lộ trình học tập.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
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
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-surface-hover text-primary'
                }`}>
                {message.role === 'user' ? <User size={16} strokeWidth={2.5} /> : <Bot size={18} strokeWidth={2.5} />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] group ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative px-5 py-4 transition-all duration-200 ${message.role === 'user'
                  ? 'bg-primary text-white rounded-2xl rounded-tr-sm shadow-sm'
                  : 'bg-surface border border-border text-text-primary rounded-2xl rounded-tl-sm shadow-sm'
                  }`}>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary-100 dark:bg-primary-900/50 px-2 py-1 rounded-lg">Gemini 2.0 Flash</span>
                    </div>
                  )}

                                    <div className={`prose ${message.role === 'user' ? 'prose-invert' : 'prose-custom'} max-w-none`}>
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
                            <div className="my-6 relative group/img">
                              <img
                                src={src}
                                alt={alt}
                                loading="lazy"
                                className="rounded-2xl shadow-lg max-w-full h-auto mx-auto border border-border hover:border-primary transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                                onClick={() => window.open(src, '_blank')}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const errorDiv = document.createElement('div');
                                  errorDiv.className = 'p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm';
                                  errorDiv.textContent = '⚠️ Không thể tải ảnh. Vui lòng thử lại.';
                                  target.parentNode?.appendChild(errorDiv);
                                }}
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                <button
                                  onClick={() => window.open(src, '_blank')}
                                  className="px-3 py-1.5 bg-surface/80 backdrop-blur rounded-lg text-xs font-medium text-text-secondary shadow-lg hover:bg-surface-hover transition-all"
                                  title="Mở ảnh full size"
                                >
                                  🔍 Phóng to
                                </button>
                              </div>
                            </div>
                          );
                        },
                        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 border-b border-border pb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 bg-surface-hover py-2 pr-2 rounded-r">{children}</blockquote>,
                        table: ({ children }) => <div className="overflow-x-auto my-4 rounded-lg border border-border"><table className="min-w-full divide-y divide-border">{children}</table></div>,
                        th: ({ children }) => <th className="px-4 py-2 bg-surface-hover text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">{children}</th>,
                        td: ({ children }) => <td className="px-4 py-2 whitespace-nowrap text-sm border-t border-border">{children}</td>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {message.attachments.map((file, idx) => (
                        <div key={idx} className="group/file relative overflow-hidden rounded-xl border border-primary-400/50 bg-primary-500/30">
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
                            <div className="flex items-center gap-3 px-4 py-3 bg-primary-500/50 backdrop-blur-sm">
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
                      className="p-1.5 text-text-tertiary hover:text-primary hover:bg-surface-hover rounded-lg transition-all"
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
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                <Bot size={20} className="text-primary  animate-pulse" />
              </div>
              <div className="flex flex-col gap-2 max-w-[75%]">
                <div className="bg-surface px-6 py-4 rounded-2xl rounded-tl-none border border-border shadow-sm flex items-center gap-3">
                  {researchStatus ? (
                    <div className="flex items-center gap-3 text-primary ">
                      <div className="w-4 h-4 border-2 border-primary  border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium text-sm animate-pulse">{researchStatus}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 h-4 items-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm font-medium text-text-secondary animate-pulse">Đang suy nghĩ...</span>
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
    className="p-4 bg-surface rounded-xl text-left transition-all duration-200 text-text-primary font-medium border border-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-surface-hover flex items-center gap-3 group active:scale-[0.98]"
  >
    <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="text-sm">{text}</span>
  </button>
);

export default MessageList;
