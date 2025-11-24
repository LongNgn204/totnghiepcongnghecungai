import React from 'react';
import { QuestionMC, QuestionTF, QuestionLevel, Question } from '../types';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Helper to render text with LaTeX formulas
const renderTextWithLatex = (text: string): JSX.Element => {
  const parts: JSX.Element[] = [];
  let lastIndex = 0;

  // Match \( ... \) for inline math and \[ ... \] for display math
  const regex = /\\\((.+?)\\\)|\\\[(.+?)\\\]/g;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before formula
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${idx}`}>{text.substring(lastIndex, match.index)}</span>);
    }

    // Add formula
    const latex = match[1] || match[2];
    const displayMode = Boolean(match[2]);
    try {
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode
      });
      parts.push(<span key={`latex-${idx}`} dangerouslySetInnerHTML={{ __html: html }} />);
    } catch (e) {
      parts.push(<span key={`latex-${idx}`} className="text-red-400 bg-red-900/20 px-1 rounded">{latex}</span>);
    }

    lastIndex = match.index + match[0].length;
    idx++;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : <>{text}</>;
};

interface QuestionCardProps {
  question: QuestionMC | QuestionTF | Question;
  type: 'mc' | 'tf' | 'TRUE_FALSE' | 'MULTIPLE_CHOICE';
  onAnswerChange: (questionId: number, answer: any) => void;
  userAnswer?: any;
  isSubmitted: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  type,
  onAnswerChange,
  userAnswer,
  isSubmitted
}) => {
  const isMC = type === 'mc' || type === 'MULTIPLE_CHOICE';

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case QuestionLevel.KNOW:
      case 'Nhận biết':
        return <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded border border-slate-600">NB</span>;
      case QuestionLevel.UNDERSTAND:
      case 'Thông hiểu':
        return <span className="bg-blue-900/30 text-primary text-xs px-2 py-1 rounded border border-primary/50">TH</span>;
      case QuestionLevel.APPLY:
      case 'Vận dụng':
        return <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-800/50">VD</span>;
      case QuestionLevel.ANALYZE:
      case 'Vận dụng cao':
        return <span className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded border border-red-800/50">VDC</span>;
      default:
        return null;
    }
  };

  const renderMCOptions = () => {
    const q = question as QuestionMC;
    return (
      <div className="space-y-3">
        {q.options?.map((option, index) => {
          const isSelected = userAnswer === option;
          const isCorrect = q.answer === option;

          let className = "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ";

          if (isSubmitted) {
            if (isCorrect) {
              className += "bg-emerald-900/20 border-emerald-500/50 text-emerald-400";
            } else if (isSelected) {
              className += "bg-red-900/20 border-red-500/50 text-red-400";
            } else {
              className += "bg-stem-bg border-slate-700 text-slate-500 opacity-60";
            }
          } else {
            if (isSelected) {
              className += "bg-stem-primary/10 border-stem-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]";
            } else {
              className += "bg-stem-bg border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600";
            }
          }

          return (
            <button
              key={index}
              onClick={() => !isSubmitted && onAnswerChange(q.id, option)}
              disabled={isSubmitted}
              className={className}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold ${isSelected || (isSubmitted && isCorrect) ? 'border-current' : 'border-slate-500'
                }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{renderTextWithLatex(option)}</span>
              {isSubmitted && isCorrect && <span className="ml-auto text-emerald-400">✓</span>}
              {isSubmitted && isSelected && !isCorrect && <span className="ml-auto text-red-400">✗</span>}
            </button>
          );
        })}
      </div>
    );
  };

  const renderTFStatements = () => {
    const q = question as QuestionTF;
    const statements = q.statements || {};
    const answers = q.answers || {};
    const explanations = q.explanations || {};

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 mb-2 px-4 text-sm font-bold text-slate-500">
          <div className="col-span-8">Phát biểu</div>
          <div className="col-span-2 text-center">Đúng</div>
          <div className="col-span-2 text-center">Sai</div>
        </div>
        {Object.entries(statements).map(([key, statement]) => {
          const userAns = userAnswer?.[key];
          const correctAns = answers[key as keyof typeof answers];

          return (
            <div key={key} className="bg-stem-bg rounded-xl border border-slate-700 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-8 text-slate-200">
                  <span className="font-bold mr-2 text-stem-primary">{key})</span>
                  {renderTextWithLatex(statement)}
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => !isSubmitted && onAnswerChange(q.id, { ...userAnswer, [key]: true })}
                    disabled={isSubmitted}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all text-sm font-bold ${userAns === true
                        ? 'bg-stem-primary border-stem-primary text-white'
                        : 'border-slate-600 hover:border-stem-primary text-slate-400'
                      } ${isSubmitted && correctAns === true ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900' : ''}`}
                  >
                    Đ
                  </button>
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => !isSubmitted && onAnswerChange(q.id, { ...userAnswer, [key]: false })}
                    disabled={isSubmitted}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all text-sm font-bold ${userAns === false
                        ? 'bg-stem-primary border-stem-primary text-white'
                        : 'border-slate-600 hover:border-stem-primary text-slate-400'
                      } ${isSubmitted && correctAns === false ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900' : ''}`}
                  >
                    S
                  </button>
                </div>
              </div>

              {isSubmitted && (
                <div className={`px-4 py-3 text-sm border-t ${userAns === correctAns
                    ? 'bg-emerald-900/20 border-emerald-900/50 text-emerald-400'
                    : 'bg-red-900/20 border-red-900/50 text-red-400'
                  }`}>
                  <div className="font-bold mb-1">
                    {userAns === correctAns ? '✓ Chính xác' : '✗ Chưa chính xác'} - Đáp án: {correctAns ? 'Đúng' : 'Sai'}
                  </div>
                  {explanations[key as keyof typeof explanations] && (
                    <div className="text-slate-300">{renderTextWithLatex(explanations[key as keyof typeof explanations])}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-stem-sidebar p-6 rounded-2xl shadow-lg border border-slate-700 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-stem-primary/20 text-stem-primary font-bold px-3 py-1 rounded-lg text-sm border border-stem-primary/30">
            Câu {question.id}
          </span>
          {getLevelBadge(question.level)}
        </div>
      </div>

      <div className="mb-6 text-lg font-medium text-white leading-relaxed">
        {renderTextWithLatex(question.question)}
      </div>

      <div className="flex-grow">
        {isMC ? renderMCOptions() : renderTFStatements()}
      </div>

      {isSubmitted && !((question as QuestionTF).statements) && (question as any).explanation && (
        <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-primary/50 animate-fade-in">
          <p className="text-primary">
            <strong>💡 Giải thích:</strong> {renderTextWithLatex((question as any).explanation)}
          </p>
        </div>
      )}

      {question.requirement && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 italic">
            YCCĐ: {question.requirement}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;