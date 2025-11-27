import React, { useState, useEffect } from 'react';
import { Plus, Search, Book, Brain, Trash2, PlayCircle, Bot } from 'lucide-react';
import FlashcardGenerator, { GeneratedFlashcard } from './FlashcardGenerator';
import FlashcardView from './FlashcardView';
import {
  getAllDecks,
  deleteDeck,
  createDeck,
  addCardToDeck,
  getCardsForReview,
  recordReview,
  getDeckStats,
  FlashcardDeck,
  Flashcard
} from '../utils/flashcardStorage';
import { toast } from 'react-hot-toast';
import Card from './atoms/Card';
import Button from './atoms/Button';
import Modal from './molecules/Modal';
import { Tabs, TabItem } from './molecules/Tabs';

const Flashcards: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [view, setView] = useState<'list' | 'study'>('list');
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => { loadDecks(); }, []);

  const loadDecks = () => setDecks(getAllDecks());

  const handleCreateDeck = (generatedCards: GeneratedFlashcard[]) => {
    try {
      const timestamp = new Date().toLocaleDateString('vi-VN');
      const newDeck = createDeck(`Bộ thẻ AI - ${timestamp}`, 'Được tạo tự động bởi AI', 'Công nghệ', '12');
      generatedCards.forEach(card => {
        addCardToDeck(newDeck.id, { question: card.front, answer: card.back, difficulty: 'medium', tags: ['AI'] });
      });
      toast.success(`Đã tạo bộ thẻ mới với ${generatedCards.length} thẻ!`);
      loadDecks();
      setShowGenerator(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu bộ thẻ.');
    }
  };

  const handleDeleteDeck = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ thẻ này?')) {
      await deleteDeck(id);
      loadDecks();
      toast.success('Đã xóa bộ thẻ');
    }
  };

  const startStudy = (deck: FlashcardDeck) => {
    const cards = getCardsForReview(deck.id);
    if (cards.length === 0) {
      toast.success('Bạn đã hoàn thành ôn tập bộ thẻ này hôm nay! 🎉');
      return;
    }
    setSelectedDeck(deck);
    setStudyCards(cards);
    setCurrentCardIndex(0);
    setView('study');
  };

  const handleCardResult = async (correct: boolean) => {
    if (!selectedDeck || !studyCards[currentCardIndex]) return;
    const currentCard = studyCards[currentCardIndex];
    await recordReview(selectedDeck.id, currentCard.id, correct);
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      toast.success('Hoàn thành phiên ôn tập! 💪');
      setView('list');
      loadDecks();
    }
  };

  const renderDeckList = () => {
    const filteredDecks = decks.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-h4">Bộ thẻ Flashcards</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-4 h-4" />
                <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-9 w-full" />
              </div>
              <Button onClick={() => setShowGenerator(!showGenerator)}><Bot size={16} className="mr-2" />{showGenerator ? 'Đóng AI' : 'Tạo với AI'}</Button>
            </div>
          </div>
        </Card>

        {showGenerator && <Card><FlashcardGenerator onGenerate={handleCreateDeck} /></Card>}

        {filteredDecks.length === 0 ? (
          <Card className="text-center py-12 border-dashed">
            <Book className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-h5">Chưa có bộ thẻ nào</h3>
            <p className="text-text-secondary mt-2">Hãy tạo bộ thẻ mới để bắt đầu học.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map(deck => {
              const stats = getDeckStats(deck.id);
              return (
                <Card key={deck.id} className="flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-h6 truncate">{deck.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2 h-10">{deck.description || 'Không có mô tả'}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm mt-4 p-2 bg-background rounded-lg">
                        <div><div className="font-bold text-primary-600">{deck.cards.length}</div><div className="text-xs">Thẻ</div></div>
                        <div><div className="font-bold text-accent-red-500">{stats?.dueCards || 0}</div><div className="text-xs">Cần ôn</div></div>
                        <div><div className="font-bold text-accent-green-500">{stats?.masteredCards || 0}</div><div className="text-xs">Thuộc</div></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button onClick={() => startStudy(deck)} isFullWidth><PlayCircle size={16} className="mr-2" />Ôn tập</Button>
                    <Button variant="ghost" onClick={() => handleDeleteDeck(deck.id)}><Trash2 size={16} className="text-accent-red-500" /></Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderStudyView = () => {
    if (!selectedDeck || studyCards.length === 0) return null;
    const progress = Math.round(((currentCardIndex) / studyCards.length) * 100);
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Card>
            <div className="flex items-center justify-between">
                <Button variant="secondary" size="sm" onClick={() => setView('list')}>&larr; Quay lại</Button>
                <p className="text-sm font-semibold">{selectedDeck.title}</p>
                <p className="text-sm text-text-secondary">{currentCardIndex + 1} / {studyCards.length}</p>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-2 border border-border"><div className="bg-primary-500 h-full rounded-full" style={{ width: `${progress}%` }}></div></div>
        </Card>
        <FlashcardView card={studyCards[currentCardIndex]} onAnswer={handleCardResult} />
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {view === 'list' ? renderDeckList() : renderStudyView()}
    </div>
  );
};

export default Flashcards;
