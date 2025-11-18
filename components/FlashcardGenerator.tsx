import React, { useState } from 'react';

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
    return `Bạn là một giáo viên Công nghệ chuyên nghiệp, chuyên soạn flashcards cho học sinh THPT Việt Nam.

YÊU CẦU QUAN TRỌNG:
- Nội dung PHẢI CHÍNH XÁC 99% theo sách giáo khoa "${data.textbook}" lớp ${data.grade}
- Chủ đề: "${data.topic}"${data.subtopic ? `, chi tiết: "${data.subtopic}"` : ''}
- Mức độ: ${data.difficulty}
- Số lượng: ${data.quantity} flashcards

ĐỊNH DẠNG TRỰC TIẾP JSON (không bao bọc trong markdown):
[
  {
    "front": "Câu hỏi hoặc khái niệm (ngắn gọn, rõ ràng)",
    "back": "Câu trả lời hoặc định nghĩa (chính xác theo SGK)",
    "explanation": "Giải thích bổ sung hoặc ví dụ (nếu cần)"
  }
]

QUY TẮC NỘI DUNG:
1. Front: Câu hỏi ngắn gọn, dễ hiểu (tối đa 20 từ)
2. Back: Câu trả lời chính xác theo SGK (50-100 từ)
3. Explanation: Giải thích thêm hoặc ví dụ thực tế (nếu cần)
4. PHẢI trích dẫn CHÍNH XÁC từ sách "${data.textbook}"
5. Không viết sai chính tả, ngữ pháp
6. Phù hợp với học sinh lớp ${data.grade}

MỨC ĐỘ KHÓ:
${data.difficulty === 'Dễ' ? '- Tập trung vào định nghĩa cơ bản, khái niệm đơn giản\n- Sử dụng ngôn ngữ dễ hiểu' : ''}
${data.difficulty === 'Trung bình' ? '- Kết hợp lý thuyết và ứng dụng\n- Yêu cầu hiểu và phân tích' : ''}
${data.difficulty === 'Khó' ? '- Câu hỏi tổng hợp, phân tích sâu\n- Yêu cầu tư duy logic và so sánh' : ''}

Tạo ngay ${data.quantity} flashcards với JSON format:`;
  };

  const generateFlashcardsWithAI = async (prompt: string): Promise<GeneratedFlashcard[]> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key chưa được cấu hình');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3, // Giảm nhiệt độ để nội dung chính xác hơn
            maxOutputTokens: 4000,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('AI API không phản hồi');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse JSON từ response
    try {
      // Loại bỏ markdown code blocks nếu có
      const jsonText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const flashcards = JSON.parse(jsonText);
      
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
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
          <i className="fas fa-robot text-2xl text-white"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Tạo Flashcards</h2>
          <p className="text-sm text-gray-600">Tạo flashcards tự động từ SGK Công Nghệ</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <i className="fas fa-exclamation-triangle text-red-500 mt-0.5"></i>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Lớp */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-graduation-cap mr-2 text-blue-500"></i>
            Lớp
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-book mr-2 text-green-500"></i>
            Sách giáo khoa
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
            Chủ đề <span className="text-red-500">*</span>
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-tag mr-2 text-purple-500"></i>
            Chi tiết (tùy chọn)
          </label>
          <input
            type="text"
            value={formData.subtopic}
            onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
            placeholder="VD: Cấu trúc lặp, Mạng LAN, Robot tự động..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-list-ol mr-2 text-indigo-500"></i>
            Số lượng flashcards
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-chart-line mr-2 text-orange-500"></i>
            Mức độ
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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-500 mt-1"></i>
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
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Đang tạo flashcards... (có thể mất 10-15s)
          </>
        ) : (
          <>
            <i className="fas fa-magic mr-2"></i>
            Tạo {formData.quantity} Flashcards với AI
          </>
        )}
      </button>
    </div>
  );
}
