import React, { ChangeEvent, ClipboardEvent, RefObject, useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  attachedFiles: File[];
  onRemoveFile: (index: number) => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onPaste: (e: ClipboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onInputChange,
  onSendMessage,
  loading,
  attachedFiles,
  onRemoveFile,
  onFileSelect,
  fileInputRef,
  onPaste
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onInputChange(inputMessage + (inputMessage ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [inputMessage, onInputChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="bg-white p-4 pb-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Floating Menu */}
        {showMenu && (
          <div ref={menuRef} className="absolute bottom-24 left-4 md:left-auto bg-[#1e1f20] text-white rounded-xl shadow-2xl p-2 w-64 z-50 animate-fade-in-up origin-bottom-left">
            <div className="space-y-1">
              <button
                onClick={() => { onInputChange('Hãy tạo hình ảnh: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2f3031] rounded-lg transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🍌</span>
                <span className="font-medium">Tạo hình ảnh</span>
              </button>
              <button
                onClick={() => { onInputChange('Mở chế độ Canvas: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2f3031] rounded-lg transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
                <span className="font-medium">Canvas</span>
              </button>
              <button
                onClick={() => { onInputChange('Hãy hướng dẫn tôi học về chủ đề: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2f3031] rounded-lg transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📖</span>
                <span className="font-medium">Học có hướng dẫn</span>
              </button>
              <button
                onClick={() => { onInputChange('Kích hoạt chế độ xem động cho: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#2f3031] rounded-lg transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
                <span className="font-medium">Chế độ xem động</span>
                <span className="ml-auto bg-blue-600 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">Labs</span>
              </button>
            </div>
          </div>
        )}

        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="relative bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
                <span className="text-sm text-gray-700 truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => onRemoveFile(idx)} className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-[#f0f4f9] rounded-[2rem] p-2 pl-2 transition-all focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-200">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2.5 rounded-full transition-all mb-0.5 ${showMenu ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-200 bg-gray-100'}`}
            title="Thêm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>

          <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-all mb-0.5"
            title="Đính kèm ảnh/file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
          </button>

          <textarea
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
            onPaste={onPaste}
            placeholder="Nhập câu hỏi cho Gemini..."
            className="flex-1 bg-transparent border-0 focus:ring-0 p-3 max-h-32 min-h-[48px] resize-none text-gray-800 placeholder-gray-500"
            rows={1}
            disabled={loading}
            style={{ height: 'auto', overflowY: 'auto' }}
          />

          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-full mb-0.5 transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}
            title="Nhập bằng giọng nói"
          >
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            )}
          </button>

          <button
            onClick={onSendMessage}
            disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
            className={`p-2.5 rounded-full mb-0.5 transition-all ${inputMessage.trim() || attachedFiles.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-transparent text-gray-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            )}
          </button>
        </div>
        <p className="text-[11px] text-center text-gray-400 mt-3">
          Gemini có thể đưa ra thông tin không chính xác, kể cả về con người, vì vậy hãy kiểm tra lại các câu trả lời.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
