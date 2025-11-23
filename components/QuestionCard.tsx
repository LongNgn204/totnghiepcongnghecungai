import React from 'react';
import { QuestionMC, QuestionTF, QuestionLevel, Question } from '../types';

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
        return <span className="bg-gray-100  text-gray-800  text-xs px-2 py-1 rounded">NB</span>;
      case QuestionLevel.UNDERSTAND:
      case 'Thông hiểu':
        return <span className="bg-blue-100  text-blue-800  text-xs px-2 py-1 rounded">TH</span>;
      case QuestionLevel.APPLY:
      case 'Vận dụng':
        return <span className="bg-yellow-100  text-yellow-800  text-xs px-2 py-1 rounded">VD</span>;
      case QuestionLevel.ANALYZE:
      case 'Vận dụng cao':
        return <span className="bg-red-100  text-red-800  text-xs px-2 py-1 rounded">VDC</span>;
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
              className += "bg-green-50  border-green-200  text-green-800 ";
            } else if (isSelected) {
              className += "bg-red-50  border-red-200  text-red-800 ";
            } else {
              className += "bg-white  border-gray-200  text-gray-500  opacity-60";
            }
          } else {
            if (isSelected) {
              className += "bg-blue-50  border-blue-200  text-blue-800  shadow-sm";
            } else {
              className += "bg-white  border-gray-200  text-gray-700  hover:bg-gray-50 :bg-slate-800 hover:border-gray-300 :border-slate-700";
            }
          }

          return (
            <button
              key={index}
              onClick={() => !isSubmitted && onAnswerChange(q.id, option)}
              disabled={isSubmitted}
              className={className}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected || (isSubmitted && isCorrect)
                  ? 'border-current'
                  : 'border-gray-300 '
                }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
              {isSubmitted && isCorrect && <span className="ml-auto text-green-600 ">✓</span>}
              {isSubmitted && isSelected && !isCorrect && <span className="ml-auto text-red-600 ">✗</span>}
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
        <div className="grid grid-cols-12 gap-4 mb-2 px-4 text-sm font-bold text-gray-500 ">
          <div className="col-span-8">Phát biểu</div>
          <div className="col-span-2 text-center">Đúng</div>
          <div className="col-span-2 text-center">Sai</div>
        </div>
        {Object.entries(statements).map(([key, statement]) => {
          const userAns = userAnswer?.[key];
          const correctAns = answers[key as keyof typeof answers];

          return (
            <div key={key} className="bg-white  rounded-xl border border-gray-200  overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-8 text-gray-800 ">
                  <span className="font-bold mr-2">{key})</span>
                  {statement}
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => !isSubmitted && onAnswerChange(q.id, { ...userAnswer, [key]: true })}
                    disabled={isSubmitted}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${userAns === true
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300  hover:border-blue-400'
                      } ${isSubmitted && correctAns === true ? 'ring-2 ring-green-500 ring-offset-2 ' : ''}`}
                  >
                    Đ
                  </button>
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => !isSubmitted && onAnswerChange(q.id, { ...userAnswer, [key]: false })}
                    disabled={isSubmitted}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${userAns === false
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300  hover:border-blue-400'
                      } ${isSubmitted && correctAns === false ? 'ring-2 ring-green-500 ring-offset-2 ' : ''}`}
                  >
                    S
                  </button>
                </div>
              </div>

              {isSubmitted && (
                <div className={`px-4 py-3 text-sm border-t ${userAns === correctAns
                    ? 'bg-green-50  border-green-100  text-green-800 '
                    : 'bg-red-50  border-red-100  text-red-800 '
                  }`}>
                  <div className="font-bold mb-1">
                    {userAns === correctAns ? '✓ Chính xác' : '✗ Chưa chính xác'} - Đáp án: {correctAns ? 'Đúng' : 'Sai'}
                  </div>
                  {explanations[key as keyof typeof explanations] && (
                    <div>{explanations[key as keyof typeof explanations]}</div>
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
    <div className="bg-white  p-6 rounded-2xl shadow-sm border border-gray-200  h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100  text-blue-800  font-bold px-3 py-1 rounded-lg text-sm">
            Câu {question.id}
          </span>
          {getLevelBadge(question.level)}
        </div>
      </div>

      <div className="mb-6 text-lg font-medium text-gray-900  leading-relaxed">
        {question.question}
      </div>

      <div className="flex-grow">
        {isMC ? renderMCOptions() : renderTFStatements()}
      </div>

      {isSubmitted && !((question as QuestionTF).statements) && (question as any).explanation && (
        <div className="mt-6 p-4 bg-blue-50  rounded-xl border border-blue-100  animate-fade-in">
          <p className="text-blue-800 ">
            <strong>💡 Giải thích:</strong> {(question as any).explanation}
          </p>
        </div>
      )}

      {question.requirement && (
        <div className="mt-6 pt-4 border-t border-gray-100 ">
          <p className="text-xs text-gray-500  italic">
            YCCĐ: {question.requirement}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;