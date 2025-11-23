import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const detectLanguage = (lang?: string): string => {
    if (!lang) return 'javascript';
    
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'kt': 'kotlin',
      'swift': 'swift',
      'sql': 'sql',
      'html': 'markup',
      'xml': 'markup',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'bash': 'bash',
      'sh': 'bash',
      'shell': 'bash',
      'powershell': 'powershell',
      'ps1': 'powershell'
    };

    return langMap[lang.toLowerCase()] || lang;
  };

  const getLanguageLabel = (lang: string): string => {
    const labels: { [key: string]: string } = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'csharp': 'C#',
      'php': 'PHP',
      'ruby': 'Ruby',
      'go': 'Go',
      'rust': 'Rust',
      'kotlin': 'Kotlin',
      'swift': 'Swift',
      'sql': 'SQL',
      'markup': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'json': 'JSON',
      'yaml': 'YAML',
      'markdown': 'Markdown',
      'bash': 'Bash',
      'powershell': 'PowerShell'
    };

    return labels[lang] || lang.toUpperCase();
  };

  const detectedLang = detectLanguage(language);
  const languageLabel = getLanguageLabel(detectedLang);

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-[#1E1E1E] ring-1 ring-white/10">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* macOS style dots */}
          <div className="flex gap-1.5 group-hover:opacity-100 opacity-70 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm" />
          </div>
          {/* Language Label */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 ml-2 select-none">
            <Terminal size={12} className="text-blue-400" />
            <span className="uppercase tracking-wider text-[10px]">{languageLabel}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 border ${
            copied
              ? 'text-green-400 bg-green-400/10 border-green-400/20'
              : 'text-gray-400 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'
          }`}
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language={detectedLang}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            backgroundColor: '#1E1E1E',
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          }}
          showLineNumbers={code.split('\n').length > 5}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
