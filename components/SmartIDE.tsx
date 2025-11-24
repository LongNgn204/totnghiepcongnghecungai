import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from './CodeEditor';
import ArduinoBoard from './ArduinoBoard';
import { 
  Play, RotateCcw, Save, MessageSquare, 
  Cpu, Terminal, Sparkles, CheckCircle2, 
  Code2, Loader2, Bug, BookOpen, Lightbulb, 
  ChevronRight, Lock, Unlock, Eye, EyeOff, Send, Eraser, Settings
} from 'lucide-react';
// Remove dependency on ChatContext for AI Logic, use direct API
import { CURRICULUM, Lesson } from '../utils/curriculumData';
import { generateContent } from '../utils/geminiAPI';
import ReactMarkdown from 'react-markdown';

// Simple Confetti Component
const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-primary rounded-full animate-confetti"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-10px`,
          animationDelay: `${Math.random() * 2}s`,
          backgroundColor: ['#f97316', '#ef4444', '#22c55e', '#3b82f6', '#eab308'][Math.floor(Math.random() * 5)]
        }}
      />
    ))}
  </div>
);

type Language = 'python' | 'cpp' | 'javascript' | 'arduino';

const SmartIDE: React.FC = () => {
  
  // --- State ---
  const [language, setLanguage] = useState<Language>('python');
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Arduino Simulation State
  const [arduinoState, setArduinoState] = useState<{ [pin: number]: boolean }>({});
  const [sensorValue, setSensorValue] = useState(500); // 0-1023
  const [buttonPressed, setButtonPressed] = useState(false);
  const [lcdText, setLcdText] = useState<string[]>(["", ""]);
  const [servoAngle, setServoAngle] = useState(90);
  const [tonePlaying, setTonePlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'sim' | 'ai'>('sim');
  const [showHints, setShowHints] = useState(false);

  // --- AI Mentor State (Local) ---
  const [aiChatHistory, setAiChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory]);

  // --- Effects ---
  // Load initial lesson
  useEffect(() => {
    const lessons = CURRICULUM[language];
    if (lessons && lessons.length > 0) {
      loadLesson(lessons[0]);
    } else {
        // Fallback if no lesson data
        setCode("// No lessons available for this language yet.");
    }
  }, [language]);

  const loadLesson = (lesson: Lesson) => {
    setCurrentLessonId(lesson.id);
    setCode(lesson.templateCode);
    setOutput([]);
    setShowHints(false);
    setArduinoState({}); // Reset board
    // Auto switch to SIM tab for Arduino
    if (lesson.language === 'arduino') setActiveTab('sim');
    
    // Reset AI Chat for new lesson
    setAiChatHistory([{
        role: 'model',
        content: `Xin chào! Mình là trợ lý AI. Mình có thể giúp gì cho bài học **"${lesson.title}"** này?`
    }]);
  };

  const currentLesson = CURRICULUM[language]?.find(l => l.id === currentLessonId);

  // --- Runner Logic (Interpreter) ---
  const runCode = async () => {
    setIsRunning(true);
    setOutput(['> Compiling...', '> Running...']);
    setArduinoState({}); // Reset state before run

    // Simulate Compilation Delay
    await new Promise(r => setTimeout(r, 600));

    if (language === 'arduino') {
      // ARDUINO INTERPRETER (Mockup Logic for Visuals)
      // This is a "fake" interpreter that looks for specific patterns to trigger visuals
      setOutput(prev => [...prev, "[SYSTEM] Uploading to Board...", "[SYSTEM] Done uploading."]);
      
      const lines = code.split('\n');
      
      // Simple heuristic execution
      const runLoop = async () => {
          // Reset extended states
          setLcdText(["", ""]);
          setTonePlaying(false);

          for (let i = 0; i < 10; i++) { // Run 10 simulated loops
              
              for (const line of lines) {
                  const cleanLine = line.trim();
                  
                  // 1. BUTTON LOGIC (digitalRead)
                  // If code has digitalRead(2) and buttonPressed is true, we simulate logic inside if(LOW)
                  if (cleanLine.includes('digitalRead(2)')) {
                      // This is tricky in linear simulation without real eval.
                      // We'll just assume if button is pressed, we force Pin 13 HIGH if code structure looks like it.
                      // Very naive but visual for demo.
                      if (buttonPressed && code.includes('digitalWrite(13, HIGH)')) {
                          setArduinoState(prev => ({ ...prev, 13: true }));
                      } else if (!buttonPressed && code.includes('digitalWrite(13, LOW)')) {
                          setArduinoState(prev => ({ ...prev, 13: false }));
                      }
                  }

                  // 2. BUZZER (tone)
                  if (cleanLine.includes('tone(')) {
                      setTonePlaying(true);
                  }
                  if (cleanLine.includes('noTone(')) {
                      setTonePlaying(false);
                  }

                  // 3. SERVO (write)
                  if (cleanLine.includes('.write(')) {
                      const match = cleanLine.match(/\.write\((\d+)\)/);
                      if (match) {
                          setServoAngle(parseInt(match[1]));
                      }
                  }

                  // 4. LCD (print)
                  if (cleanLine.includes('lcd.print(')) {
                      const match = cleanLine.match(/lcd\.print\("(.+)"\)/);
                      if (match) {
                          // Naive: always set line 0 for now, or check setCursor
                          setLcdText(prev => [match[1], prev[1]]);
                      }
                  }
                  
                  // Detect digitalWrite(13, HIGH)
                  if (cleanLine.includes('digitalWrite(13, HIGH)')) {
                      setArduinoState(prev => ({ ...prev, 13: true }));
                      setOutput(prev => [...prev, "[LOG] Pin 13 set HIGH"]);
                  }
                  
                  // Detect digitalWrite(13, LOW)
                  else if (cleanLine.includes('digitalWrite(13, LOW)')) {
                      setArduinoState(prev => ({ ...prev, 13: false }));
                      setOutput(prev => [...prev, "[LOG] Pin 13 set LOW"]);
                  }

                   // Detect Digital Write (Any Pin 0-13) - GENERIC REGEX
                  else if (cleanLine.match(/digitalWrite\(\s*(\d+)\s*,\s*HIGH\s*\)/)) {
                      const match = cleanLine.match(/digitalWrite\(\s*(\d+)\s*,\s*HIGH\s*\)/);
                      if (match) {
                           const pin = parseInt(match[1]);
                           setArduinoState(prev => ({ ...prev, [pin]: true }));
                           // setOutput(prev => [...prev, `[LOG] Pin ${pin} set HIGH`]); // Removed verbose logging
                      }
                  }
                  else if (cleanLine.match(/digitalWrite\(\s*(\d+)\s*,\s*LOW\s*\)/)) {
                      const match = cleanLine.match(/digitalWrite\(\s*(\d+)\s*,\s*LOW\s*\)/);
                      if (match) {
                           const pin = parseInt(match[1]);
                           setArduinoState(prev => ({ ...prev, [pin]: false }));
                           // setOutput(prev => [...prev, `[LOG] Pin ${pin} set LOW`]); // Removed verbose logging
                      }
                  }
                  
                  // Detect Serial.println
                  else if (cleanLine.includes('Serial.println(')) {
                      const match = cleanLine.match(/Serial\.println\("(.+)"\)/) || cleanLine.match(/Serial\.println\((.+)\)/);
                      if (match) {
                          // Remove quotes if string
                          const msg = match[1].startsWith('"') ? match[1].slice(1, -1) : match[1];
                          setOutput(prev => [...prev, msg]);
                      }
                  }
                  
                  // Detect Serial.print
                  else if (cleanLine.includes('Serial.print(')) {
                      const match = cleanLine.match(/Serial\.print\("(.+)"\)/) || cleanLine.match(/Serial\.print\((.+)\)/);
                      if (match) {
                          const msg = match[1].startsWith('"') ? match[1].slice(1, -1) : match[1];
                          // In real console this appends, but here we just log line for simplicity or append to last line
                          setOutput(prev => {
                              const newOut = [...prev];
                              if (newOut.length > 0 && !newOut[newOut.length-1].startsWith('[')) {
                                  newOut[newOut.length-1] += msg;
                                  return newOut;
                              }
                              return [...prev, msg];
                          });
                      }
                  }

                  // Detect Delay
                  if (cleanLine.includes('delay(')) {
                      await new Promise(r => setTimeout(r, 800)); // Fast forward delay
                  }
              }
          }
           setIsRunning(false);
           setOutput(prev => [...prev, "> Simulation ended."]);
           setShowConfetti(true);
           setTimeout(() => setShowConfetti(false), 3000);
      };
      
      runLoop();
      
    } else {
      // PYTHON / OTHER RUNNER
      await new Promise(r => setTimeout(r, 500));
      if (code.includes('print')) {
          setOutput(prev => [...prev, "Hello AI World", "> Process finished with exit code 0"]);
      } else {
          setOutput(prev => [...prev, "> Code executed successfully."]);
      }
      setIsRunning(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // --- AI Logic (Local Chat) ---
  const handleSendMessage = async (message: string) => {
      if (!message.trim()) return;
      
      const userMsg = { role: 'user' as const, content: message };
      setAiChatHistory(prev => [...prev, userMsg]);
      setAiInput('');
      setIsAiThinking(true);

      // Construct Context
      const context = `
      CONTEXT:
      - Language: ${language}
      - Lesson: ${currentLesson?.title}
      - Description: ${currentLesson?.description}
      
      USER CODE:
      \`\`\`${language}
      ${code}
      \`\`\`
      
      QUESTION: ${message}
      
      INSTRUCTION: Answer briefly and helpfully like a teacher. Use Markdown.
      `;

      try {
          const response = await generateContent(context, selectedModel);
          const aiMsg = { role: 'model' as const, content: response.text || 'Xin lỗi, tôi đang gặp sự cố kết nối.' };
          setAiChatHistory(prev => [...prev, aiMsg]);
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

  return (
    <div className="h-[calc(100vh-64px)] flex bg-background overflow-hidden font-sans relative">
      {showConfetti && <Confetti />}
      
      {/* 1. LEFT SIDEBAR: CURRICULUM */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Lộ Trình Học
          </h3>
          <div className="flex gap-2 mt-3">
             <button 
                onClick={() => setLanguage('python')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${language === 'python' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200'}`}
             >PYTHON</button>
             <button 
                onClick={() => setLanguage('arduino')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${language === 'arduino' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200'}`}
             >ARDUINO</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Group by Category */}
            {Array.from(new Set(CURRICULUM[language]?.map(l => l.category || 'Khác'))).map(category => (
                <div key={category}>
                    <h4 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                    <div className="space-y-2">
                        {CURRICULUM[language]?.filter(l => (l.category || 'Khác') === category).map((lesson, idx) => (
                            <button
                                key={lesson.id}
                                onClick={() => loadLesson(lesson)}
                                className={`w-full text-left p-3 rounded-xl border transition-all group relative ${
                                    currentLessonId === lesson.id
                                    ? 'bg-orange-50 border-orange-200 shadow-sm'
                                    : 'bg-white border-transparent hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        lesson.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        lesson.difficulty === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {lesson.difficulty}
                                    </span>
                                    {/* Mock Unlock Logic: First 3 always unlocked */}
                                    {idx < 3 ? <Unlock size={12} className="text-green-500"/> : <Lock size={12} className="text-slate-300"/>}
                                </div>
                                <h4 className={`font-semibold text-sm mt-1 line-clamp-2 ${currentLessonId === lesson.id ? 'text-primary' : 'text-slate-700'}`}>
                                    {lesson.title}
                                </h4>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 2. CENTER: EDITOR AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
        {/* Toolbar */}
        <div className="h-12 bg-[#252526] border-b border-black flex items-center justify-between px-4">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                 <Code2 size={14} />
                 <span>main.{language === 'python' ? 'py' : 'ino'}</span>
                 {currentLesson && <span className="bg-slate-700 px-2 py-0.5 rounded text-white ml-2">{currentLesson.title}</span>}
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                    onClick={() => loadLesson(currentLesson!)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Reset Code"
                >
                    <RotateCcw size={16} />
                </button>
                <button 
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wide transition-all ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                    <span>Run</span>
                </button>
             </div>
        </div>

        {/* Editor Component */}
        <div className="flex-1 relative">
            <CodeEditor 
                code={code} 
                onChange={setCode} 
                language={language === 'arduino' ? 'cpp' : language} 
            />
        </div>
        
        {/* Hints Footer (Overlay) */}
        <div className="absolute bottom-4 left-4 right-4 md:right-[420px] z-10">
             {currentLesson && currentLesson.hints.length > 0 && (
                 <div className="bg-[#252526] border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
                     <button 
                        onClick={() => setShowHints(!showHints)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                     >
                         <span className="flex items-center gap-2"><Lightbulb size={14} className="text-yellow-500"/> GỢI Ý BÀI GIẢI ({currentLesson.hints.length})</span>
                         {showHints ? <EyeOff size={14}/> : <Eye size={14}/>}
                     </button>
                     
                     {showHints && (
                         <div className="p-4 bg-[#1E1E1E] space-y-3 animate-slide-up">
                             {currentLesson.hints.map((hint, i) => (
                                 <div key={i} className="flex gap-3 text-sm text-slate-400">
                                     <span className="text-primary font-bold">{i+1}.</span>
                                     <p>{hint}</p>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
             )}
        </div>
      </div>

      {/* 3. RIGHT: INTERACTIVE PANEL */}
      <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('sim')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'sim' ? 'border-primary text-primary bg-orange-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              >
                  <Cpu size={16} /> MÔ PHỎNG
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'ai' ? 'border-primary text-primary bg-orange-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              >
                  <Sparkles size={16} /> AI MENTOR
              </button>
          </div>
          
          <div className="flex-1 bg-slate-50 overflow-hidden relative">
              {/* TAB 1: SIMULATOR */}
              {activeTab === 'sim' && (
                  <div className="h-full flex flex-col animate-fade-in">
                      {language === 'arduino' ? (
                          <div className="flex-1 flex items-center justify-center p-4 bg-slate-100 overflow-hidden relative">
                               {/* ARDUINO BOARD VISUALIZER */}
                               <div className="scale-90 origin-center">
                                   <ArduinoBoard
                                      ledState={arduinoState}
                                      mode={currentLesson?.simulationMode as any || 'default'}
                                      sensorValue={sensorValue}
                                      onSensorChange={setSensorValue}
                                      buttonPressed={buttonPressed}
                                      onButtonPress={setButtonPressed}
                                      lcdText={lcdText}
                                      servoAngle={servoAngle}
                                      tonePlaying={tonePlaying}
                                   />
                               </div>
                               {/* Status Indicator */}
                               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-mono border shadow-sm flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                   {isRunning ? 'RUNNING' : 'IDLE'}
                               </div>
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                              <Terminal size={48} className="mb-4 opacity-20" />
                              <h3 className="font-bold text-slate-600 mb-2">Terminal Output</h3>
                              <p className="text-sm">Chạy code để xem kết quả tại đây.</p>
                          </div>
                      )}
                      
                      {/* Console Output */}
                      <div className="h-1/3 bg-[#1e1e1e] border-t border-slate-300 flex flex-col">
                          <div className="px-3 py-1 bg-[#252526] text-xs font-mono text-slate-400 flex justify-between">
                              <span>CONSOLE</span>
                              <button onClick={() => setOutput([])}>CLEAR</button>
                          </div>
                          <div className="flex-1 overflow-auto p-3 font-mono text-xs text-green-400">
                              {output.map((line, i) => (
                                  <div key={i} className="mb-1 border-b border-white/5 pb-0.5">{line}</div>
                              ))}
                              {isRunning && <span className="animate-pulse">_</span>}
                          </div>
                      </div>
                  </div>
              )}
              
              {/* TAB 2: AI MENTOR - CHAT INTERFACE */}
              {activeTab === 'ai' && (
                  <div className="h-full flex flex-col bg-white animate-fade-in">
                      {/* Quick Actions */}
                      <div className="p-3 border-b border-slate-100 bg-slate-50 flex gap-2 overflow-x-auto">
                          <button onClick={() => quickAction('explain')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-200 whitespace-nowrap">📖 Giải thích</button>
                          <button onClick={() => quickAction('fix')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 whitespace-nowrap">🐛 Tìm lỗi</button>
                          <button onClick={() => quickAction('review')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50 hover:border-orange-200 whitespace-nowrap">🏆 Chấm điểm</button>
                      </div>

                      {/* Model Selector */}
                      <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <Settings size={12} /> Model:
                          </div>
                          <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value as any)}
                            className="text-xs border-none bg-slate-50 rounded px-2 py-1 font-bold text-primary outline-none cursor-pointer hover:bg-slate-100"
                          >
                              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Nhanh)</option>
                              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Thông minh)</option>
                          </select>
                      </div>

                      {/* Chat Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                          {aiChatHistory.map((msg, idx) => (
                              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-sm ${msg.role === 'user' ? 'bg-slate-700' : 'bg-primary'}`}>
                                      {msg.role === 'user' ? '👤' : '🤖'}
                                  </div>
                                  <div className={`p-3 rounded-2xl text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-white text-slate-800 rounded-tr-none' : 'bg-orange-50 border border-orange-100 text-slate-800 rounded-tl-none'}`}>
                                      <ReactMarkdown className="prose prose-sm max-w-none">
                                          {msg.content}
                                      </ReactMarkdown>
                                  </div>
                              </div>
                          ))}
                          {isAiThinking && (
                              <div className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white shadow-sm">🤖</div>
                                  <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 rounded-tl-none">
                                      <div className="flex gap-1 h-4 items-center">
                                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                                      </div>
                                  </div>
                              </div>
                          )}
                          <div ref={aiChatEndRef} />
                      </div>

                      {/* Input Area */}
                      <div className="p-3 bg-white border-t border-slate-200">
                          <div className="relative">
                              <input 
                                  type="text" 
                                  value={aiInput}
                                  onChange={(e) => setAiInput(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(aiInput)}
                                  placeholder="Hỏi thầy giáo AI..."
                                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                              />
                              <button 
                                  onClick={() => handleSendMessage(aiInput)}
                                  disabled={!aiInput.trim() || isAiThinking}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-all"
                              >
                                  <Send size={16} />
                              </button>
                          </div>
                          <div className="flex justify-between mt-2 px-1">
                              <button onClick={() => setAiChatHistory([])} className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                                  <Eraser size={12} /> Xóa lịch sử
                              </button>
                              <span className="text-[10px] text-slate-400">Powered by Gemini AI</span>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
      
    </div>
  );
};

export default SmartIDE;