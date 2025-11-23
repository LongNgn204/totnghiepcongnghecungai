import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { AVAILABLE_MODELS } from '../utils/geminiAPI';
import {
  ChatMessage,
  exportChatToText
} from '../utils/chatStorage';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { PanelLeftClose, PanelLeftOpen, Download, ChevronDown, Check } from 'lucide-react';

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

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col h-full bg-white/50  backdrop-blur-sm rounded-2xl shadow-sm border border-white/60  overflow-hidden">
      <div className="flex-1 flex flex-col relative">
        {/* Header Controls */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {/* Sidebar Toggle (Desktop) - Hidden when hideSidebar is true */}
          {!hideSidebar && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex items-center justify-center p-2 rounded-xl bg-white/80  hover:bg-white :bg-slate-700 shadow-sm border border-gray-200  text-gray-600  transition-all"
              title={sidebarOpen ? "Đóng Sidebar" : "Mở Sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          )}

          {/* Model Selector */}
          <div className="relative" ref={modelSelectorRef}>
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-3 py-2 bg-white/80  hover:bg-white :bg-slate-700 rounded-xl shadow-sm border border-gray-200  transition-all text-sm font-medium text-gray-700 "
            >
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              <ChevronDown size={14} className={`transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
            </button>

            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white  rounded-xl shadow-xl border border-gray-100  overflow-hidden animate-fade-in-up z-30">
                <div className="p-2 space-y-1">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-3 ${selectedModel === model.id ? 'bg-blue-50  text-blue-700 ' : 'hover:bg-gray-50 :bg-slate-700 text-gray-700 '}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-[11px] text-gray-500  mt-0.5 leading-tight">{model.description}</div>
                      </div>
                      {selectedModel === model.id && <Check size={16} className="mt-1" />}
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
              className="p-2 rounded-xl bg-white/80  hover:bg-white :bg-slate-700 shadow-sm border border-gray-200  text-gray-600  transition-all"
              title="Xuất nội dung"
            >
              <Download size={18} />
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
