import React, { useState, useEffect, useRef } from 'react';
import { Clock, BookOpen, TrendingUp } from 'lucide-react';

interface Book {
    id: string;
    title: string;
    shortTitle: string;
    color: string;
    link: string;
    grade: number;
    publisher: string;
}

interface ReadingSession {
    bookId: string;
    startTime: number;
    duration: number; // in seconds
}

const booksData: Book[] = [
    // Lớp 10
    {
        id: '10-1',
        title: "Công nghệ 10 - Công nghệ trồng trọt",
        shortTitle: "CNT",
        color: "bg-green-600",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-10-cong-nghe-trong-trot/1/162/0/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    {
        id: '10-2',
        title: "Công nghệ 10 - Thiết kế và Công nghệ",
        shortTitle: "TKC",
        color: "bg-orange-500",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-10-thiet-ke-va-cong-nghe/1/163/0/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    {
        id: '10-3',
        title: "Chuyên đề học tập Công nghệ 10 - Công nghệ trồng trọt",
        shortTitle: "CĐT",
        color: "bg-emerald-600",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-10-(cong-nghe-trong-trot)/1/203/0/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    {
        id: '10-4',
        title: "Chuyên đề học tập Công nghệ 10 - Thiết kế và Công nghệ",
        shortTitle: "CĐK",
        color: "bg-amber-500",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-10-(thiet-ke-va-cong-nghe)/1/204/0/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    // Lớp 11
    {
        id: '11-1',
        title: "Công nghệ 11 - Công nghệ chăn nuôi",
        shortTitle: "CN",
        color: "bg-yellow-600",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-11-cong-nghe-chan-nuoi/1/383/0/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    {
        id: '11-2',
        title: "Công nghệ 11 - Công nghệ cơ khí",
        shortTitle: "CK",
        color: "bg-primary",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-11-cong-nghe-co-khi/1/384/0/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    {
        id: '11-3',
        title: "Chuyên đề học tập Công nghệ 11 - Công nghệ chăn nuôi",
        shortTitle: "CĐN",
        color: "bg-amber-600",
        link: "https://www.hoc10.vn/doc-sach/cd-cong-nghe-11-chan-nuoi/1/404/0/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    {
        id: '11-4',
        title: "Chuyên đề học tập Công nghệ 11 - Công nghệ cơ khí",
        shortTitle: "CĐC",
        color: "bg-indigo-600",
        link: "https://www.hoc10.vn/doc-sach/cd-cong-nghe-11-co-khi/1/405/0/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    // Lớp 12
    {
        id: '12-1',
        title: "Công nghệ 12 - Công nghệ điện - điện tử",
        shortTitle: "ĐĐT",
        color: "bg-red-600",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-12-cn-dien,-dien-tu/1/735/0/",
        grade: 12,
        publisher: "Cánh Diều"
    },
    {
        id: '12-2',
        title: "Công nghệ 12 - Lâm nghiệp - Thủy sản",
        shortTitle: "LN-TS",
        color: "bg-teal-600",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-12-cn-lam-nghiep,-thuy-san/1/736/0/",
        grade: 12,
        publisher: "Cánh Diều"
    },
    {
        id: '12-3',
        title: "Chuyên đề học tập Công nghệ 12 - Công nghệ điện - điện tử",
        shortTitle: "CĐ-ĐĐT",
        color: "bg-rose-600",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-12-cn-dien,-dien-tu/1/747/0/",
        grade: 12,
        publisher: "Cánh Diều"
    },
    {
        id: '12-4',
        title: "Chuyên đề học tập Công nghệ 12 - Lâm nghiệp - Thủy sản",
        shortTitle: "CĐ-LN",
        color: "bg-emerald-600",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-12-cn-lam-nghiep,-thuy-san/1/748/0/",
        grade: 12,
        publisher: "Cánh Diều"
    }
];

const Product8: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
    const [previewBook, setPreviewBook] = useState<Book | null>(null);
    const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
    const [totalReadingTime, setTotalReadingTime] = useState(0); // Total in seconds
    const [sessionTime, setSessionTime] = useState(0); // Current session time
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load total reading time from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('total_reading_time');
        if (saved) {
            setTotalReadingTime(parseInt(saved, 10));
        }
    }, []);

    // Start reading session when preview opens
    useEffect(() => {
        if (previewBook) {
            const session: ReadingSession = {
                bookId: previewBook.id,
                startTime: Date.now(),
                duration: 0
            };
            setCurrentSession(session);
            setSessionTime(0);

            // Start timer (update every second)
            timerRef.current = setInterval(() => {
                setSessionTime(prev => {
                    const newTime = prev + 1;
                    // Save to localStorage every 10 seconds
                    if (newTime % 10 === 0) {
                        const currentTotal = parseInt(localStorage.getItem('total_reading_time') || '0', 10);
                        localStorage.setItem('total_reading_time', (currentTotal + 10).toString());
                        setTotalReadingTime(currentTotal + 10);
                    }
                    return newTime;
                });
            }, 1000);
        } else {
            // Stop timer when closing
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (currentSession && sessionTime > 0) {
                // Save final session
                const currentTotal = parseInt(localStorage.getItem('total_reading_time') || '0', 10);
                const remainder = sessionTime % 10;
                if (remainder > 0) {
                    localStorage.setItem('total_reading_time', (currentTotal + remainder).toString());
                    setTotalReadingTime(currentTotal + remainder);
                }
            }
            setCurrentSession(null);
            setSessionTime(0);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [previewBook]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h}h ${m}m`;
        } else if (m > 0) {
            return `${m}m ${s}s`;
        } else {
            return `${s}s`;
        }
    };

    const filteredBooks = selectedGrade === 'all'
        ? booksData
        : booksData.filter(book => book.grade === selectedGrade);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header with Stats */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                    <span className="text-9xl">📚</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3 text-gray-900">
                        <span>📚</span>
                        Tủ sách học liệu số
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg mb-6">
                        Kho sách giáo khoa điện tử chính thống từ bộ sách Cánh Diều
                    </p>

                    {/* Reading Stats */}
                    <div className="flex justify-center gap-4 mt-6">
                        <div className="bg-orange-50 rounded-2xl p-4 border border-primary min-w-[180px] hover:bg-orange-100 transition-all">
                            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                                <Clock className="w-4 h-4" />
                                <span>Tổng thời gian đọc</span>
                            </div>
                            <div className="text-3xl font-bold text-primary">{formatTime(totalReadingTime)}</div>
                        </div>

                        {sessionTime > 0 && (
                            <div className="bg-green-50 rounded-2xl p-4 border border-green-200 min-w-[180px] animate-pulse-slow">
                                <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Phiên hiện tại</span>
                                </div>
                                <div className="text-3xl font-bold text-green-900">{formatTime(sessionTime)}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex justify-center gap-4 flex-wrap px-4">
                {[
                    { id: 'all', label: 'Tất cả', icon: '📚' },
                    { id: 10, label: 'Lớp 10', icon: '🎯' },
                    { id: 11, label: 'Lớp 11', icon: '🚀' },
                    { id: 12, label: 'Lớp 12', icon: '⭐' }
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedGrade(filter.id as number | 'all')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all hover-lift ${selectedGrade === filter.id
                                ? 'bg-amber-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                            }`}
                    >
                        <span className="mr-2">{filter.icon}</span>
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Bookshelf List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 max-w-6xl mx-auto">
                {filteredBooks.map((book, index) => (
                    <div
                        key={book.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 flex items-center gap-4 hover-lift animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Icon/Short Title */}
                        <div className={`w-16 h-16 flex-shrink-0 rounded-lg ${book.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            <span className="text-xl font-bold text-white tracking-tight">
                                {book.shortTitle}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg mb-1 truncate" title={book.title}>
                                {book.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
                                    {book.publisher}
                                </span>
                                <span className="text-gray-500 font-medium flex items-center gap-1 text-xs">
                                    🎓 Lớp {book.grade}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => setPreviewBook(book)}
                                className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-amber-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm btn-ripple"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Đọc</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal with Reading Timer */}
            {previewBook && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col animate-scale-in">
                    <div className="bg-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-600" />
                                {previewBook.title}
                            </h3>
                            {/* Live Reading Timer */}
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Đang đọc: {formatTime(sessionTime)}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href={previewBook.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center gap-2 text-sm hover-lift"
                            >
                                🔗 Mở tab mới
                            </a>
                            <button
                                onClick={() => setPreviewBook(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 relative">
                        <iframe
                            src={previewBook.link}
                            className="w-full h-full border-0"
                            title={previewBook.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        {/* Fallback message if iframe is blocked */}
                        <div className="absolute inset-0 -z-10 flex items-center justify-center">
                            <div className="text-center p-8 max-w-md">
                                <div className="text-6xl mb-4">🔒</div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Không thể tải bản xem trước</h4>
                                <p className="text-gray-600 mb-6">
                                    Trang web này có thể chặn hiển thị trong ứng dụng. Vui lòng mở trong tab mới để đọc sách.
                                </p>
                                <a
                                    href={previewBook.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl hover-lift"
                                >
                                    🚀 Mở sách ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product8;
