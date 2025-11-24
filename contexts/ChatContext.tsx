import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import {
    ChatSession,
    ChatMessage,
    getChatHistory,
    saveChatSession,
    deleteChatSession,
    generateId,
    generateChatTitle,
    searchChats
} from '../utils/chatStorage';
import { sendChatMessage, AVAILABLE_MODELS } from '../utils/geminiAPI';
import syncManager from '../utils/syncManager';

interface ChatContextType {
    chatHistory: ChatSession[];
    currentSession: ChatSession | null;
    loading: boolean;
    researchStatus: string;
    sidebarOpen: boolean;
    searchQuery: string;
    selectedModel: string;

    // Actions
    setSearchQuery: (query: string) => void;
    setSidebarOpen: (open: boolean) => void;
    setSelectedModel: (modelId: string) => void;
    startNewChat: () => void;
    selectChat: (session: ChatSession) => void;
    deleteChat: (id: string) => Promise<void>;
    sendMessage: (message: string, files: File[]) => Promise<void>;
    refreshHistory: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [researchStatus, setResearchStatus] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

    useEffect(() => {
        loadChatHistory();
    }, [searchQuery]);

    const loadChatHistory = async () => {
        const history = searchQuery ? await searchChats(searchQuery) : await getChatHistory();
        setChatHistory(history);
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
    };

