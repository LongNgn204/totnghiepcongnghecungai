// Quản lý lưu trữ chat history với LocalStorage

export interface ChatMessage {
  id: string;
  timestamp: number;
  role: 'user' | 'assistant';
  content: string;
  attachments?: {
    name: string;
    type: string;
    size: number;
    preview?: string; // base64 cho hình ảnh nhỏ
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  metadata?: {
    subject?: string;
    grade?: string;
  };
}

const STORAGE_KEY = 'aiChatHistory';
const MAX_SESSIONS = 50;
const MAX_AGE_DAYS = 30;

/**
 * Tạo ID unique
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Lấy tất cả chat sessions
 */
export const getChatHistory = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Lưu hoặc cập nhật chat session
 */
export const saveChatSession = (session: ChatSession): void => {
  try {
    const history = getChatHistory();
    const existingIndex = history.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      history[existingIndex] = session;
    } else {
      history.unshift(session); // Thêm vào đầu
    }
    
    // Cleanup và lưu
    const cleaned = cleanupHistory(history);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};

/**
 * Lấy một session cụ thể
 */
export const getChatSession = (id: string): ChatSession | null => {
  const history = getChatHistory();
  return history.find(s => s.id === id) || null;
};

/**
 * Xóa một session
 */
export const deleteChatSession = (id: string): void => {
  try {
    const history = getChatHistory().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};

/**
 * Xóa tất cả chat
 */
export const clearAllChats = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Cleanup: Xóa chat cũ và giới hạn số lượng
 */
const cleanupHistory = (history: ChatSession[]): ChatSession[] => {
  const maxAge = Date.now() - (MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  
  return history
    .filter(s => s.updatedAt > maxAge)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_SESSIONS);
};

/**
 * Tạo title tự động từ câu hỏi đầu tiên
 */
export const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 50;
  const cleaned = firstMessage.trim().replace(/\n/g, ' ');
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength) + '...';
};

/**
 * Nhóm chat theo thời gian
 */
export const groupChatsByTime = (sessions: ChatSession[]) => {
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - (24 * 60 * 60 * 1000);
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  return {
    today: sessions.filter(s => s.updatedAt >= today),
    yesterday: sessions.filter(s => s.updatedAt >= yesterday && s.updatedAt < today),
    lastWeek: sessions.filter(s => s.updatedAt >= weekAgo && s.updatedAt < yesterday),
    lastMonth: sessions.filter(s => s.updatedAt >= monthAgo && s.updatedAt < weekAgo),
    older: sessions.filter(s => s.updatedAt < monthAgo)
  };
};

/**
 * Search chat sessions
 */
export const searchChats = (query: string): ChatSession[] => {
  if (!query.trim()) return getChatHistory();
  
  const lowerQuery = query.toLowerCase();
  return getChatHistory().filter(session => {
    return session.title.toLowerCase().includes(lowerQuery) ||
           session.messages.some(m => m.content.toLowerCase().includes(lowerQuery));
  });
};

/**
 * Export chat session to text
 */
export const exportChatToText = (session: ChatSession): string => {
  let text = `${session.title}\n`;
  text += `Ngày tạo: ${new Date(session.createdAt).toLocaleString('vi-VN')}\n\n`;
  text += '='.repeat(50) + '\n\n';
  
  session.messages.forEach(msg => {
    const role = msg.role === 'user' ? 'BẠN' : 'AI';
    const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN');
    text += `[${time}] ${role}:\n${msg.content}\n\n`;
  });
  
  return text;
};
