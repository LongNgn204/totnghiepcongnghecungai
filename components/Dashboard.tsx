import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <i className="fas fa-user-circle text-5xl"></i>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Chào mừng trở lại, {user?.displayName || user?.email}! 👋
            </h1>
            <p className="text-blue-100 text-lg mt-2">
              Sẵn sàng chinh phục môn Công Nghệ THPT cùng AI Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Main Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <i className="fas fa-bolt text-yellow-500"></i>
          Chức Năng Chính
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chat AI */}
          <Link to="/san-pham-1" className="group">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-blue-300">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <i className="fas fa-comments text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Chat AI</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hỏi đáp với AI, upload file, giải thích chi tiết
              </p>
            </div>
          </Link>

          {/* Tạo Câu Hỏi */}
          <Link to="/san-pham-2" className="group">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-green-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <i className="fas fa-question-circle text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Tạo Câu Hỏi</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Tự động tạo đề 4 lựa chọn, Đúng/Sai, YCCĐ
              </p>
            </div>
          </Link>

          {/* Đề Công Nghiệp */}
          <Link to="/san-pham-3" className="group">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-purple-300">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <i className="fas fa-industry text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Đề Công Nghiệp</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Điện + Điện tử, 28 câu chuẩn format
              </p>
            </div>
          </Link>

          {/* Đề Nông Nghiệp */}
          <Link to="/san-pham-4" className="group">
            <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-teal-300">
              <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <i className="fas fa-tractor text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Đề Nông Nghiệp</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Trồng trọt + Chăn nuôi, 28 câu format SGK
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <i className="fas fa-layer-group text-blue-500"></i>
          Công Cụ Học Tập
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Flashcards */}
          <Link to="/san-pham-5" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-layer-group text-2xl text-white"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Flashcards</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Học theo phương pháp lặp lại ngắt quãng, AI tạo thẻ tự động
              </p>
            </div>
          </Link>

          {/* Dashboard Stats */}
          <Link to="/san-pham-6" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-chart-line text-2xl text-white"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Thống Kê</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Theo dõi tiến độ học tập, xem biểu đồ chi tiết
              </p>
            </div>
          </Link>

          {/* Nhóm Học */}
          <Link to="/san-pham-7" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-users text-2xl text-white"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Nhóm Học</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Tạo nhóm, chia sẻ tài liệu, học cùng bạn bè
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <i className="fas fa-link text-green-500"></i>
          Truy Cập Nhanh
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link to="/lich-su" className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            <i className="fas fa-history text-2xl text-blue-500"></i>
            <span className="font-semibold text-gray-800 dark:text-white">Lịch Sử</span>
          </Link>

          <Link to="/bang-xep-hang" className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            <i className="fas fa-trophy text-2xl text-yellow-500"></i>
            <span className="font-semibold text-gray-800 dark:text-white">Bảng Xếp Hạng</span>
          </Link>

          <Link to="/profile" className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            <i className="fas fa-user-circle text-2xl text-purple-500"></i>
            <span className="font-semibold text-gray-800 dark:text-white">Hồ Sơ</span>
          </Link>

          <Link to="/pwa-settings" className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            <i className="fas fa-cog text-2xl text-gray-500"></i>
            <span className="font-semibold text-gray-800 dark:text-white">Cài Đặt</span>
          </Link>
        </div>
      </div>

      {/* How to Use Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <i className="fas fa-book-open text-indigo-500"></i>
          Hướng Dẫn Sử Dụng
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                <i className="fas fa-comments text-blue-500 mr-2"></i>
                Chat AI - Hỏi Đáp Thông Minh
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Nhấn vào <strong>"Chat AI"</strong> để bắt đầu trò chuyện với AI Gemini. Bạn có thể:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>Hỏi bất kỳ câu hỏi nào về môn Công Nghệ</li>
                <li>Upload file PDF/DOC để AI phân tích và tóm tắt</li>
                <li>Yêu cầu giải thích chi tiết với sơ đồ minh họa</li>
                <li>Xem lại lịch sử chat đã lưu</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                <i className="fas fa-question-circle text-green-500 mr-2"></i>
                Tạo Câu Hỏi - Luyện Tập Linh Hoạt
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Vào <strong>"Tạo Câu Hỏi"</strong> để AI tự động sinh đề theo yêu cầu:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li><strong>4 Lựa Chọn:</strong> Trắc nghiệm ABCD chuẩn format THPT</li>
                <li><strong>Đúng/Sai:</strong> Câu hỏi Đúng/Sai nhanh gọn</li>
                <li><strong>YCCĐ:</strong> Yêu cầu cần đạt theo SGK</li>
                <li>Chọn chủ đề, số lượng câu, mức độ khó</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                <i className="fas fa-industry text-purple-500 mr-2"></i>
                Đề Công Nghiệp - Luyện Đề Chuyên Sâu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Chọn <strong>"Đề Công Nghiệp"</strong> để làm đề thi mô phỏng:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>28 câu (24 Trắc nghiệm + 4 Đúng/Sai) chuẩn Bộ GD&ĐT</li>
                <li>Chọn chủ đề: Điện hoặc Điện tử</li>
                <li>In đề hoặc tải xuống PDF</li>
                <li>Xem đáp án + giải thích chi tiết</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                4
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                <i className="fas fa-tractor text-teal-500 mr-2"></i>
                Đề Nông Nghiệp - Thực Hành Đầy Đủ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Tương tự, vào <strong>"Đề Nông Nghiệp"</strong> để làm đề:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>28 câu chuẩn format (24 TN + 4 Đ/S)</li>
                <li>Chủ đề: Trồng trọt hoặc Chăn nuôi</li>
                <li>Nội dung từ cả 2 bộ SGK</li>
                <li>Hỗ trợ in/tải như Đề Công Nghiệp</li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                5
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                <i className="fas fa-layer-group text-pink-500 mr-2"></i>
                Flashcards - Ghi Nhớ Hiệu Quả
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Sử dụng <strong>"Flashcards"</strong> để học theo phương pháp khoa học:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>Tạo bộ thẻ theo chủ đề của bạn</li>
                <li>AI tự động tạo thẻ từ SGK (99% chính xác)</li>
                <li>Ôn tập theo thuật toán lặp lại ngắt quãng</li>
                <li>Theo dõi tiến độ ghi nhớ</li>
              </ul>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                6
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                <i className="fas fa-chart-line text-indigo-500 mr-2"></i>
                Thống Kê - Theo Dõi Tiến Độ
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Xem <strong>"Thống Kê"</strong> để biết mình đang ở đâu:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>Biểu đồ điểm số qua các lần thi</li>
                <li>Thống kê theo chủ đề, mức độ khó</li>
                <li>Thời gian học, số câu đã làm</li>
                <li>Gợi ý chủ đề cần cải thiện</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips Box */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-l-4 border-yellow-500">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i>
            Mẹo Học Tập Hiệu Quả
          </h4>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span><strong>Học đều đặn:</strong> Mỗi ngày 30-60 phút tốt hơn học dồn 5-6 tiếng</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span><strong>Ôn tập thường xuyên:</strong> Dùng Flashcards mỗi ngày để ghi nhớ lâu</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span><strong>Làm đề thử:</strong> Làm ít nhất 3-5 đề mô phỏng trước kỳ thi</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span><strong>Hỏi khi chưa hiểu:</strong> Chat AI luôn sẵn sàng giải đáp 24/7</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          <i className="fas fa-chart-bar mr-2"></i>
          Thống Kê Nhanh
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm text-indigo-100">Đề đã làm</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm text-indigo-100">Câu hỏi đã trả lời</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm text-indigo-100">Flashcards đã học</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center">
            <div className="text-3xl font-bold mb-1">0h</div>
            <div className="text-sm text-indigo-100">Thời gian học</div>
          </div>
        </div>
        <p className="text-center text-sm text-indigo-100 mt-4">
          <i className="fas fa-info-circle mr-1"></i>
          Số liệu sẽ được cập nhật khi bạn bắt đầu sử dụng
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
