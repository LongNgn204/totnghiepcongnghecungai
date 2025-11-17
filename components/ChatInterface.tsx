import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../utils/geminiAPI';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  ChatSession,
  ChatMessage,
  getChatHistory,
  saveChatSession,
  deleteChatSession,
  generateId,
  generateChatTitle,
  groupChatsByTime,
  searchChats,
  exportChatToText
} from '../utils/chatStorage';

// Enhanced Markdown formatter với KaTeX support
const formatMarkdown = (text: string): string => {
  let html = text;
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
  
  // Math equations - Block ($$...$$)
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, equation) => {
    try {
      return `<div class="math-block my-4">${katex.renderToString(equation.trim(), { 
        displayMode: true,
        throwOnError: false,
        trust: true
      })}</div>`;
    } catch (e) {
      return `<div class="math-error bg-red-100 dark:bg-red-900 p-2 rounded">Error rendering: ${equation}</div>`;
    }
  });
  
  // Math equations - Inline ($...$)
  html = html.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
    try {
      return `<span class="math-inline">${katex.renderToString(equation.trim(), { 
        displayMode: false,
        throwOnError: false,
        trust: true
      })}</span>`;
    } catch (e) {
      return `<span class="math-error text-red-600">${equation}</span>`;
    }
  });
  
  // Headers (phải làm sau math để tránh conflict)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-600 dark:text-blue-400">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Code blocks (backticks với language)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">$1</code>');
  
  // Images (phải làm trước links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg shadow-lg my-4 border-2 border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform cursor-pointer" onclick="window.open(\'$2\', \'_blank\')" />');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>');
  
  // Lists (unordered)
  html = html.replace(/^\s*[-•]\s+(.*)$/gim, '<li class="ml-4">• $1</li>');
  
  // Lists (ordered)
  html = html.replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-4">$1</li>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');
  
  // Horizontal rules
  html = html.replace(/^━+$/gm, '<hr class="my-4 border-gray-300 dark:border-gray-600"/>');
  html = html.replace(/^─+$/gm, '<hr class="my-2 border-gray-200 dark:border-gray-700"/>');
  
  return html;
};

