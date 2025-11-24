import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { AVAILABLE_MODELS } from '../utils/geminiAPI';
import {
  ChatMessage,
  exportChatToText
} from '../utils/chatStorage';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { PanelLeftClose, PanelLeftOpen, Download, ChevronDown, Check, ArrowDown } from 'lucide-react';

interface ChatInterfaceProps {
  hideSidebar?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ hideSidebar = false }) => {
  // Context
  const {
    currentSession,
    loading,
    researchStatus,
    sidebarOpen,
    setSidebarOpen,
    selectedModel,
    setSelectedModel,
    sendMessage
  } = useChat();

  // Local State
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollToBottom(); }, [currentSession?.messages]);

  // Handle Scroll to show/hide "Scroll to Bottom" button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isBottom);
  };

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    if (files.length !== validFiles.length) alert('Một số file quá lớn (>10MB)');
    setAttachedFiles(prev => [...prev, ...validFiles]);
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

  const onSendMessage = async () => {
    await sendMessage(inputMessage, attachedFiles);
    setInputMessage('');
    setAttachedFiles([]);
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
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header Controls */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {/* Sidebar Toggle (Desktop) - Hidden when hideSidebar is true */}
          {!hideSidebar && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex items-center justify-center p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-primary shadow-sm border border-slate-200 transition-all"
              title={sidebarOpen ? "Đóng Sidebar" : "Mở Sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          )}

          {/* Model Selector */}
          <div className="relative" ref={modelSelectorRef}>
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 transition-all text-sm font-semibold text-slate-700 hover:text-primary hover:border-orange-200"
            >
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              <ChevronDown size={14} className={`transition-transform duration-300 ${showModelSelector ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
            </button>

            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-float border border-slate-100 overflow-hidden animate-fade-in z-30 p-1.5">
                <div className="space-y-0.5">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                      className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-start gap-3 ${selectedModel === model.id ? 'bg-orange-50 text-primary shadow-sm' : 'hover:bg-slate-50 text-text-main'}`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{model.name}</div>
                        <div className={`text-[11px] mt-0.5 leading-tight ${selectedModel === model.id ? 'text-primary/70' : 'text-text-sub'}`}>{model.description}</div>
                      </div>
                      {selectedModel === model.id && <Check size={16} className="mt-1 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {currentSession && (
            <button
              onClick={handleExportChat}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-primary shadow-sm border border-slate-200 transition-all"
              title="Xuất nội dung"
            >
              <Download size={18} />
            </button>
          )}
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-8 z-30 p-3 bg-primary text-white rounded-full shadow-float hover:scale-110 hover:bg-primary-hover transition-all animate-fade-in"
            title="Cuộn xuống dưới"
          >
            <ArrowDown size={20} className="animate-bounce" />
          </button>
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
          // Pass Scroll Props
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
