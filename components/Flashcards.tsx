import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Book,
  Brain,
  Trash2,
  PlayCircle,
} from 'lucide-react';
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

const Flashcards: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'study'>('list');
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = () => {
    setDecks(getAllDecks());
  };

  const handleCreateDeck = (generatedCards: GeneratedFlashcard[]) => {
    try {
      // Create a new deck
      const timestamp = new Date().toLocaleDateString('vi-VN');
      const newDeck = createDeck(
        `Bộ thẻ AI - ${timestamp}`,
        'Được tạo tự động bởi AI Gemini',
        'Công nghệ',
        '12'
      );

      // Add generated cards
      generatedCards.forEach(card => {
        addCardToDeck(newDeck.id, {
          question: card.front,
          answer: card.back + (card.explanation ? `\n\n💡 ${card.explanation}` : ''),
          difficulty: 'medium',
          tags: ['AI', 'Tự động']
        });
      });

      toast.success(`Đã tạo bộ thẻ mới với ${generatedCards.length} thẻ!`);
      loadDecks();
      setShowGenerator(false);
    } catch (error) {
      console.error('Error creating deck:', error);
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

  // Render List View
  const renderDeckList = () => {
    const filteredDecks = decks.filter(d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Brain className="text-blue-600 w-8 h-8" />
            Flashcards
          </h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bộ thẻ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {showGenerator ? 'Đóng AI' : 'Tạo với AI'}
            </button>
          </div>
        </div>

        {showGenerator && (
          <div className="animate-fade-in">
            <FlashcardGenerator onGenerate={handleCreateDeck} />
          </div>
        )}

        {filteredDecks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Chưa có bộ thẻ nào</h3>
            <p className="text-gray-500 mb-4">Hãy tạo bộ thẻ đầu tiên để bắt đầu học tập hiệu quả</p>
            <button
              onClick={() => setShowGenerator(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Tạo bộ thẻ mới ngay &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map(deck => {
              const stats = getDeckStats(deck.id);
              return (
                <div key={deck.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Book className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Xóa bộ thẻ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-1 truncate" title={deck.title}>
                    {deck.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                    {deck.description || 'Không có mô tả'}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                    <div className="text-center flex-1 border-r border-gray-200">
                      <div className="font-bold text-blue-600">{deck.cards.length}</div>
                      <div className="text-xs">Thẻ</div>
                    </div>
                    <div className="text-center flex-1 border-r border-gray-200">
                      <div className="font-bold text-orange-600">{stats?.dueCards || 0}</div>
                      <div className="text-xs">Cần ôn</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="font-bold text-green-600">{stats?.masteredCards || 0}</div>
                      <div className="text-xs">Thuộc</div>
                    </div>
                  </div>

                  <button
                    onClick={() => startStudy(deck)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Ôn tập ngay
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render Study View
  const renderStudyView = () => {
    if (!selectedDeck || studyCards.length === 0) return null;

    const currentCard = studyCards[currentCardIndex];
    const progress = Math.round(((currentCardIndex) / studyCards.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('list')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            &larr; Quay lại danh sách
          </button>
          <div className="text-sm text-gray-500">
            Thẻ {currentCardIndex + 1} / {studyCards.length}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        <FlashcardView
          card={currentCard}
          onAnswer={handleCardResult}
        />

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Nhấn vào thẻ để lật • Chọn mức độ ghi nhớ để tiếp tục</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {view === 'list' ? renderDeckList() : renderStudyView()}
    </div>
  );
};

export default Flashcards;
