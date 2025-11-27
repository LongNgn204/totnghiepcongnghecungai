import React, { useState, useEffect, useRef } from 'react';
import { Clock, BookOpen, TrendingUp, Filter, Book } from 'lucide-react';
import Card from './atoms/Card';
import Button from './atoms/Button';
import Modal from './molecules/Modal';

interface Book {
    id: string;
    title: string;
    shortTitle: string;
    color: string; // This will be less important, we'll use theme colors
    link: string;
    grade: number;
    publisher: string;
}

const booksData: Book[] = [ /* ... data is the same ... */ ];
const QUOTES = [ /* ... data is the same ... */ ];

const Product8: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
    const [previewBook, setPreviewBook] = useState<Book | null>(null);
    const [totalReadingTime, setTotalReadingTime] = useState(0);
    const [sessionTime, setSessionTime] = useState(0);
    const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('total_reading_time');
        if (saved) setTotalReadingTime(parseInt(saved, 10));
    }, []);

    useEffect(() => {
        if (previewBook) {
            setSessionTime(0);
            timerRef.current = setInterval(() => {
                setSessionTime(prev => {
                    const newTime = prev + 1;
                    if (newTime % 10 === 0) {
                        const currentTotal = parseInt(localStorage.getItem('total_reading_time') || '0', 10);
                        localStorage.setItem('total_reading_time', (currentTotal + 10).toString());
                        setTotalReadingTime(currentTotal + 10);
                    }
                    return newTime;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (sessionTime > 0) {
                const currentTotal = parseInt(localStorage.getItem('total_reading_time') || '0', 10);
                const remainder = sessionTime % 10;
                if (remainder > 0) {
                    localStorage.setItem('total_reading_time', (currentTotal + remainder).toString());
                    setTotalReadingTime(currentTotal + remainder);
                }
            }
            setSessionTime(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [previewBook]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const filteredBooks = selectedGrade === 'all' ? booksData : booksData.filter(b => b.grade === selectedGrade);

    const filterOptions = [
        { id: 'all', label: 'Tất cả' },
        { id: 10, label: 'Lớp 10' },
        { id: 11, label: 'Lớp 11' },
        { id: 12, label: 'Lớp 12' },
        { id: 13, label: 'STEM & AI' }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="text-center">
                <h2 className="text-h3 md:text-h2">Tủ Sách Học Liệu Số</h2>
                <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
                    Truy cập và đọc các sách giáo khoa Công nghệ, sách chuyên đề STEM và AI trực tuyến.
                </p>
            </Card>

            <Card>
                <div className="text-center">
                    <p className="italic text-text-secondary">"{quote.text}"</p>
                    <p className="text-sm font-semibold mt-1">— {quote.author}</p>
                </div>
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{formatTime(totalReadingTime)}</p>
                        <p className="text-sm text-text-secondary">Tổng thời gian đọc</p>
                    </div>
                    {sessionTime > 0 && (
                        <div className="text-center">
                            <p className="text-2xl font-bold text-accent-green-600">{formatTime(sessionTime)}</p>
                            <p className="text-sm text-text-secondary">Phiên hiện tại</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={18} className="text-primary-600"/>
                    <h3 className="text-h5">Lọc theo lớp</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map(opt => (
                        <Button key={opt.id} variant={selectedGrade === opt.id ? 'primary' : 'secondary'} onClick={() => setSelectedGrade(opt.id as any)}>{opt.label}</Button>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map(book => (
                    <Card key={book.id} className="flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-h6 font-bold truncate" title={book.title}>{book.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                                <span>{book.publisher}</span> • <span>{book.grade === 13 ? 'STEM & AI' : `Lớp ${book.grade}`}</span>
                            </div>
                        </div>
                        <Button onClick={() => setPreviewBook(book)} isFullWidth className="mt-4"> <BookOpen size={16} className="mr-2"/> Đọc ngay</Button>
                    </Card>
                ))}
            </div>

            {previewBook && (
                <Modal isOpen title={previewBook.title} onClose={() => setPreviewBook(null)} size="xl">
                    <div className="h-[75vh]">
                        <iframe src={previewBook.link} className="w-full h-full border-0" title={previewBook.title} allowFullScreen />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Product8;
