import React, { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, readOnly = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      onChange(value.substring(0, start) + '  ' + value.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-neutral-900 rounded-xl overflow-hidden font-mono text-sm border border-slate-700">
      {/* Highlight Layer (Behind) */}
      <div 
        ref={preRef as any}
        className="absolute inset-0 pointer-events-none p-4 overflow-hidden"
        aria-hidden="true"
      >
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: "'Fira Code', 'Consolas', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Fira Code', 'Consolas', monospace",
            }
          }}
        >
          {code || ' '}
        </SyntaxHighlighter>
      </div>

      {/* Input Layer (Front) */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        disabled={readOnly}
        className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none outline-none overflow-auto font-mono text-sm leading-relaxed z-10 selection:bg-blue-500/30"
        style={{
          fontFamily: "'Fira Code', 'Consolas', monospace",
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      />
    </div>
  );
};

export default CodeEditor;