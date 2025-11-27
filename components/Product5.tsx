import React, { useState, useEffect } from 'react';
import FlashcardView from './FlashcardView';
import FlashcardGenerator, { GeneratedFlashcard } from './FlashcardGenerator';
import {
  FlashcardDeck,
  Flashcard,
  getAllDecks,
  getDeck,
  createDeck,
  saveDeck,
  deleteDeck,
  addCardToDeck,
  deleteCard,
  recordReview,
  getCardsForReview,
  getDeckStats,
  syncDecksFromBackend
} from '../utils/flashcardStorage';
import syncManager from '../utils/syncManager';
import Card from './atoms/Card';
import Button from './atoms/Button';
import FormField from './molecules/FormField';
import { Tabs, TabItem } from './molecules/Tabs';
import Modal from './molecules/Modal';
import { Folder, BrainCircuit, Plus, Eye, Trash2, Brain } from 'lucide-react';

const Product5: React.FC = () => {
  const [activeTab, setActiveTab] = useState('decks');
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedFlashcard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadDecks(); }, []);

  const loadDecks = async () => {
    setLoading(true);
    const syncedDecks = await syncDecksFromBackend();
    setDecks(syncedDecks);
    setLoading(false);
  };

  const handleCreateDeck = (title: string, description: string) => {
    const newDeck = createDeck(title, description, 'General', '12');
    saveDeck(newDeck);
    syncManager.syncFlashcards();
    loadDecks();
    setShowCreateDeck(false);
  };

  const handleCreateCard = (question: string, answer: string) => {
    if (!selectedDeck) return;
    addCardToDeck(selectedDeck.id, { question, answer, difficulty: 'medium', tags: [] });
    syncManager.syncFlashcards();
    const updatedDeck = getDeck(selectedDeck.id);
    if (updatedDeck) setSelectedDeck(updatedDeck);
    loadDecks();
    setShowCreateCard(false);
  };

  const startStudySession = (deck: FlashcardDeck) => {
    const dueCards = getCardsForReview(deck.id);
    if (dueCards.length === 0) { alert('Không có thẻ nào cần ôn tập!'); return; }
    setSelectedDeck(deck);
    setStudyCards(dueCards);
    setCurrentCardIndex(0);
    setActiveTab('study');
  };

  const handleAnswer = (correct: boolean) => {
    if (!selectedDeck || !studyCards[currentCardIndex]) return;
    recordReview(selectedDeck.id, studyCards[currentCardIndex].id, correct);
    syncManager.syncFlashcards();
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert('Hoàn thành phiên ôn tập!');
      setActiveTab('decks');
      loadDecks();
    }
  };

  const tabItems: TabItem[] = [
    { key: 'decks', label: <div className="flex items-center gap-2"><Folder size={16} /><span>Bộ thẻ ({decks.length})</span></div>, content: <DecksView /> },
    { key: 'ai', label: <div className="flex items-center gap-2"><BrainCircuit size={16} /><span>AI Tạo thẻ</span></div>, content: <AIGeneratorView /> },
    { key: 'study', label: <div className="flex items-center gap-2"><Brain size={16} /><span>Ôn tập</span></div>, content: <StudyView />, disabled: !selectedDeck || studyCards.length === 0 },
  ];

  function DecksView() {
    return (
      <div className="space-y-4">
        <div className="text-right">
          <Button onClick={() => setShowCreateDeck(true)}><Plus size={16} className="mr-2" />Tạo bộ thẻ mới</Button>
        </div>
        {decks.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-h5">Chưa có bộ thẻ nào</h3>
            <p className="text-text-secondary mt-2">Tạo bộ thẻ đầu tiên để bắt đầu học!</p>
          </Card>
        ) : (
          decks.map(deck => {
            const stats = getDeckStats(deck.id);
            return (
              <Card key={deck.id}>
                <h3 className="text-h5">{deck.title}</h3>
                <p className="text-text-secondary text-sm mt-1">{deck.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-text-secondary">
                  <span>Tổng: <strong>{stats.totalCards}</strong></span>
                  <span>Cần ôn: <strong className="text-accent-red-500">{stats.dueCards}</strong></span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button onClick={() => startStudySession(deck)} disabled={stats.dueCards === 0}>Ôn tập ngay ({stats.dueCards})</Button>
                  <Button variant="secondary" onClick={() => { setSelectedDeck(deck); setShowCreateCard(true); }}>Thêm thẻ</Button>
                  <Button variant="ghost" className="text-accent-red-500 hover:bg-accent-red-50"><Trash2 size={16} /></Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    );
  }

  function AIGeneratorView() {
    return <FlashcardGenerator onGenerate={setGeneratedCards} />;
  }

  function StudyView() {
    if (!selectedDeck || studyCards.length === 0) return <Card className="text-center py-8 text-text-secondary">Không có thẻ nào để ôn tập.</Card>;
    return (
      <div className="space-y-4">
        <Card>
          <p className="text-sm font-bold">Đang ôn tập: {selectedDeck.title}</p>
          <p className="text-sm text-text-secondary">Thẻ {currentCardIndex + 1} / {studyCards.length}</p>
        </Card>
        <FlashcardView card={studyCards[currentCardIndex]} onAnswer={handleAnswer} showButtons />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="text-center">
        <h2 className="text-h3 md:text-h2">Flashcards - Học Thông Minh</h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
          Tạo flashcards, ôn tập theo phương pháp lặp lại ngắt quãng (spaced repetition) và theo dõi tiến độ.
        </p>
      </Card>

      <Tabs items={tabItems} value={activeTab} onChange={setActiveTab} />

      {showCreateDeck && <CreateDeckModal onClose={() => setShowCreateDeck(false)} onCreate={handleCreateDeck} />}
      {showCreateCard && selectedDeck && <CreateCardModal deck={selectedDeck} onClose={() => setShowCreateCard(false)} onCreate={handleCreateCard} />}
    </div>
  );
};

function CreateDeckModal({ onClose, onCreate }: { onClose: () => void, onCreate: (title: string, desc: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  return (
    <Modal isOpen title="Tạo bộ thẻ mới" onClose={onClose}>
      <div className="space-y-4">
        <FormField id="deck-title" label="Tên bộ thẻ" required>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Mạch điện ba pha" />
        </FormField>
        <FormField id="deck-desc" label="Mô tả">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả ngắn gọn nội dung..." rows={3} />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button onClick={() => onCreate(title, description)}>Tạo</Button>
        </div>
      </div>
    </Modal>
  );
}

function CreateCardModal({ deck, onClose, onCreate }: { deck: FlashcardDeck, onClose: () => void, onCreate: (q: string, a: string) => void }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  return (
    <Modal isOpen title={`Thêm thẻ vào: ${deck.title}`} onClose={onClose} size="lg">
      <div className="space-y-4">
        <FormField id="card-q" label="Câu hỏi (Mặt trước)" required>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={4} />
        </FormField>
        <FormField id="card-a" label="Đáp án (Mặt sau)" required>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4} />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button onClick={() => onCreate(question, answer)}>Thêm thẻ</Button>
        </div>
      </div>
    </Modal>
  );
}

export default Product5;
