import React, { ChangeEvent, ClipboardEvent, RefObject } from 'react';

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
  return (
    <div className="bg-white p-4 pb-6">
      <div className="max-w-4xl mx-auto">
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="relative bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-fadeIn">
                <span className="text-sm text-gray-700 truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => onRemoveFile(idx)} className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-[#f0f4f9] rounded-[2rem] p-2 pl-4 transition-all focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-200">
          <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-all mb-0.5"
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
