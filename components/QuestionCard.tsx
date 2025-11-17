import React from 'react';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';

interface QuestionCardProps {
  question: QuestionMC | QuestionTF;
  type: 'mc' | 'tf';
  onAnswerChange: (questionId: number, answer: string | boolean) => void;
  userAnswer?: string | boolean;
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

  const getOptionClass = (option: string | boolean) => {
    if (!isSubmitted) {
      return userAnswer === option 
        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
    }

    const isCorrect = question.answer === option;
    const isSelected = userAnswer === option;

    if (isCorrect) {
        return 'bg-green-100 dark:bg-green-900 ring-2 ring-green-500 text-green-800 dark:text-green-200';
    }
    if(isSelected && !isCorrect){
        return 'bg-red-100 dark:bg-red-900 ring-2 ring-red-500 text-red-800 dark:text-red-300';
    }
    return 'bg-gray-50 dark:bg-gray-700';
  };
  
  const questionNumber = type === 'mc' ? `Câu ${question.id}` : `Câu ${question.id - 10}`;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col h-full transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{questionNumber}</p>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(question.level)}`}>
          {question.level}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{question.question}</p>
      
      {type === 'mc' && (
        <div className="space-y-2 mb-4">
          {(question as QuestionMC).options.map((option, index) => (
            <button 
                key={index}
                disabled={isSubmitted}
                onClick={() => onAnswerChange(question.id, option)}
                className={`w-full text-left p-3 rounded-md text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${getOptionClass(option)}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
              {isSubmitted && question.answer === option && <i className="fas fa-check-circle text-green-600 ml-2"></i>}
              {isSubmitted && userAnswer === option && question.answer !== option && <i className="fas fa-times-circle text-red-600 ml-2"></i>}
            </button>
          ))}
        </div>
      )}
      
      {type === 'tf' && (
         <div className="flex space-x-4 mb-4">
            <button 
                disabled={isSubmitted}
                onClick={() => onAnswerChange(question.id, true)}
                className={`w-full text-center p-3 rounded-md text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${getOptionClass(true)}`}
            >
                Đúng
                {isSubmitted && (question as QuestionTF).answer === true && <i className="fas fa-check-circle text-green-600 ml-2"></i>}
                {isSubmitted && userAnswer === true && (question as QuestionTF).answer === false && <i className="fas fa-times-circle text-red-600 ml-2"></i>}
            </button>
            <button
                disabled={isSubmitted}
                onClick={() => onAnswerChange(question.id, false)} 
                className={`w-full text-center p-3 rounded-md text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${getOptionClass(false)}`}
            >
                Sai
                {isSubmitted && (question as QuestionTF).answer === false && <i className="fas fa-check-circle text-green-600 ml-2"></i>}
                {isSubmitted && userAnswer === false && (question as QuestionTF).answer === true && <i className="fas fa-times-circle text-red-600 ml-2"></i>}
            </button>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400"><em>YCCĐ: {question.requirement}</em></p>
      </div>
    </div>
  );
};

export default QuestionCard;