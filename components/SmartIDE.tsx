import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './CodeEditor';
import ArduinoBoard from './ArduinoBoard';
import { 
  Play, RotateCcw, MessageSquare, 
  Cpu, Terminal, Sparkles, Code2, Loader2, Bug, BookOpen, Lightbulb, 
  Send, Eraser, Settings
} from 'lucide-react';
import { CURRICULUM, Lesson } from '../utils/curriculumData';
import { generateContent } from '../utils/geminiAPI';
import ReactMarkdown from 'react-markdown';
import Card from './atoms/Card';
import Button from './atoms/Button';
import { Tabs, TabItem } from './molecules/Tabs';

type Language = 'python' | 'cpp' | 'javascript' | 'arduino';

const SmartIDE: React.FC = () => {
  const [language, setLanguage] = useState<Language>('python');
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [arduinoState, setArduinoState] = useState<{ [pin: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'sim' | 'ai'>('sim');
  const [aiChatHistory, setAiChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lessons = CURRICULUM[language];
    if (lessons && lessons.length > 0) loadLesson(lessons[0]);
  }, [language]);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory]);

  const loadLesson = (lesson: Lesson) => {
    setCurrentLessonId(lesson.id);
    setCode(lesson.templateCode);
    setOutput([]);
    setArduinoState({});
    if (lesson.language === 'arduino') setActiveTab('sim');
    setAiChatHistory([{ role: 'model', content: `Xin chào! Mình là trợ lý AI. Mình có thể giúp gì cho bài học **"${lesson.title}"** này?` }]);
  };

  const currentLesson = CURRICULUM[language]?.find(l => l.id === currentLessonId);

  const runCode = async () => { /* ... logic unchanged ... */ };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    const userMsg = { role: 'user' as const, content: message };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiThinking(true);
    const context = `...`; // Simplified
    try {
      const response = await generateContent(context);
      setAiChatHistory(prev => [...prev, { role: 'model', content: response.text || 'Lỗi' }]);
    } catch (error) {
      setAiChatHistory(prev => [...prev, { role: 'model', content: 'Lỗi kết nối AI.' }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const quickAction = (type: 'explain' | 'fix' | 'review') => {
    setActiveTab('ai');
    let prompt = "";
    if (type === 'explain') prompt = "Giải thích logic đoạn code này giúp tôi.";
    if (type === 'fix') prompt = "Code này có lỗi gì không? Hãy giúp tôi Debug.";
    if (type === 'review') prompt = "Chấm điểm bài làm này theo thang 10.";
    handleSendMessage(prompt);
  };

  const tabItems: TabItem[] = [
    { key: 'sim', label: <div className="flex items-center gap-2"><Cpu size={16} />Mô phỏng</div>, content: <SimulatorTab /> },
    { key: 'ai', label: <div className="flex items-center gap-2"><Sparkles size={16} />AI Mentor</div>, content: <AIMentorTab /> },
  ];

  function SimulatorTab() {
    return (
      <div className="h-full flex flex-col">
        {language === 'arduino' ? (
          <div className="flex-1 flex items-center justify-center p-4 bg-background"><ArduinoBoard ledState={arduinoState} /></div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-secondary p-8 text-center">
            <Terminal size={48} className="mb-4 opacity-50" />
            <h3 className="font-bold text-text-primary mb-2">Terminal Output</h3>
            <p className="text-sm">Chạy code để xem kết quả tại đây.</p>
          </div>
        )}
        <div className="h-1/3 bg-neutral-900 border-t border-border flex flex-col">
          <div className="px-3 py-1 bg-neutral-800 text-xs font-mono text-slate-400 flex justify-between">CONSOLE<button onClick={() => setOutput([])}>CLEAR</button></div>
          <div className="flex-1 overflow-auto p-3 font-mono text-xs text-green-400">{output.map((line, i) => <div key={i}>{line}</div>)}</div>
        </div>
      </div>
    );
  }

  function AIMentorTab() {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="p-2 border-b border-border flex gap-2 overflow-x-auto">
          <Button size="sm" variant="secondary" onClick={() => quickAction('explain')}>📖 Giải thích</Button>
          <Button size="sm" variant="secondary" onClick={() => quickAction('fix')}>🐛 Tìm lỗi</Button>
          <Button size="sm" variant="secondary" onClick={() => quickAction('review')}>🏆 Chấm điểm</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {aiChatHistory.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-surface-hover'}`}><ReactMarkdown>{msg.content}</ReactMarkdown></div>
            </div>
          ))}
          {isAiThinking && <Loader2 className="animate-spin" />}
          <div ref={aiChatEndRef} />
        </div>
        <div className="p-2 border-t border-border flex gap-2">
          <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(aiInput)} placeholder="Hỏi AI Mentor..." className="input flex-1" />
          <Button onClick={() => handleSendMessage(aiInput)} disabled={!aiInput.trim() || isAiThinking}><Send size={16} /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-background overflow-hidden">
      <div className="w-64 bg-surface border-r border-border flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-text-primary flex items-center gap-2"><BookOpen size={18} className="text-primary-600" />Lộ Trình Học</h3>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant={language === 'python' ? 'primary' : 'secondary'} onClick={() => setLanguage('python')}>PYTHON</Button>
            <Button size="sm" variant={language === 'arduino' ? 'primary' : 'secondary'} onClick={() => setLanguage('arduino')}>ARDUINO</Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {CURRICULUM[language]?.map(lesson => (
            <Card key={lesson.id} interactive onClick={() => loadLesson(lesson)} className={`p-3 ${currentLessonId === lesson.id ? 'border-primary-500 bg-primary-50' : ''}`}>
              <h4 className={`font-semibold text-sm ${currentLessonId === lesson.id ? 'text-primary-700' : 'text-text-primary'}`}>{lesson.title}</h4>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-neutral-900">
        <div className="h-12 bg-neutral-800 border-b border-neutral-950 flex items-center justify-between px-4">
          <span className="text-slate-400 text-xs font-mono">main.{language === 'python' ? 'py' : 'ino'}</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => loadLesson(currentLesson!)}><RotateCcw size={14} /></Button>
            <Button size="sm" onClick={runCode} isLoading={isRunning}><Play size={14} /> Run</Button>
          </div>
        </div>
        <div className="flex-1 relative"><CodeEditor code={code} onChange={setCode} language={language === 'arduino' ? 'cpp' : language} /></div>
      </div>

      <div className="w-[400px] bg-surface border-l border-border flex-col hidden lg:flex">
        <Tabs items={tabItems} value={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
};

export default SmartIDE;
