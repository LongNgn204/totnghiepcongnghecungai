import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, AVAILABLE_MODELS } from '../utils/geminiAPI';
import {
  ChatSession,
  ChatMessage,
  getChatHistory,
  saveChatSession,
  deleteChatSession,
  generateId,
  generateChatTitle,
  searchChats,
  exportChatToText
} from '../utils/chatStorage';
import ChatSidebar from './ChatSidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  // State
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadChatHistory(); }, []);
  useEffect(() => { scrollToBottom(); }, [currentSession?.messages]);

  const loadChatHistory = () => {
    const history = searchQuery ? searchChats(searchQuery) : getChatHistory();
    setChatHistory(history);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'Chat mới',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      metadata: { subject: 'Công nghệ', grade: '12' }
    };
    setCurrentSession(newSession);
    setInputMessage('');
    setAttachedFiles([]);
  };

  const loadChat = (session: ChatSession) => {
    setCurrentSession(session);
    setInputMessage('');
    setAttachedFiles([]);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      deleteChatSession(id);
      loadChatHistory();
      if (currentSession?.id === id) setCurrentSession(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    if (files.length !== validFiles.length) alert('Một số file quá lớn (>10MB)');
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) setAttachedFiles(prev => [...prev, file]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) return;
    if (loading) return;

    setLoading(true);
    let session = currentSession;
    if (!session) {
      session = {
        id: generateId(),
        title: generateChatTitle(inputMessage),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      };
    }

    const attachmentsWithPreview = await Promise.all(
      attachedFiles.map(async (f) => {
        const attachment: any = { name: f.name, type: f.type, size: f.size };
        if (f.type.startsWith('image/')) {
          try { attachment.preview = await fileToBase64(f); } catch (e) { console.error(e); }
        }
        return attachment;
      })
    );

    const userMessage: ChatMessage = {
      id: generateId(),
      timestamp: Date.now(),
      role: 'user',
      content: inputMessage,
      attachments: attachmentsWithPreview
    };

    session.messages.push(userMessage);
    session.updatedAt = Date.now();
    if (session.messages.length === 1) session.title = generateChatTitle(inputMessage);

    setCurrentSession({ ...session });
    setInputMessage('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);

    try {
      const contextPrompt = `
      🌟 **VAI TRÒ CỦA BẠN:**
      Bạn là **Trợ lý Học tập AI Cao cấp (Advanced AI Tutor)**, chuyên gia hàng đầu về giáo dục STEM và môn **Công nghệ THPT** tại Việt Nam.
      Bạn được tích hợp kiến thức sâu rộng từ bộ sách giáo khoa mới: **Cánh Diều**, **Chân Trời Sáng Tạo**, và **Kết Nối Tri Thức**.

      🎯 **MỤC TIÊU HUẤN LUYỆN:**
      1.  **Phương pháp Socratic:** Không trả lời ngay lập tức. Hãy đặt câu hỏi gợi mở để học sinh tự tư duy và tìm ra đáp án (trừ khi được hỏi định nghĩa hoặc sự thật hiển nhiên).
      2.  **Giải thích chuyên sâu:** Khi giải bài tập, hãy phân tích từng bước (Step-by-step reasoning). Giải thích "Tại sao" chứ không chỉ "Là gì".
      3.  **Liên hệ thực tế:** Luôn đưa ra ví dụ thực tiễn, ứng dụng trong đời sống của kiến thức đang học (ví dụ: mạch điện trong nhà, động cơ xe máy, nông nghiệp công nghệ cao).
      4.  **Tối ưu hóa định dạng:** Sử dụng Markdown, LaTeX cho công thức toán/lý, bảng biểu để so sánh, và Mermaid diagrams để vẽ sơ đồ tư duy hoặc quy trình.

      📚 **PHẠM VI KIẾN THỨC:**
      -   **Công nghệ 10, 11, 12:** Thiết kế kỹ thuật, Công nghệ điện - điện tử, Lâm nghiệp - Thủy sản, Trồng trọt.
      -   **Kỹ năng mềm:** Tư duy thiết kế (Design Thinking), giải quyết vấn đề, quản lý dự án kỹ thuật.

      ⚠️ **QUY TẮC ỨNG XỬ:**
      -   Luôn khích lệ, động viên học sinh.
      -   Nếu học sinh sai, hãy nhẹ nhàng chỉ ra chỗ sai và hướng dẫn sửa lại.
      -   Tuyệt đối trung thực: Nếu không chắc chắn, hãy nói "Tôi cần tra cứu thêm" thay vì bịa thông tin.

      Bây giờ, hãy trả lời câu hỏi/yêu cầu sau của học sinh với tư cách là chuyên gia:
      `;

      // Combine system prompt with user message for better context handling in single-turn API
      const fullPrompt = `${contextPrompt}\n\nUser: ${inputMessage}`;

      // Use the original inputMessage for the API call if you want to rely on the chat history context maintained by the API (if applicable) 
      // OR send the fullPrompt. Since this is a stateless API call usually, sending the full context prompt each time (or at least the system instruction) is good.
      // However, for this implementation, we will prepend the system prompt to the current message.

      const response = await sendChatMessage(fullPrompt, filesToSend, selectedModel);

      if (!response.success) throw new Error(response.error || 'Có lỗi xảy ra');

      const aiMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: response.text
      };

      session.messages.push(aiMessage);
      session.updatedAt = Date.now();
      saveChatSession(session);
      setCurrentSession({ ...session });
      loadChatHistory();
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: `❌ Lỗi: ${error instanceof Error ? error.message : 'Không thể gửi tin nhắn'}`
      };
      session.messages.push(errorMessage);
      setCurrentSession({ ...session });
    } finally {
      setLoading(false);
    }
  };

  const handleExportChat = () => {
    if (!currentSession) return;
    const text = exportChatToText(currentSession);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${currentSession.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        chatHistory={chatHistory}
        currentSession={currentSession}
        searchQuery={searchQuery}
        onSearchChange={(query) => { setSearchQuery(query); setTimeout(loadChatHistory, 300); }}
        onNewChat={startNewChat}
        onSelectChat={loadChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-gray-700">{currentSession?.title || 'Chat AI'}</h2>

              {/* Model Selector */}
              <div className="relative group">
                <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium flex items-center gap-1 hover:bg-blue-100 transition-colors">
                  {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-50">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex flex-col ${selectedModel === model.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <span className={`text-sm font-medium ${selectedModel === model.id ? 'text-blue-600' : 'text-gray-700'}`}>{model.name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{model.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {currentSession && (
            <button onClick={handleExportChat} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Xuất nội dung">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
          )}
        </div>

        <MessageList
          messages={currentSession?.messages || []}
          loading={loading}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onSuggestionClick={setInputMessage}
          onFileInputClick={() => fileInputRef.current?.click()}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          loading={loading}
          attachedFiles={attachedFiles}
          onRemoveFile={removeFile}
          onFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
