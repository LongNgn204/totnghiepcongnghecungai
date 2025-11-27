import React, { useState } from 'react';
import type { Flashcard } from '../utils/flashcardStorage';
import { Star, X, Check } from 'lucide-react';
import Button from './atoms/Button';
import Badge from './atoms/Badge';

interface FlashcardViewProps {
  card: Flashcard;
  onAnswer?: (correct: boolean) => void;
  showButtons?: boolean;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, onAnswer, showButtons = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (correct: boolean) => {
    if (onAnswer) onAnswer(correct);
    setTimeout(() => setIsFlipped(false), 300);
  };

  const difficultyMap = {
    easy: { label: 'Dễ', tone: 'success' as const },
    medium: { label: 'Trung bình', tone: 'warning' as const },
    hard: { label: 'Khó', tone: 'error' as const },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <Badge tone={difficultyMap[card.difficulty].tone}>{difficultyMap[card.difficulty].label}</Badge>
        <div className="text-xs text-text-secondary">{card.reviewCount} lần ôn</div>
      </div>

      <div className="relative w-full h-80 cursor-pointer perspective-1000" onClick={handleFlip}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full gradient-primary rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-bold text-center">{card.question}</h3>
            </div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full gradient-success rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-bold text-center">{card.answer}</h3>
            </div>
          </div>
        </div>
      </div>

      {showButtons && isFlipped && (
        <div className="flex gap-4 mt-6 justify-center animate-fade-in">
          <Button onClick={() => handleAnswer(false)} variant="danger" size="lg" className="flex-1 max-w-xs"><X className="mr-2" />Chưa nhớ</Button>
          <Button onClick={() => handleAnswer(true)} className="flex-1 max-w-xs bg-accent-green-600 hover:bg-accent-green-700" size="lg"><Check className="mr-2" />Đã nhớ</Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
