import React from 'react';
import { SuggestedQuestion } from '../types';

interface SuggestedQuestionsProps {
  questions: (string | SuggestedQuestion)[];
  topics?: string[];
  onSelectQuestion: (question: string) => void;
  loading?: boolean;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  topics = [],
  onSelectQuestion,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-w-[200px] h-16 bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (questions.length === 0 && topics.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Topics Section */}
      {topics.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-tags text-blue-500"></i>
            Chủ đề gợi ý
          </h4>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => onSelectQuestion(`Giải thích về chủ đề: ${topic}`)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium transition-colors border border-blue-200 hover:border-blue-300 flex items-center gap-1"
              >
                <span>#</span>
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Questions Section */}
      {questions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i>
            Câu hỏi ôn tập
          </h4>
          <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
            {questions.map((q, index) => {
              const isObject = typeof q !== 'string';
              const content = isObject ? (q as SuggestedQuestion).content : (q as string);
              const type = isObject ? (q as SuggestedQuestion).type : null;

              return (
                <button
                  key={index}
                  onClick={() => onSelectQuestion(content)}
                  className="flex-shrink-0 w-64 p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-xl text-left transition-all hover:shadow-md group relative overflow-hidden flex flex-col gap-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <i className="fas fa-question text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-700 font-medium line-clamp-2 group-hover:text-gray-900">
                      {content}
                    </span>
                  </div>
                  
                  {type && (
                    <div className="ml-11">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                        type === 'TRUE_FALSE' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {type === 'TRUE_FALSE' ? 'Đúng/Sai' : 'Trắc nghiệm'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedQuestions;
