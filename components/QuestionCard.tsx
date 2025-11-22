import React from 'react';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';

interface QuestionCardProps {
  question: QuestionMC | QuestionTF;
  type: 'mc' | 'tf';
  onAnswerChange: (questionId: number, answer: any) => void;
  userAnswer?: any;
  isSubmitted: boolean;
}

const getLevelColor = (level: QuestionLevel) => {
  switch (level) {
    case QuestionLevel.KNOW:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case QuestionLevel.UNDERSTAND:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case QuestionLevel.APPLY:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, type, onAnswerChange, userAnswer, isSubmitted }) => {

  const getOptionClass = (option: string | boolean, currentAnswer?: string | boolean) => {
    if (!isSubmitted) {
      return currentAnswer === option
        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
    }

    // Logic hiển thị màu sắc sau khi nộp bài (cho MC)
    if (type === 'mc') {
      const isCorrect = question.answer === option;
      const isSelected = currentAnswer === option;
      if (isCorrect) return 'bg-green-100 dark:bg-green-900 ring-2 ring-green-500 text-green-800 dark:text-green-200';
      if (isSelected && !isCorrect) return 'bg-red-100 dark:bg-red-900 ring-2 ring-red-500 text-red-800 dark:text-red-300';
      return 'bg-gray-50 dark:bg-gray-700';
    }
    return '';
  };

  const getTFButtonClass = (isTrue: boolean, statementKey: string) => {
    const currentAnswer = userAnswer?.[statementKey];
    const isSelected = currentAnswer === isTrue;

    if (!isSubmitted) {
      return isSelected
        ? (isTrue ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }

    // Sau khi nộp bài
    const tfQuestion = question as QuestionTF;
    const correctAnswer = tfQuestion.answers?.[statementKey as 'a' | 'b' | 'c' | 'd'];

    if (correctAnswer === isTrue) {
      return 'bg-green-500 text-white'; // Đáp án đúng
    }
    if (isSelected && correctAnswer !== isTrue) {
      return 'bg-red-500 text-white'; // Chọn sai
    }
    return 'bg-gray-100 text-gray-400 opacity-50';
  };

  const questionNumber = type === 'mc' ? `Câu ${question.id}` : `Câu ${question.id}`;

  const handleTFChange = (statementKey: string, value: boolean) => {
    if (isSubmitted) return;
    const currentAnswers = userAnswer || {};
    onAnswerChange(question.id, { ...currentAnswers, [statementKey]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col h-full transition-all duration-300 border border-gray-100 hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{questionNumber}</p>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(question.level)}`}>
          {question.level}
        </span>
      </div>
      <p className="text-gray-800 dark:text-gray-200 mb-4 flex-grow font-medium text-base">{question.question}</p>

      {type === 'mc' && (
        <div className="space-y-2 mb-4">
          {(question as QuestionMC).options.map((option, index) => (
            <button
              key={index}
              disabled={isSubmitted}
              onClick={() => onAnswerChange(question.id, option)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed border border-transparent ${getOptionClass(option, userAnswer)}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
              {isSubmitted && question.answer === option && <span className="ml-2 float-right text-green-600">✅</span>}
              {isSubmitted && userAnswer === option && question.answer !== option && <span className="ml-2 float-right text-red-600">❌</span>}
            </button>
          ))}
        </div>
      )}

      {type === 'tf' && (
        <div className="space-y-4 mb-4">
          {/* Hiển thị các phát biểu a, b, c, d */}
          {(question as QuestionTF).statements && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 italic">
                Chọn Đúng (Đ) hoặc Sai (S) cho mỗi phát biểu:
              </p>
              {Object.entries((question as QuestionTF).statements).map(([key, statement]) => {
                const tfQuestion = question as QuestionTF;
                const explanation = tfQuestion.explanations?.[key as 'a' | 'b' | 'c' | 'd'];

                return (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="font-bold text-blue-600 dark:text-blue-400 w-6">{key})</span>
                      <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">{statement}</p>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleTFChange(key, true)}
                          disabled={isSubmitted}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center shadow-sm ${getTFButtonClass(true, key)}`}
                        >
                          Đ
                        </button>
                        <button
                          onClick={() => handleTFChange(key, false)}
                          disabled={isSubmitted}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center shadow-sm ${getTFButtonClass(false, key)}`}
                        >
                          S
                        </button>
                      </div>
                    </div>

                    {isSubmitted && explanation && (
                      <div className="mt-2 ml-9 text-xs text-gray-600 bg-white p-2 rounded border border-gray-100">
                        <strong>Giải thích:</strong> {explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400"><em>YCCĐ: {question.requirement}</em></p>
      </div>
    </div>
  );
};

export default QuestionCard;