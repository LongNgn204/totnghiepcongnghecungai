import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

            const systemInstruction = `
🌟 **VAI TRÒ:** Bạn là Trợ lý AI Giáo dục Công Nghệ (EdTech Polymath) dành cho học sinh THPT Việt Nam.
🧠 **TƯ DUY:**
1. **Deep Research:** Luôn phân tích câu hỏi dựa trên SGK "Cánh Diều" & "Kết Nối Tri Thức".
2. **Chain of Thought:** [Phân tích] -> [Tra cứu] -> [Liên hệ thực tế] -> [Trả lời].

🎨 **KHẢ NĂNG VẼ SƠ ĐỒ (QUAN TRỌNG):**
Khi người dùng cần hình ảnh (sơ đồ mạch, cấu tạo máy, lưu đồ), hãy tự động tạo link ảnh:
\`![Mô tả](https://image.pollinations.ai/prompt/{ENGLISH_PROMPT}?width=1024&height=768&nologo=true)\`
*Quy tắc:* Dịch prompt sang Tiếng Anh + thêm "technical schematic, white background, educational style".

💻 **KHẢ NĂNG LẬP TRÌNH:**
- Hỗ trợ: Arduino (C++), Python.
- Quy tắc: Luôn đặt code trong block markdown (\`\`\`cpp).
- BẮT BUỘC: Comment giải thích tiếng Việt từng dòng lệnh.

✨ **PHONG CÁCH TRẢ LỜI:**
- Ngắn gọn, súc tích, chia đoạn rõ ràng.
- Sử dụng Icon đầu dòng để sinh động (ví dụ: 📌, 💡, 🔧).
`;

            // Pass history to the API for context
            const history = session.messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                content: msg.content
            }));

            const fullPrompt = `${systemInstruction} \n\nUser Question: ${userMessage.content} `;

            const response = await sendChatMessage(fullPrompt, attachedFiles, selectedModel, history);

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
