import React from 'react';
import ChatInterface from './ChatInterface';
import ChatSidebar from './ChatSidebar';
import LearningContextPanel from './LearningContextPanel';
import Card from './atoms/Card';
import {
  MessageSquare,
  FileText,
  Clock,
  Search,
  Download,
  CornerDownLeft,
  Lightbulb,
  HelpCircle,
  FileQuestion,
  Zap,
  Scale,
} from 'lucide-react';

const instructionItems = [
  {
    icon: MessageSquare,
    title: 'Chat mới',
    description: 'Nhấn “Cuộc trò chuyện mới” ở sidebar để tách việc học theo từng chủ đề.',
  },
  {
    icon: FileText,
    title: 'Upload tài liệu',
    description: 'Dùng icon 📎 ngay tại ô nhập để đính kèm PDF, DOCX hoặc hình ảnh cần phân tích.',
  },
  {
    icon: Clock,
    title: 'Lịch sử tự lưu',
    description: 'Sidebar hiển thị tất cả phiên chat, có thể tìm kiếm hoặc xóa bất kỳ lúc nào.',
  },
  {
    icon: Search,
    title: 'Tra cứu nhanh',
    description: 'Ô tìm kiếm giúp bạn lọc lại các đoạn chat cũ chỉ trong vài giây.',
  },
  {
    icon: Download,
    title: 'Xuất file',
    description: 'Nhấn nút “Xuất nội dung” để tải toàn bộ hội thoại thành tập tin TXT.',
  },
  {
    icon: CornerDownLeft,
    title: 'Phím tắt',
    description: 'Enter để gửi tin nhắn, Shift + Enter để xuống dòng khi soạn câu dài.',
  },
];

const examplePrompts = [
  {
    icon: FileQuestion,
    label: 'Lý thuyết',
    text: 'Giải thích nguyên lý hoạt động của máy biến áp ba pha trong hệ thống điện.',
  },
  {
    icon: Zap,
    label: 'Bài tập',
    text: 'Giải bài tập mạch điện ba pha với công suất P = 10kW và cosφ = 0.8.',
  },
  {
    icon: FileText,
    label: 'Phân tích file',
    text: 'Phân tích đề thi trong file PDF và đưa ra hướng giải từng câu hỏi.',
  },
  {
    icon: Scale,
    label: 'So sánh',
    text: 'So sánh điốt và transistor về cấu tạo, nguyên lý và ứng dụng.',
  },
];

const Product1: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Section */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
            🤖 Trợ lý Công nghệ AI
          </div>
          <h2 className="text-h3 md:text-h2">Trò chuyện với AI</h2>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
            Đặt câu hỏi về Công nghệ (SGK Kết Nối Tri Thức & Cánh Diều), đính kèm tài liệu để AI phân tích và lưu trữ mọi cuộc hội thoại tự động.
          </p>
        </div>
      </Card>

      {/* Chat Area with Sidebar */}
      <div className="grid gap-4 md:grid-cols-[320px,1fr]">
        <div className="hidden md:block h-full">
          <Card noPadding className="h-full overflow-hidden">
            <ChatSidebar />
          </Card>
        </div>
        <div className="min-h-[600px]">
          <Card noPadding className="h-full overflow-hidden">
            <ChatInterface />
          </Card>
        </div>
      </div>
      {/* Mobile sidebar instance */}
      <div className="lg:hidden">
        <ChatSidebar />
      </div>

      {/* AI Knowledge Context */}
      <Card noPadding>
        <LearningContextPanel grade="10" subject="Công nghệ" topic="AI" />
      </Card>

      {/* Instructions Section */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-primary-600" />
          <h3 className="text-h5">Hướng dẫn sử dụng hiệu quả</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructionItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-border/60">
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                <item.icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-text-primary">{item.title}</p>
                <p className="text-sm text-text-secondary mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Examples Section */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          <h3 className="text-h5">Ví dụ câu hỏi hay</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examplePrompts.map((item) => (
            <button
              key={item.text}
              type="button"
              className="text-left p-5 rounded-xl border border-primary/30 bg-primary-50 hover:bg-primary-100 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2 text-primary-700 font-semibold text-sm">
                <item.icon size={18} />
                {item.label}
              </div>
              <p className="text-text-secondary group-hover:text-primary-800 transition-colors">
                “{item.text}”
              </p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Product1;
