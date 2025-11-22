import React, { useState } from 'react';

interface Book {
    id: string;
    title: string;
    shortTitle: string;
    color: string;
    link: string;
    grade: number;
    publisher: string;
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
        color: "bg-blue-600",
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

    const filteredBooks = selectedGrade === 'all'
        ? booksData
        : booksData.filter(book => book.grade === selectedGrade);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <span className="text-9xl">📚</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3">
                        <span>📚</span>
                        Tủ sách học liệu số
                    </h2>
                    <p className="text-center text-amber-100 max-w-2xl mx-auto text-lg">
                        Kho sách giáo khoa điện tử chính thống từ bộ sách Cánh Diều
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex justify-center gap-4">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 10, label: 'Lớp 10' },
                    { id: 11, label: 'Lớp 11' },
                    { id: 12, label: 'Lớp 12' }
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedGrade(filter.id as number | 'all')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${selectedGrade === filter.id
                            ? 'bg-amber-600 text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Bookshelf List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 max-w-6xl mx-auto">
                {filteredBooks.map(book => (
                    <div
                        key={book.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-4 flex items-center gap-4"
                    >
                        {/* Icon/Short Title */}
                        <div className={`w-16 h-16 flex-shrink-0 rounded-lg ${book.color} flex items-center justify-center shadow-inner`}>
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
                                    <span>🎓</span> Lớp {book.grade}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => setPreviewBook(book)}
                                className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-amber-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                            >
                                <span>📖</span>
                                <span className="hidden sm:inline">Đọc</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewBook && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
                    <div className="bg-white p-4 flex justify-between items-center shadow-md">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <span>📖</span>
                            {previewBook.title}
                        </h3>
                        <div className="flex items-center gap-3">
                            <a
                                href={previewBook.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm"
                            >
                                <span>🔗</span> Mở tab mới
                            </a>
                            <button
                                onClick={() => setPreviewBook(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <span className="text-2xl">❌</span>
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
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <span>🚀</span> Mở sách ngay
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
