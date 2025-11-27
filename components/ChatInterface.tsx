import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { AVAILABLE_MODELS } from '../utils/geminiAPI';
import { exportChatToText } from '../utils/chatStorage';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { PanelLeftClose, PanelLeftOpen, Download, ChevronDown, Check, ArrowDown } from 'lucide-react';
import Button from './atoms/Button';

interface ChatInterfaceProps {
  hideSidebar?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ hideSidebar = false }) => {
  const { currentSession, loading, researchStatus, sidebarOpen, setSidebarOpen, selectedModel, setSelectedModel, sendMessage } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollToBottom(); }, [currentSession?.messages]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... logic ... */ };
  const removeFile = (index: number) => { /* ... logic ... */ };
  const handlePaste = (e: React.ClipboardEvent) => { /* ... logic ... */ };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { /* ... logic ... */ };

  const onSendMessage = async () => {
    await sendMessage(inputMessage, attachedFiles);
    setInputMessage('');
    setAttachedFiles([]);
  };

  const handleExportChat = () => { /* ... logic ... */ };

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden relative">
      <div className="flex-1 flex flex-col relative h-full">
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          {!hideSidebar && (
            <Button variant="secondary" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Đóng Sidebar" : "Mở Sidebar"}>
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </Button>
          )}
          <div className="relative" ref={modelSelectorRef}>
            <Button variant="secondary" size="sm" onClick={() => setShowModelSelector(!showModelSelector)}>
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              <ChevronDown size={14} className={`transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
            </Button>
            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-surface rounded-lg shadow-lg border border-border z-30 p-1">
                {AVAILABLE_MODELS.map(model => (
                  <button key={model.id} onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }} className={`w-full text-left p-2 rounded-md ${selectedModel === model.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-surface-hover'}`}>
                    <p className="font-semibold text-sm">{model.name}</p>
                    <p className="text-xs text-text-secondary">{model.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-3 z-20">
          {currentSession && <Button variant="secondary" size="sm" onClick={handleExportChat} aria-label="Xuất nội dung cuộc trò chuyện"><Download size={16} /></Button>}
        </div>

        {showScrollBottom && (
          <Button onClick={scrollToBottom} className="absolute bottom-24 right-4 z-30 rounded-full w-10 h-10 p-0" aria-label="Cuộn xuống dưới"><ArrowDown size={20} /></Button>
        )}

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
          chatContainerRef={chatContainerRef}
          onScroll={handleScroll}
        />

        <ChatInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={onSendMessage}
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
