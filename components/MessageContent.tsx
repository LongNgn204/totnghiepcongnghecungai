import React from 'react';
import katex from 'katex';
import CodeBlock from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MessageContentProps {
  content: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    let text = content;
    let key = 0;

    // Extract and render code blocks first
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(
          <span
            key={`text-${key++}`}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(textBefore) }}
          />
        );
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push(
        <CodeBlock key={`code-${key++}`} code={code} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(
        <span
          key={`text-${key++}`}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(remainingText) }}
        />
      );
    }

    return parts.length > 0 ? parts : (
      <span dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
    );
  };

  return <div className="message-content">{renderContent()}</div>;
};

// Format markdown (without code blocks, handled separately)
const formatMarkdown = (text: string): string => {
  let html = text;

  // Escape HTML
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Math equations - Block ($$...$$)
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, equation) => {
    try {
      return `<div class="math-block my-4">${katex.renderToString(equation.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true
      })}</div>`;
    } catch (e) {
      return `<div class="math-error bg-red-100  p-2 rounded">Error rendering: ${equation}</div>`;
    }
  });

  // Math equations - Inline ($...$)
  html = html.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
    try {
      return `<span class="math-inline">${katex.renderToString(equation.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true
      })}</span>`;
    } catch (e) {
      return `<span class="math-error text-red-600">${equation}</span>`;
    }
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-3 text-gray-800 flex items-center gap-2"><span class="w-1.5 h-6 bg-gradient-to-b from-primary to-primary-hover rounded-full inline-block shadow-sm"></span>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-primary pb-2 flex items-center gap-2"><span class="text-primary">#</span> $1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover drop-shadow-sm">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 bg-orange-50/50 px-1 rounded">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-600 font-serif">$1</em>');

  // Inline code (only single backticks, triple handled separately)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md text-sm font-mono text-pink-600 shadow-sm">$1</code>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-6 relative group flex justify-center"><div class="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-gray-50"><img src="$2" alt="$1" class="max-w-full max-h-[500px] object-contain cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]" onclick="window.open(\'$2\', \'_blank\')" /><div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div><div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">Click to expand</div></div></div>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary hover:underline font-medium inline-flex items-center gap-1 transition-colors" target="_blank" rel="noopener noreferrer">$1 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>');

  // Lists - Unordered
  html = html.replace(/^\s*[-•]\s+(.*)$/gim, '<li class="ml-4 my-2 flex items-start gap-3 text-gray-700 group/li"><span class="text-primary mt-2 text-[0.5rem] group-hover/li:text-primary transition-colors">●</span><span class="leading-relaxed">$1</span></li>');

  // Lists - Ordered
  html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="ml-4 my-2 flex items-start gap-3 text-gray-700 group/li"><span class="text-primary font-bold min-w-[1.5rem] bg-orange-50 rounded px-1 text-center text-sm group-hover/li:bg-orange-100 transition-colors">$1.</span><span class="leading-relaxed">$2</span></li>');

  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-primary pl-6 my-6 italic text-gray-700 bg-gradient-to-r from-blue-50 to-transparent py-4 rounded-r-xl shadow-sm relative"><span class="absolute top-2 left-2 text-primary text-4xl font-serif leading-none select-none">"</span><div class="relative z-10">$1</div></blockquote>');

  // Horizontal rules
  html = html.replace(/^━+$/gm, '<hr class="my-6 border-t-2 border-gray-100"/>');
  html = html.replace(/^─+$/gm, '<hr class="my-4 border-t border-gray-100"/>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');

  return html;
};

export default MessageContent;
