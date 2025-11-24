import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold text-primary">404</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Không tìm thấy trang
                </h1>

                <p className="text-gray-500 mb-8">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>

                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Home size={20} />
                        Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
