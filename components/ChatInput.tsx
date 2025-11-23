import React, { ChangeEvent, ClipboardEvent, RefObject, useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, Image as ImageIcon, Plus, X } from 'lucide-react';

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
    <div className="absolute bottom-6 left-4 right-4 z-30">
      <div className="max-w-4xl mx-auto relative">
        {/* Floating Menu */}
        {showMenu && (
          <div ref={menuRef} className="absolute bottom-full left-0 mb-4 bg-white/90  backdrop-blur-xl border border-white/50  rounded-2xl shadow-2xl p-2 w-64 z-50 animate-fade-in-up origin-bottom-left">
            <div className="space-y-1">
              <button
                onClick={() => { onInputChange('Hãy tạo hình ảnh: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 :bg-blue-900/30 rounded-xl transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🍌</span>
                <span className="font-medium text-gray-700 ">Tạo hình ảnh</span>
              </button>
              <button
                onClick={() => { onInputChange('Mở chế độ Canvas: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 :bg-blue-900/30 rounded-xl transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
                <span className="font-medium text-gray-700 ">Canvas</span>
              </button>
              <button
                onClick={() => { onInputChange('Hãy hướng dẫn tôi học về chủ đề: '); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 :bg-blue-900/30 rounded-xl transition-colors text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📖</span>
                <span className="font-medium text-gray-700 ">Học có hướng dẫn</span>
              </button>
            </div>
          </div>
        )}

        {/* File Previews */}
        {attachedFiles.length > 0 && (
          <div className="absolute bottom-full left-0 mb-4 w-full flex gap-2 overflow-x-auto pb-2 px-1">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="relative group flex-shrink-0 bg-white/90  backdrop-blur border border-white/50  p-2 rounded-xl shadow-lg animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50  rounded-lg flex items-center justify-center text-blue-500 ">
                    {file.type.startsWith('image/') ? <ImageIcon size={20} /> : <Paperclip size={20} />}
                  </div>
                  <div className="max-w-[120px]">
                    <p className="text-xs font-medium text-gray-700  truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(idx)}
                    className="p-1 hover:bg-red-50 :bg-red-900/30 text-gray-400 hover:text-red-500 :text-red-400 rounded-full transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="glass-panel rounded-full p-2 pl-2 flex items-end gap-2 shadow-2xl shadow-blue-900/5 ring-1 ring-white/50">
          {/* Plus Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${showMenu ? 'bg-gray-200  text-gray-800  rotate-45' : 'bg-gray-100  text-gray-600  hover:bg-gray-200 :bg-slate-700'
              }`}
          >
            <Plus size={20} />
          </button>

          <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" />

          {/* Input Field */}
          <div className="flex-1 min-h-[44px] relative">
            <textarea
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
              onPaste={onPaste}
              placeholder="Hỏi Gemini về Công nghệ..."
              className="w-full h-full bg-transparent border-0 focus:ring-0 p-2.5 max-h-32 resize-none text-gray-800  placeholder-gray-400  text-[15px] leading-relaxed"
              rows={1}
              disabled={loading}
              style={{ height: 'auto', overflowY: 'auto' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 pr-1 pb-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400  hover:text-blue-600 :text-blue-400 hover:bg-blue-50 :bg-blue-900/30 rounded-full transition-all"
              title="Đính kèm"
            >
              <Paperclip size={20} />
            </button>

            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-50  text-red-500  animate-pulse' : 'text-gray-400  hover:text-blue-600 :text-blue-400 hover:bg-blue-50 :bg-blue-900/30'
                }`}
              title="Giọng nói"
            >
              <Mic size={20} />
            </button>

            <button
              onClick={onSendMessage}
              disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${inputMessage.trim() || attachedFiles.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} className={inputMessage.trim() ? 'ml-0.5' : ''} />
              )}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-gray-400  mt-2 font-medium">
          Gemini có thể đưa ra thông tin không chính xác, hãy kiểm tra lại.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
