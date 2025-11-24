import React, { useState } from 'react';
import { generateContent } from '../utils/geminiAPI';

interface FlashcardGeneratorProps {
  onGenerate: (flashcards: GeneratedFlashcard[]) => void;
}

export interface GeneratedFlashcard {
  front: string;
  back: string;
  explanation?: string;
}

interface FormData {
  grade: string;
  textbook: string;
  topic: string;
  subtopic: string;
  quantity: number;
  difficulty: string;
}

const TEXTBOOKS = ['Kết nối tri thức', 'Cánh diều'];
const GRADES = ['6', '7', '8', '9', '10', '11', '12'];
const DIFFICULTIES = ['Dễ', 'Trung bình', 'Khó'];

// Topics theo từng lớp
const TOPICS: Record<string, string[]> = {
  '6': ['Công nghệ là gì', 'Vật liệu', 'Năng lượng', 'Thông tin', 'Phương tiện kỹ thuật'],
  '7': ['Thiết kế sản phẩm', 'Chế tạo sản phẩm', 'Công nghệ thông tin', 'Điện tử cơ bản'],
  '8': ['Máy móc cơ khí', 'Điện tử nâng cao', 'Lập trình cơ bản', 'Tự động hóa'],
  '9': ['Công nghệ sản xuất', 'Robot', 'Lập trình nâng cao', 'IoT cơ bản'],
  '10': ['Công nghệ thông tin', 'Lập trình Python', 'Mạng máy tính', 'An toàn thông tin'],
  '11': ['Cơ sở dữ liệu', 'Phát triển web', 'AI và Machine Learning cơ bản', 'Xử lý ảnh'],
  '12': ['Dự án công nghệ', 'Khởi nghiệp công nghệ', 'Công nghệ 4.0', 'Nghề nghiệp công nghệ']
};

export default function FlashcardGenerator({ onGenerate }: FlashcardGeneratorProps) {
  const [formData, setFormData] = useState<FormData>({
    grade: '10',
    textbook: 'Kết nối tri thức',
    topic: '',
    subtopic: '',
    quantity: 10,
    difficulty: 'Trung bình'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableTopics = TOPICS[formData.grade] || [];

  const handleGenerate = async () => {
    if (!formData.topic) {
      setError('Vui lòng chọn chủ đề');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = generatePrompt(formData);
      const flashcards = await generateFlashcardsWithAI(prompt);

      if (flashcards.length === 0) {
        throw new Error('AI không thể tạo flashcards. Vui lòng thử lại.');
      }

      onGenerate(flashcards);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo flashcards');
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = (data: FormData): string => {
    return `🎓 Bạn là chuyên gia giáo dục Công nghệ và AI Tutor hàng đầu Việt Nam.
Nhiệm vụ của bạn là tạo bộ Flashcards ôn tập chất lượng cao cho học sinh THPT.

📚 **THÔNG TIN CẤU HÌNH:**
- **Sách giáo khoa:** ${data.textbook}
- **Lớp:** ${data.grade}
- **Chủ đề chính:** ${data.topic}
${data.subtopic ? `- **Chi tiết:** ${data.subtopic}` : ''}
- **Độ khó:** ${data.difficulty}
- **Số lượng:** ${data.quantity} thẻ

🧠 **YÊU CẦU SƯ PHẠM:**
1. **Chính xác tuyệt đối:** Nội dung phải bám sát SGK "${data.textbook}".
2. **Ngôn ngữ tự nhiên:** Giải thích dễ hiểu, gần gũi, không copy-paste máy móc.
3. **Tư duy sâu:**
   - Front: Câu hỏi gợi mở, kích thích tư duy.
   - Back: Câu trả lời súc tích, đi vào bản chất.
   - Explanation: Ví dụ thực tế, liên hệ đời sống.

🔥 **ĐỘ KHÓ:**
${data.difficulty === 'Dễ' ? '- Tập trung khái niệm cơ bản, nhận biết.' : ''}
${data.difficulty === 'Trung bình' ? '- Tập trung hiểu và vận dụng đơn giản.' : ''}
${data.difficulty === 'Khó' ? '- Tập trung phân tích, so sánh, vận dụng cao.' : ''}

📝 **OUTPUT FORMAT (JSON Only):**
\`\`\`json
[
  {
    "front": "Câu hỏi ngắn gọn (Max 20 từ)",
    "back": "Câu trả lời cốt lõi (50-100 từ)",
    "explanation": "Giải thích chi tiết + Ví dụ thực tế (Rất quan trọng)"
  }
]
\`\`\`
⚠️ LƯU Ý: Chỉ trả về JSON thuần, KHÔNG thêm text giải thích!`;
  };

  const generateFlashcardsWithAI = async (prompt: string): Promise<GeneratedFlashcard[]> => {
    const response = await generateContent(prompt);

    if (!response.success) {
      throw new Error(response.error || 'AI API không phản hồi');
    }

    const text = response.text;

    // Parse JSON từ response
    try {
      // Loại bỏ markdown code blocks nếu có
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid format');
      }

      const flashcards = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(flashcards)) {
        throw new Error('Invalid format');
      }

      return flashcards.filter(
        (f: any) => f.front && f.back
      );
    } catch (parseError) {
      console.error('Parse error:', parseError, '\nRaw text:', text);
      throw new Error('Không thể phân tích kết quả từ AI. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-full p-3 shadow-md">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Tạo Flashcards</h2>
          <p className="text-sm text-gray-600">Tạo flashcards tự động từ SGK Công Nghệ</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-500 mt-0.5">⚠️</span>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Lớp */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>🎓</span> Lớp
          </label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value, topic: '' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          >
            {GRADES.map(grade => (
              <option key={grade} value={grade}>Lớp {grade}</option>
            ))}
          </select>
        </div>

        {/* Sách giáo khoa */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📚</span> Sách giáo khoa
          </label>
          <select
            value={formData.textbook}
            onChange={(e) => setFormData({ ...formData, textbook: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          >
            {TEXTBOOKS.map(book => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>

        {/* Chủ đề */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>💡</span> Chủ đề <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">-- Chọn chủ đề --</option>
            {availableTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Chi tiết */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>🏷️</span> Chi tiết (tùy chọn)
          </label>
          <input
            type="text"
            value={formData.subtopic}
            onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
            placeholder="VD: Cấu trúc lặp, Mạng LAN..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>🔢</span> Số lượng flashcards
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Math.min(30, Math.max(1, parseInt(e.target.value) || 10)) })}
            min="1"
            max="30"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Từ 1 đến 30 thẻ</p>
        </div>

        {/* Độ khó */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📊</span> Mức độ
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thông tin */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-primary rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-primary mt-1">ℹ️</span>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>AI sẽ tạo flashcards <strong>chính xác 99%</strong> theo sách "{formData.textbook}"</li>
              <li>Nội dung được trích dẫn từ SGK lớp {formData.grade}</li>
              <li>Mỗi lần tạo mất khoảng 10-15 giây</li>
              <li>Có thể tạo lại nếu không hài lòng</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !formData.topic}
        className="w-full bg-gradient-to-r from-primary to-primary-hover text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            Đang tạo flashcards... (có thể mất 10-15s)
          </>
        ) : (
          <>
            <span>✨</span>
            Tạo {formData.quantity} Flashcards với AI
          </>
        )}
      </button>
    </div>
  );
}