    const selectChat = (session: ChatSession) => {
        setCurrentSession(session);
        // On mobile, close sidebar after selection
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const deleteChat = async (id: string) => {
        await deleteChatSession(id);
        syncManager.syncChat();
        await loadChatHistory();
        if (currentSession?.id === id) {
            setCurrentSession(null);
        }
    };

    const sendMessage = async (inputMessage: string, attachedFiles: File[]) => {
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

        // Process attachments
        const attachmentsWithPreview = await Promise.all(
            attachedFiles.map(async (f) => {
                const attachment: any = { name: f.name, type: f.type, size: f.size };
                if (f.type.startsWith('image/')) {
                    try {
                        const reader = new FileReader();
                        const base64 = await new Promise<string>((resolve, reject) => {
                            reader.onload = () => resolve(reader.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(f);
                        });
                        attachment.preview = base64;
                    } catch (e) { console.error(e); }
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

            const userGrade = session.metadata?.grade || '12';

            const systemInstruction = `
Bạn là Gia sư AI chuyên về môn Công Nghệ (Tin học & Công nghệ) theo chương trình GDPT 2018 của Việt Nam. Nhiệm vụ của bạn là hỗ trợ học sinh học tập dựa trên 2 bộ sách giáo khoa chính: 'Cánh Diều' và 'Kết nối tri thức với cuộc sống'.
Học sinh này đang học Lớp ${userGrade}.

QUY TẮC TRẢ LỜI:
1. **Định nghĩa chuẩn:** Khi giải thích khái niệm (ví dụ: IoT, AI, Mạch điện...), hãy dùng định nghĩa bám sát SGK. Tránh dùng các thuật ngữ quá chuyên sâu của đại học nếu SGK chưa đề cập.
2. **Phân biệt bộ sách:** Nếu một khái niệm có sự khác biệt giữa 'Cánh Diều' và 'Kết nối tri thức', hãy nêu rõ: "Theo sách Cánh Diều thì..., còn theo Kết nối tri thức thì...".
3. **Phương pháp Socratic:** Không đưa ngay đáp án bài tập về nhà. Hãy đặt câu hỏi gợi mở để học sinh tự tư duy ra câu trả lời.
4. **Giọng văn:** Thân thiện, khích lệ (Encouraging), sử dụng Tiếng Việt chuẩn mực, xưng hô 'Thầy/Cô' hoặc 'Mình' tùy ngữ cảnh, gọi người dùng là 'bạn' hoặc 'em'.
5. **Phạm vi:** Nếu học sinh hỏi vấn đề không liên quan đến học tập (như game, showbitch), hãy khéo léo lái về bài học: "Vấn đề này rất thú vị, nhưng chúng ta hãy quay lại bài học về [Chủ đề đang nói] nhé."

🎨 **KHẢ NĂNG TẠO HÌNH ẢNH CHUYÊN NGHIỆP (Tự động):**
Khi học sinh cần minh họa trực quan (sơ đồ mạch điện, kiến trúc máy tính, lưu đồ thuật toán, cấu trúc dữ liệu), 
BẮT BUỘC tạo ảnh chất lượng cao với cú pháp:

![Mô tả tiếng Việt](https://image.pollinations.ai/prompt/[PROMPT_TIẾNG_ANH_CHI_TIẾT]?width=1200&height=800&nologo=true&enhance=true)

**Quy tắc tạo prompt cho ảnh:**
- Dịch sang tiếng Anh chính xác
- Thêm từ khóa chất lượng: "technical diagram, clean white background, educational illustration, high quality, detailed schematic"
- Cho sơ đồ mạch: thêm "electronic circuit diagram, component labels"
- Cho lưu đồ: thêm "flowchart, algorithmic diagram, clear arrows"
- Cho kiến trúc: thêm "computer architecture diagram, labeled components"

**Ví dụ cụ thể:**
- Người dùng: "Vẽ sơ đồ mạch LED đơn giản"
- AI trả lời: 
![Sơ đồ mạch LED](https://image.pollinations.ai/prompt/simple%20LED%20circuit%20diagram%20with%20battery%20resistor%20and%20LED,%20technical%20schematic,%20white%20background,%20educational%20style,%20labeled%20components?width=1200&height=800&nologo=true&enhance=true)

💻 **KHẢ NĂNG LẬP TRÌNH (Arduino & Python):**
**Arduino (C++):**
\`\`\`cpp
// [Mô tả chức năng bằng tiếng Việt]
#include <stdio.h>

void setup() {
  // Khởi tạo: [Giải thích từng dòng]
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Vòng lặp chính: [Giải thích logic]
  digitalWrite(LED_BUILTIN, HIGH);  // Bật LED
  delay(1000);                      // Chờ 1 giây
}
\`\`\`

**Python:**
\`\`\`python
# [Mô tả chức năng bằng tiếng Việt]
def function_name():
    """
    Docstring giải thích chi tiết
    """
    # Comment từng dòng quan trọng
    pass
\`\`\`

📚 **KIẾN THỨC CHUYÊN SÂU:**
- **Phần cứng**: CPU (Von Neumann, Harvard), RAM/ROM, Mainboard, GPU, SSD/HDD
- **Phần mềm**: Hệ điều hành, Ứng dụng, Thuật toán, Cấu trúc dữ liệu
- **Mạng máy tính**: TCP/IP, LAN/WAN, Wi-Fi, IoT protocols
- **Lập trình**: Python (cơ bản → OOP), Arduino (C/C++), HTML/CSS/JavaScript
- **AI & Data**: Machine Learning cơ bản, Big Data concepts
- **Xu hướng**: Edge Computing, 5G, Quantum Computing (giới thiệu)

✨ **PHONG CÁCH GIAO TIẾP TỰ NHIÊN:**
1. **Thân thiện**: Dùng "bạn", "mình", "chúng ta" thay vì "em/cô/thầy"
2. **Rõ ràng**: Chia nhỏ thông tin, dùng bullet points, số thứ tự
3. **Sinh động**: Icon phù hợp (📌 Lưu ý, 💡 Mẹo, 🔧 Thực hành, ⚡ Quan trọng, 🎯 Kết luận)
4. **Khích lệ**: Khen ngợi câu hỏi hay, động viên học sinh
5. **Kiên nhẫn**: Sẵn sàng giải thích lại bằng cách khác nếu chưa hiểu

🎯 **MỤC TIÊU CUỐI CÙNG:**
Giúp học sinh:
- Hiểu sâu kiến thức Công nghệ THPT
- Tự tin làm bài thi THPT Quốc gia
- Phát triển tư duy logic, giải quyết vấn đề
- Hứng thú với ngành Công nghệ cao

---
**Hãy trả lời câu hỏi sau một cách tự nhiên, chi tiết và dễ hiểu nhất:**
`;

            // Pass history to the API for context
            const history = session.messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                content: msg.content
            }));

            const fullPrompt = `${systemInstruction} \n\nUser Question: ${userMessage.content} `;

            const response = await sendChatMessage(fullPrompt, attachedFiles, selectedModel, history);

            if (!response.success) {
                toast.error(response.error || 'Có lỗi xảy ra khi gửi tin nhắn');
                throw new Error(response.error || 'Có lỗi xảy ra');
            }

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
            const errorMsg = error instanceof Error ? error.message : 'Không thể gửi tin nhắn';
            toast.error(errorMsg);
            const errorMessage: ChatMessage = {
                id: generateId(),
                timestamp: Date.now(),
                role: 'assistant',
                content: `❌ Lỗi: ${errorMsg} `
            };
            session.messages.push(errorMessage);
            setCurrentSession({ ...session });
        } finally {
            setLoading(false);
            setResearchStatus('');
        }
    };

    return (
        <ChatContext.Provider value={{
            chatHistory,
            currentSession,
            loading,
            researchStatus,
            sidebarOpen,
            searchQuery,
            selectedModel,
            setSearchQuery,
            setSidebarOpen,
            setSelectedModel,
            startNewChat,
            selectChat,
            deleteChat,
            sendMessage,
            refreshHistory: loadChatHistory
        }}>
            {children}
        </ChatContext.Provider>
    );
};
