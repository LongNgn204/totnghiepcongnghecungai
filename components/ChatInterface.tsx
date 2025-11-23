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
import syncManager from '../utils/syncManager';
import ChatSidebar from './ChatSidebar';
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
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [researchStatus, setResearchStatus] = useState<string>('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadChatHistory(); }, []);
  useEffect(() => { scrollToBottom(); }, [currentSession?.messages]);

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadChatHistory = async () => {
    const history = searchQuery ? await searchChats(searchQuery) : await getChatHistory();
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

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      await deleteChatSession(id);
      syncManager.syncChat();
      await loadChatHistory();
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
    setResearchStatus('🔍 Đang phân tích câu hỏi...');

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

    // Save user message immediately
    await saveChatSession(session);
    syncManager.syncChat();

    try {
      // Simulate Deep Research Process
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResearchStatus('📚 Đang tra cứu SGK Cánh Diều & Kết Nối Tri Thức...');
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResearchStatus('🌐 Đang tìm kiếm ứng dụng thực tế (IoT, AI, Semiconductor)...');
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResearchStatus('✍️ Đang tổng hợp câu trả lời...');

      const systemInstruction = `
🌟 **VAI TRÒ:** Bạn là Siêu AI Hỗ trợ học tập (Deep Research & Coding Tutor) chuyên môn Công Nghệ & Kỹ Thuật.

📚 **NGUỒN DỮ LIỆU & TƯ DUY:**
1.  **SGK Việt Nam:** Bám sát sách Cánh Diều, Kết Nối Tri Thức (Công nghệ 10, 11, 12).
2.  **Deep Research:** Phân tích sâu, liên hệ thực tế (IoT, AI, Bán dẫn).
3.  **Quy trình trả lời:** Định nghĩa -> Nguyên lý -> Code/Sơ đồ -> Ví dụ thực tế.

💻 **CHẾ ĐỘ LẬP TRÌNH (CODING MODE - QUAN TRỌNG):**
Khi người dùng hỏi về code (Arduino, C++, Python, HTML...), bạn phải tuân thủ:
1.  **Ngôn ngữ:** Hỗ trợ mạnh nhất cho **C++ (Arduino)** và **Python**.
2.  **Định dạng:** Luôn đặt code trong markdown block với tên ngôn ngữ.
    Ví dụ:
    \`\`\`cpp
    // Code ở đây
    \`\`\`
3.  **Giải thích (Comment):** Code phục vụ giáo dục nên BẮT BUỘC phải có **comment tiếng Việt** chi tiết ở từng dòng lệnh quan trọng.
4.  **Phong cách:** Viết code chuẩn, thụt đầu dòng rõ ràng, đặt tên biến gợi nhớ (ví dụ: \`ledPin\`, \`sensorValue\`).

🎨 **CHẾ ĐỘ VẼ HÌNH (AUTO-DIAGRAM):**
Khi cần sơ đồ: \`![Alt](https://image.pollinations.ai/prompt/{ENGLISH_PROMPT}?width=1280&height=720&nologo=true)\`
(Prompt ảnh phải là tiếng Anh chuyên ngành + "technical schematic, white background").

👉 **VÍ DỤ MẪU KHI TRẢ LỜI CODE:**
User: "Viết code Arduino nháy LED"
Bot:
"Dưới đây là đoạn code điều khiển đèn LED nhấp nháy chu kỳ 1 giây:

\`\`\`cpp
// Định nghĩa chân đèn LED
const int ledPin = 13;

void setup() {
  // Thiết lập chân LED là OUTPUT (đầu ra)
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH); // Bật đèn
  delay(1000);                // Chờ 1000ms (1 giây)
  digitalWrite(ledPin, LOW);  // Tắt đèn
  delay(1000);                // Chờ 1 giây
}
\`\`\`

**Giải thích:**
- \`pinMode\`: Cấu hình chân...
- \`digitalWrite\`: Xuất tín hiệu..."
`;

      // Pass history to the API for context
      const history = session.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content
      }));

      const fullPrompt = `${systemInstruction} \n\nUser Question: ${userMessage.content} `;

      const response = await sendChatMessage(fullPrompt, filesToSend, selectedModel, history);

      if (!response.success) throw new Error(response.error || 'Có lỗi xảy ra');

      const aiMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: response.text
      };

      session.messages.push(aiMessage);
      session.updatedAt = Date.now();

      // Save AI message
      await saveChatSession(session);
      syncManager.syncChat();

      setCurrentSession({ ...session });
      await loadChatHistory();
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: `❌ Lỗi: ${error instanceof Error ? error.message : 'Không thể gửi tin nhắn'} `
      };
      session.messages.push(errorMessage);
      setCurrentSession({ ...session });
    } finally {
      setLoading(false);
      setResearchStatus('');
    }
  };

  const handleExportChat = () => {
    if (!currentSession) return;
    const text = exportChatToText(currentSession);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat - ${currentSession.id}.txt`;
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

      <div className="flex-1 flex flex-col relative">
        {/* Model Selector - Gemini Style */}
        <div className="absolute top-4 left-4 z-20">
          <div className="relative" ref={modelSelectorRef}>
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition - transform ${showModelSelector ? 'rotate-180' : ''} `}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="p-2">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                      className={`w - full text - left px - 3 py - 2.5 rounded - lg transition - colors flex items - center justify - between ${selectedModel === model.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'} `}
                    >
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{model.description}</div>
                      </div>
                      {selectedModel === model.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white/80 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          {currentSession && (
            <button onClick={handleExportChat} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white/80 backdrop-blur-sm" title="Xuất nội dung">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
          )}
        </div>

        <MessageList
          messages={currentSession?.messages || []}
          loading={loading}
          researchStatus={researchStatus}
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