const ChatInterface: React.FC = () => {
  // State
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const loadChatHistory = () => {
    const history = searchQuery ? searchChats(searchQuery) : getChatHistory();
    setChatHistory(history);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Tạo chat mới
  const startNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'Chat mới',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      metadata: {
        subject: 'Công nghệ',
        grade: '12'
      }
    };
    setCurrentSession(newSession);
    setInputMessage('');
    setAttachedFiles([]);
  };

  // Load chat từ lịch sử
  const loadChat = (session: ChatSession) => {
    setCurrentSession(session);
    setInputMessage('');
    setAttachedFiles([]);
  };

  // Xóa chat
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      deleteChatSession(id);
      loadChatHistory();
      if (currentSession?.id === id) {
        setCurrentSession(null);
      }
    }
  };

  // Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter((file: File) => {
      // Giới hạn 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (>10MB)`);
        return false;
      }
      return true;
    });
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  // Convert file to base64 for preview
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

  // Handle paste images from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          setAttachedFiles(prev => [...prev, file]);
        }
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files) as File[];
    const validFiles = files.filter((file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (>10MB)`);
        return false;
      }
      return true;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  // Gửi message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) return;
    if (loading) return;

    setLoading(true);

    // Tạo session mới nếu chưa có
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

    // Thêm user message với preview cho hình ảnh
    const attachmentsWithPreview = await Promise.all(
      attachedFiles.map(async (f) => {
        const attachment: any = {
          name: f.name,
          type: f.type,
          size: f.size
        };
        
        // Tạo preview cho hình ảnh
        if (f.type.startsWith('image/')) {
          try {
            attachment.preview = await fileToBase64(f);
          } catch (error) {
            console.error('Error creating preview:', error);
          }
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
    
    // Update title nếu là message đầu tiên
    if (session.messages.length === 1) {
      session.title = generateChatTitle(inputMessage);
    }

    setCurrentSession({ ...session });
    setInputMessage('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);

    try {
      // Tạo context prompt
      const contextPrompt = `🎓 Bạn là Giáo Viên AI chuyên sâu về môn **Công nghệ THPT** theo Chương trình GDPT 2018.

📚 **SGK THAM KHẢO:**
   • Sách Kết nối tri thức với cuộc sống (KNTT)
   • Sách Cánh Diều (CD)
   ➡️ Sử dụng nội dung từ CẢ 2 BỘ SÁCH để trả lời đầy đủ và chính xác nhất!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NHIỆM VỤ CỦA BẠN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ **TRẢ LỜI CHI TIẾT & TRỰC QUAN:**
   • Giải thích từng bước, từ cơ bản đến nâng cao
   • Sử dụng nhiều ví dụ thực tế, số liệu cụ thể
   • Vẽ sơ đồ, bảng so sánh (dùng ký tự đặc biệt: ┌─┐│└┘├┤┬┴┼━│)
   • Dùng emoji để dễ nhìn: 🔧⚡🔌💡📊⚙️🎯✅❌
   • **QUAN TRỌNG:** Dùng Markdown formatting (heading, bold, list, code block, table)

2️⃣ **NỘI DUNG PHONG PHÚ:**
   • **Khái niệm:** Định nghĩa rõ ràng với thuật ngữ chuyên ngành
   • **Cấu tạo:** Mô tả chi tiết các bộ phận, nguyên lý hoạt động
   • **Công thức toán học:** 
     ⚠️ **BẮT BUỘC sử dụng LaTeX cho TOÀN BỘ công thức:**
     - Công thức inline: $P = UI$ (dùng $...$)
     - Công thức block: $$P = \\frac{U^2}{R}$$ (dùng $$...$$)
     - Ví dụ: $R = \\frac{\\rho L}{S}$, $P = I^2 R$, $\\eta = \\frac{P_{out}}{P_{in}} \\times 100\\%$
     - Phân số: $\\frac{a}{b}$, Căn bậc: $\\sqrt{x}$, Mũ: $x^2$, $x^3$
     - Ký hiệu: $\\pi$, $\\Delta$, $\\Omega$, $\\pm$, $\\approx$, $\\leq$, $\\geq$
   • **Ví dụ số:** Tính toán cụ thể với bước giải chi tiết (PHẢI dùng LaTeX)
   • **Hình ảnh minh họa (Text-art):** Vẽ sơ đồ mạch điện, linh kiện
   • **Ứng dụng thực tế:** Nơi sử dụng trong đời sống
   • **Lưu ý quan trọng:** Những điểm dễ nhầm, dễ sai
   • **YCCĐ:** Yêu cầu cần đạt theo SGK Kết nối tri thức & Cánh Diều

3️⃣ **PHÂN TÍCH FILE (nếu có đính kèm):**
   • Đọc và hiểu toàn bộ nội dung file
   • Trích dẫn những phần quan trọng
   • Giải thích chi tiết từng phần trong file
   • Đưa ra đáp án hoặc phân tích bài toán trong file

4️⃣ **FORMAT XUẤT (BẮT BUỘC):**

\`\`\`markdown
## 📌 TÓM TẮT NHANH
[2-3 câu tóm tắt ngắn gọn]

## 🎯 KIẾN THỨC CHI TIẾT

### 1. Khái niệm
[Định nghĩa + giải thích]

### 2. Cấu tạo / Nguyên lý
[Mô tả chi tiết]

### 3. Công thức & Tính toán
**Công thức cơ bản:**
$$P = UI$$
$$R = \\frac{\\rho L}{S}$$

**Ví dụ tính toán:**
Cho $U = 220V$, $I = 2A$
Tính công suất: $P = UI = 220 \\times 2 = 440W$

### 4. Sơ đồ minh họa
\`\`\`
[Vẽ sơ đồ bằng ký tự]
\`\`\`

### 5. Ví dụ thực tế
[Bài toán cụ thể với lời giải]

### 6. Ứng dụng
[Trong đời sống, công nghiệp]

### 7. Lưu ý quan trọng
⚠️ [Điểm cần chú ý]

### 8. YCCĐ (Yêu cầu cần đạt)
📖 [Theo SGK Kết nối tri thức & Cánh Diều]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 CÂU HỎI TỪ HỌC SINH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${inputMessage}"

${filesToSend.length > 0 ? `\n📎 File đính kèm: ${filesToSend.map(f => f.name).join(', ')}\n➡️ Hãy phân tích chi tiết nội dung trong file này.` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 **LƯU Ý:** 
- Trả lời SIÊU CHI TIẾT, dài từ 500-1500 từ
- Nhiều ví dụ, sơ đồ, hình minh họa
- Dễ hiểu cho học sinh THPT
- Sử dụng hết khả năng token để giải thích đầy đủ nhất!`;

      // Gọi API
      const response = await sendChatMessage(contextPrompt, filesToSend);

      if (!response.success) {
        throw new Error(response.error || 'Có lỗi xảy ra');
      }

      // Thêm AI response
      const aiMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: response.text
      };

      session.messages.push(aiMessage);
      session.updatedAt = Date.now();

      // Lưu vào localStorage
      saveChatSession(session);
      setCurrentSession({ ...session });
      loadChatHistory();

    } catch (error) {
      console.error('Error sending message:', error);
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

  // Export chat
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

  // Group chats by time
  const groupedChats = groupChatsByTime(chatHistory);

  return (
    <div className="flex h-[calc(100vh-180px)] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold shadow-md"
          >
            <i className="fas fa-plus"></i>
            Chat mới
          </button>
          
          {/* Search */}
          <div className="mt-3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTimeout(loadChatHistory, 300);
              }}
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="w-full px-4 py-2 pl-10 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 bg-gray-50">
          {chatHistory.length === 0 && !searchQuery && (
            <div className="text-center py-8 px-4">
              <i className="fas fa-inbox text-4xl text-gray-400 mb-3"></i>
              <p className="text-sm text-gray-600 font-medium">Chưa có lịch sử chat</p>
              <p className="text-xs text-gray-500 mt-1">Bắt đầu trò chuyện mới ngay!</p>
            </div>
          )}
          
          {searchQuery && chatHistory.length === 0 && (
            <div className="text-center py-8 px-4">
              <i className="fas fa-search text-4xl text-gray-400 mb-3"></i>
              <p className="text-sm text-gray-600 font-medium">Không tìm thấy kết quả</p>
              <p className="text-xs text-gray-500 mt-1">Thử từ khóa khác</p>
            </div>
          )}
          
          {groupedChats.today.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2 px-2 flex items-center gap-2">
                <i className="fas fa-clock text-blue-500"></i>
                HÔM NAY
              </h3>
              {groupedChats.today.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`p-3 rounded-xl cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group relative overflow-hidden ${currentSession?.id === session.id ? 'bg-blue-100 border-2 border-blue-400' : 'hover:bg-white'}`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-2">
                        <i className="fas fa-comment-dots text-blue-500 text-xs"></i>
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <i className="fas fa-message text-[10px]"></i>
                        {session.messages.length} tin nhắn
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:scale-110 transition-all ml-2"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {groupedChats.yesterday.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2 px-2 flex items-center gap-2">
                <i className="fas fa-history text-purple-500"></i>
                HÔM QUA
              </h3>
              {groupedChats.yesterday.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`p-3 rounded-xl cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group relative overflow-hidden ${currentSession?.id === session.id ? 'bg-blue-100 border-2 border-blue-400' : 'hover:bg-white'}`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-2">
                        <i className="fas fa-comment-dots text-purple-500 text-xs"></i>
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <i className="fas fa-message text-[10px]"></i>
                        {session.messages.length} tin nhắn
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:scale-110 transition-all ml-2"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {groupedChats.lastWeek.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2 px-2 flex items-center gap-2">
                <i className="fas fa-calendar-week text-pink-500"></i>
                7 NGÀY QUA
              </h3>
              {groupedChats.lastWeek.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`p-3 rounded-xl cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group relative overflow-hidden ${currentSession?.id === session.id ? 'bg-blue-100 border-2 border-blue-400' : 'hover:bg-white'}`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-2">
                        <i className="fas fa-comment-dots text-pink-500 text-xs"></i>
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <i className="fas fa-message text-[10px]"></i>
                        {session.messages.length} tin nhắn
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:scale-110 transition-all ml-2"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 hover:text-blue-600 hover:scale-110 transition-all p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {currentSession?.title || 'Chọn hoặc tạo chat mới'}
                </h2>
                <p className="text-xs text-gray-600">AI Assistant - Môn Công Nghệ</p>
              </div>
            </div>
          </div>
          {currentSession && (
            <button
              onClick={handleExportChat}
              className="text-gray-700 hover:text-blue-600 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md"
            >
              <i className="fas fa-download"></i>
              <span className="text-sm font-semibold">Xuất file</span>
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-400 relative bg-gray-50"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-blue-500 rounded-lg animate-pulse">
              <div className="text-center">
                <i className="fas fa-cloud-upload-alt text-6xl text-blue-600 mb-4"></i>
                <p className="text-xl font-bold text-blue-700">Thả file vào đây</p>
                <p className="text-sm text-blue-600 mt-2">Hỗ trợ: Hình ảnh, PDF, Word, Text (max 10MB)</p>
              </div>
            </div>
          )}
          
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-700">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <i className="fas fa-comments text-7xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 relative"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Bắt đầu trò chuyện</h3>
              <p className="text-center max-w-md text-gray-700 leading-relaxed">
                Hỏi AI về bất kỳ kiến thức Công nghệ nào từ <span className="font-semibold text-blue-600">SGK Kết nối tri thức & Cánh Diều</span>.<br/>
                Bạn cũng có thể upload <span className="font-semibold">file PDF, DOCX, hình ảnh</span> để AI phân tích.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setInputMessage('Giải thích cho em về định luật Ohm và ứng dụng trong thực tế')}
                  className="bg-blue-100 p-4 rounded-xl hover:bg-blue-200 transition-all hover:scale-105 text-left group border-2 border-blue-200"
                >
                  <i className="fas fa-lightbulb text-yellow-600 mb-2 text-xl group-hover:animate-bounce"></i>
                  <p className="text-xs font-bold text-gray-900">Giải thích kiến thức</p>
                  <p className="text-[10px] text-gray-700 mt-1">Định luật, công thức...</p>
                </button>
                <button
                  onClick={() => setInputMessage('Giải bài tập: Cho mạch điện có R=10Ω, U=220V. Tính công suất tiêu thụ')}
                  className="bg-purple-100 p-4 rounded-xl hover:bg-purple-200 transition-all hover:scale-105 text-left group border-2 border-purple-200"
                >
                  <i className="fas fa-calculator text-purple-600 mb-2 text-xl group-hover:animate-bounce"></i>
                  <p className="text-xs font-bold text-gray-900">Giải bài tập</p>
                  <p className="text-[10px] text-gray-700 mt-1">Tính toán, bài tập...</p>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-pink-100 p-4 rounded-xl hover:bg-pink-200 transition-all hover:scale-105 text-left group border-2 border-pink-200"
                >
                  <i className="fas fa-file-image text-pink-600 mb-2 text-xl group-hover:animate-bounce"></i>
                  <p className="text-xs font-bold text-gray-900">Phân tích hình ảnh</p>
                  <p className="text-[10px] text-gray-700 mt-1">Upload ảnh, sơ đồ...</p>
                </button>
                <button
                  onClick={() => setInputMessage('Em đang học lớp 12 môn Công nghệ chuyên đề Điện. Tư vấn cho em cách ôn tập hiệu quả')}
                  className="bg-green-100 p-4 rounded-xl hover:bg-green-200 transition-all hover:scale-105 text-left group border-2 border-green-200"
                >
                  <i className="fas fa-brain text-green-600 mb-2 text-xl group-hover:animate-bounce"></i>
                  <p className="text-xs font-bold text-gray-900">Tư vấn học tập</p>
                  <p className="text-[10px] text-gray-700 mt-1">Lộ trình, phương pháp...</p>
                </button>
              </div>
              
              {/* Quick tips */}
              <div className="mt-8 max-w-lg mx-auto">
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <i className="fas fa-magic text-purple-600"></i>
                    Mẹo sử dụng:
                  </p>
                  <ul className="text-[11px] text-gray-800 space-y-1 font-medium">
                    <li>📸 Paste ảnh trực tiếp: <kbd className="px-2 py-0.5 bg-white rounded border-2 border-gray-300 text-[10px] font-bold">Ctrl+V</kbd></li>
                    <li>📎 Kéo thả file vào khung chat để upload</li>
                    <li>⌨️ <kbd className="px-2 py-0.5 bg-white rounded border-2 border-gray-300 text-[10px] font-bold">Shift+Enter</kbd> để xuống dòng</li>
                    <li>💾 Lịch sử chat được lưu tự động</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentSession.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <i className="fas fa-robot"></i>
                    </div>
                  )}
                  <div className={`max-w-3xl ${message.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-white text-gray-900 shadow-xl border-2 border-gray-300'} rounded-2xl px-6 py-4 hover:shadow-2xl transition-all group`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI Assistant</span>
                          <span className="text-xs text-gray-600">• Công nghệ THPT</span>
                        </div>
                        {/* Copy button for AI messages */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            alert('Đã copy nội dung!');
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-600 transition-all p-1 rounded hover:bg-gray-100"
                          title="Copy nội dung"
                        >
                          <i className="fas fa-copy text-sm"></i>
                        </button>
                      </div>
                    )}
                    
                    <div className="prose max-w-none">
                      <div 
                        className="markdown-content whitespace-pre-wrap text-gray-900"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(message.content) 
                        }}
                      />
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((file, idx) => (
                          <div key={idx}>
                            {file.preview ? (
                              // Image preview
                              <div className="group relative">
                                <img 
                                  src={file.preview} 
                                  alt={file.name}
                                  className="max-w-md rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer border-2 border-gray-300"
                                  onClick={() => window.open(file.preview, '_blank')}
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      const a = document.createElement('a');
                                      a.href = file.preview!;
                                      a.download = file.name;
                                      a.click();
                                    }}
                                    className="bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform border border-gray-300"
                                    title="Tải xuống"
                                  >
                                    <i className="fas fa-download"></i>
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 font-medium">{file.name}</p>
                              </div>
                            ) : (
                              // File attachment (non-image)
                              <div className="flex items-center gap-2 text-sm bg-black/10 dark:bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                                <i className={`fas ${
                                  file.type.includes('pdf') ? 'fa-file-pdf text-red-400' :
                                  file.type.includes('word') ? 'fa-file-word text-blue-400' :
                                  file.type.includes('text') ? 'fa-file-alt text-gray-400' :
                                  'fa-file text-blue-400'
                                }`}></i>
                                <span className="font-medium">{file.name}</span>
                                <span className="text-xs opacity-70">({(file.size / 1024).toFixed(1)} KB)</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs opacity-60 flex items-center gap-2">
                      <i className="fas fa-clock"></i>
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start gap-3 animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-pulse">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-xl border-2 border-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                      <span className="text-gray-800 text-sm font-bold">
                        AI đang suy nghĩ và chuẩn bị câu trả lời chi tiết...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t-2 border-gray-200 p-4 shadow-lg">
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="relative group">
                  {file.type.startsWith('image/') ? (
                    // Image preview
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-24 w-24 object-cover rounded-lg shadow-md border-2 border-blue-300 dark:border-blue-700"
                      />
                      <button
                        onClick={() => removeFile(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b-lg truncate">
                        {file.name}
                      </div>
                    </div>
                  ) : (
                    // File attachment
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-xl text-sm font-medium shadow-md border border-blue-200">
                      <i className={`fas ${
                        file.type.includes('pdf') ? 'fa-file-pdf' :
                        file.type.includes('word') ? 'fa-file-word' :
                        file.type.includes('text') ? 'fa-file-alt' :
                        'fa-file'
                      } text-blue-600`}></i>
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <span className="text-xs opacity-70">({(file.size / 1024).toFixed(0)}KB)</span>
                      <button
                        onClick={() => removeFile(idx)}
                        className="text-red-600 hover:text-red-800 ml-1 hover:scale-110 transition-transform"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,application/pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all hover:shadow-lg hover:scale-105 border-2 border-gray-300"
              title="Đính kèm file"
            >
              <i className="fas fa-paperclip text-xl"></i>
            </button>
            
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onPaste={handlePaste}
              placeholder="Nhập câu hỏi... (Shift+Enter: xuống dòng | Ctrl+V: paste ảnh)"
              className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all shadow-sm hover:shadow-md"
              rows={1}
              disabled={loading}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin text-xl"></i>
              ) : (
                <i className="fas fa-paper-plane text-xl"></i>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-600 flex items-center gap-2 font-medium">
              <i className="fas fa-info-circle"></i>
              AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                <i className="fas fa-keyboard"></i>
                {inputMessage.length > 0 && <span className="text-blue-600">{inputMessage.length} ký tự</span>}
              </span>
              {attachedFiles.length > 0 && (
                <span className="flex items-center gap-1 text-purple-600">
                  <i className="fas fa-paperclip"></i>
                  {attachedFiles.length} file
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
