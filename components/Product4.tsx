import React, { useState, useEffect } from 'react';
import { generateContent } from '../utils/geminiAPI';
import { saveExamToHistory, getExamHistory, ExamHistory, deleteExamFromHistory } from '../utils/examStorage';
import syncManager from '../utils/syncManager';
import QuestionCard from './QuestionCard';
import LoadingSpinner from './LoadingSpinner';
import { ExamSkeleton } from './Skeleton';
import CountdownTimer from './CountdownTimer';
import ExamReviewModal from './ExamReviewModal';

interface Question {
  id: number;
  type: 'mc' | 'tf';
  question: string;
  options?: string[];
  answer: string | { a: boolean; b: boolean; c: boolean; d: boolean };
  requirement?: string;
  level?: string;
  grade?: string;
  topic?: string;
}

const Product4: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamHistory | null>(null);
  const [difficulty, setDifficulty] = useState('Khó');

  useEffect(() => {
    if (activeTab === 'history') {
      const history = getExamHistory().filter(e => e.examType === 'agriculture');
      setExamHistory(history);
    }
  }, [activeTab]);

  const generateExam = async () => {
    const prompt = `🎓 Bạn là chuyên gia biên soạn đề thi tốt nghiệp THPT môn Công nghệ - Chuyên đề NÔNG NGHIỆP theo Chương trình GDPT 2018.
Bạn am hiểu sâu sắc tâm lý học sinh và phương pháp kiểm tra đánh giá hiện đại.

📚 **NGUỒN TÀI LIỆU:**
   • Sách Kết nối tri thức với cuộc sống (KNTT)
   • Sách Cánh Diều (CD)
   ➡️ Sử dụng nội dung từ CẢ 2 BỘ SÁCH để tạo đề thi chuẩn!

🔥 **ĐỘ KHÓ:** ${difficulty.toUpperCase()}
${difficulty === 'Dễ' ? '- Tập trung vào kiến thức cơ bản, nhận biết và thông hiểu.\n- Câu hỏi ngắn gọn, rõ ràng.' : ''}
${difficulty === 'Khó' ? '- Tập trung vào vận dụng và thông hiểu.\n- Yêu cầu suy luận và liên kết kiến thức.' : ''}
${difficulty === 'Rất khó' ? '- Tập trung vào vận dụng cao.\n- Các bài toán kỹ thuật phức tạp, tình huống thực tế hóc búa.' : ''}

✍️ **PHONG CÁCH NGÔN NGỮ:**
- **Tự nhiên & Hiện đại:** Tránh văn phong sách vở cứng nhắc. Dùng từ ngữ gợi mở, dễ tiếp thu.
- **Sư phạm:** Câu hỏi giúp học sinh hiểu bản chất vấn đề.

📋 **CẤU TRÚC ĐỀ THI (28 câu - 50 phút):**

**PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (24 câu)**
- Câu 1-8: Công nghệ 10-11 (Bản vẽ, Vật liệu, Máy nông nghiệp...)
- Câu 9-14: TRỒNG TRỌT lớp 12 (Giống, Kỹ thuật canh tác, Phân bón, Tưới tiêu, BVTV...)
- Câu 15-20: CHĂN NUÔI lớp 12 (Giống vật nuôi, Thức ăn, Chuồng trại, Phòng bệnh...)
- Câu 21-24: Tổng hợp 10-11

**PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (4 câu)**
- Câu 25-26: TRỒNG TRỌT (Mỗi câu 4 ý a,b,c,d)
- Câu 27-28: CHĂN NUÔI (Mỗi câu 4 ý a,b,c,d)

📝 **OUTPUT FORMAT (JSON Only):**
\`\`\`json
{
  "examTitle": "ĐỀ THI THỬ TỐT NGHIỆP THPT - CÔNG NGHỆ NÔNG NGHIỆP",
  "questions": [
    {
      "id": 1,
      "type": "mc",
      "question": "Nội dung câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A. ...",
      "requirement": "YCCĐ...",
      "level": "${difficulty === 'Dễ' ? 'Nhận biết' : 'Thông hiểu'}",
      "grade": "10",
      "topic": "..."
    },
    {
      "id": 25,
      "type": "tf",
      "question": "Câu dẫn...",
      "statements": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "answers": { "a": true, "b": false, "c": true, "d": false },
      "explanations": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "requirement": "YCCĐ...",
      "level": "${difficulty === 'Rất khó' ? 'Vận dụng cao' : 'Vận dụng'}",
      "grade": "12",
      "topic": "..."
    }
  ]
}
\`\`\`
⚠️ LƯU Ý: Chỉ trả về JSON thuần, KHÔNG thêm text giải thích!`;

    try {
      setLoading(true);
      setError('');
      setQuestions([]);
      setUserAnswers({});
      setExamTitle('');

      const response = await generateContent(prompt);

      if (!response.success) {
        setError(response.error || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      // Parse JSON
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError('AI chưa trả về đúng định dạng. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      const data = JSON.parse(jsonMatch[0]);
      setExamTitle(data.examTitle || 'ĐỀ THI MÔ PHỎNG NÔNG NGHIỆP');

      // Convert questions
      const parsedQuestions = data.questions.map((q: any) => {
        if (q.type === 'mc') {
          return {
            id: q.id,
            question: q.question,
            options: q.options,
            answer: q.answer,
            requirement: q.requirement,
            level: q.level,
            grade: q.grade,
            topic: q.topic,
            type: 'mc'
          };
        } else {
          return {
            id: q.id,
            question: q.question,
            answer: q.answer,
            requirement: q.requirement,
            level: q.level,
            grade: q.grade,
            topic: q.topic,
            type: 'tf',
            // Format mới với 4 phát biểu a, b, c, d
            statements: q.statements,
            answers: q.answers,
            explanations: q.explanations
          };
        }
      });

      setQuestions(parsedQuestions);
      setStartTime(Date.now());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    // Tính điểm
    let correctCount = 0;
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (q.type === 'mc') {
        if (userAnswer === q.answer) correctCount++;
      } else if (q.type === 'tf') {
        const correctAnswer = q.answer as { a: boolean; b: boolean; c: boolean; d: boolean };
        if (
          userAnswer?.a === correctAnswer.a &&
          userAnswer?.b === correctAnswer.b &&
          userAnswer?.c === correctAnswer.c &&
          userAnswer?.d === correctAnswer.d
        ) {
          correctCount++;
        }
      }
    });

    const score = correctCount;
    const percentage = (score / questions.length) * 100;
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // Lưu vào localStorage
    const examId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    saveExamToHistory({
      id: examId,
      examTitle: examTitle,
      examType: 'agriculture',
      questions: questions,
      userAnswers: userAnswers,
      score: score,
      totalQuestions: questions.length,
      timeSpent: timeSpent,
      percentage: percentage,
      createdAt: new Date().toISOString(),
      isSubmitted: true
    });
    syncManager.syncExams();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    let content = examTitle + '\n\n';

    questions.forEach(q => {
      content += `Câu ${q.id}: ${q.question}\n`;
      if (q.type === 'mc' && q.options) {
        q.options.forEach(opt => content += `${opt}\n`);
      }
      content += `Đáp án: ${typeof q.answer === 'object' ? JSON.stringify(q.answer) : q.answer}\n`;
      content += `YCCĐ: ${q.requirement}\n`;
      content += `Mức độ: ${q.level}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'de-thi-nong-nghiep.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi này không?')) {
      deleteExamFromHistory(id);
      syncManager.syncExams();
      setExamHistory(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white  p-6 rounded-xl shadow-sm border border-blue-100 ">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800  flex items-center justify-center gap-3">
          🌱 Sản Phẩm 4: Tạo Đề Thi THPT - Chuyên Đề Nông Nghiệp
        </h2>
        <p className="text-center text-gray-600 ">
          Đề thi chuẩn tốt nghiệp THPT Quốc Gia - 28 câu (24 TN + 4 Đ/S), 50 phút
        </p>
        <p className="text-center text-blue-600  text-sm mt-2 flex items-center justify-center gap-2">
          ℹ️ Công cụ hỗ trợ học tập - Nội dung mang tính tham khảo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white  rounded-lg shadow-sm p-2 border border-gray-200 ">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'create'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600  hover:bg-gray-50 :bg-slate-800'
            }`}
        >
          ✨ Tạo đề mới
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'history'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600  hover:bg-gray-50 :bg-slate-800'
            }`}
        >
          📜 Lịch sử thi ({examHistory.length})
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <>
          {/* Form tạo đề */}
          {!loading && questions.length === 0 && (
            <div className="bg-white  p-6 rounded-xl shadow-sm border border-gray-200 ">
              <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200  flex items-center gap-3 text-gray-800 ">
                ⚙️ Cấu hình đề thi
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-2">
                      Chọn chuyên đề
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50  "
                      disabled
                    >
                      <option>Nông nghiệp (Trồng trọt & Chăn nuôi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700  mb-2">
                      Độ khó
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 bg-white  "
                      disabled={loading}
                    >
                      <option value="Dễ">Dễ (Cơ bản)</option>
                      <option value="Khó">Khó (Vận dụng)</option>
                      <option value="Rất khó">Rất khó (Vận dụng cao)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50  p-4 rounded-lg border border-blue-100 ">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800 ">
                    ℹ️ Cấu trúc đề thi chuẩn THPT:
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700 ">
                    <li className="flex items-center gap-2">✅ <strong>Phần I:</strong> 24 câu trắc nghiệm 4 lựa chọn</li>
                    <li className="ml-6">• Câu 1-8: Công nghệ 10-11 (Bản vẽ, Vật liệu, Máy NN)</li>
                    <li className="ml-6">• Câu 9-14: Trồng trọt lớp 12</li>
                    <li className="ml-6">• Câu 15-20: Chăn nuôi lớp 12</li>
                    <li className="ml-6">• Câu 21-24: Tổng hợp 10-11</li>
                    <li className="flex items-center gap-2">✅ <strong>Phần II:</strong> 4 câu Đúng/Sai (Câu 25-28)</li>
                    <li className="ml-6">• Câu 25-26: Trồng trọt</li>
                    <li className="ml-6">• Câu 27-28: Chăn nuôi</li>
                  </ul>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={generateExam}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Đang thiết lập đề thi {difficulty.toLowerCase()}... (30-60 giây)
                    </>
                  ) : (
                    <>
                      🚀 Tạo đề thi mô phỏng
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              <LoadingSpinner
                size="lg"
                text="Hệ thống đang tạo đề thi..."
                showProgress={true}
                progress={50}
              />
              <ExamSkeleton />
            </div>
          )}

          {/* Countdown Timer */}
          {!loading && questions.length > 0 && !isSubmitted && (
            <CountdownTimer
              initialMinutes={50}
              onTimeUp={() => {
                if (!isSubmitted) {
                  handleSubmit();
                  alert('⏰ Hết giờ! Bài thi đã được tự động nộp.');
                }
              }}
              onWarning={(minutes) => {
                alert(`⚠️ Chỉ còn ${minutes} phút! Hãy chuẩn bị nộp bài.`);
              }}
              autoStart={true}
            />
          )}

          {/* Exam Display */}
          {!loading && questions.length > 0 && (
            <>
              {/* Exam Content */}
              <div className="bg-white  p-6 rounded-xl shadow-sm border border-gray-200 ">
                <div className="text-center mb-6 border-b pb-4 border-gray-200 ">
                  <h3 className="text-2xl font-bold text-gray-800  mb-2">
                    {examTitle}
                  </h3>
                  <p className="text-gray-600  flex items-center justify-center gap-4">
                    <span className="flex items-center gap-2">⏱️ Thời gian làm bài: 50 phút</span>
                    <span className="mx-3">|</span>
                    <span className="flex items-center gap-2">📝 28 câu hỏi (24 TN + 4 Đ/S)</span>
                  </p>
                </div>

                <div className="mb-6 p-4 bg-yellow-50  rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800  mb-1">
                        Công cụ hỗ trợ học tập môn Công nghệ THPT
                      </p>
                      <ul className="text-xs text-yellow-700  space-y-1">
                        <li>• Đề thi được tạo dựa trên SGK <strong>Kết nối tri thức</strong> và <strong>Cánh Diều</strong></li>
                        <li>• Nội dung mang tính tham khảo, hỗ trợ ôn tập và làm quen format đề thi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Part I: Multiple Choice */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 text-blue-600 ">
                    PHẦN I: Trắc nghiệm 4 lựa chọn (Câu 1-24)
                  </h4>
                  <div className="space-y-6">
                    {questions.filter(q => q.type === 'mc').map(q => (
                      <div key={q.id} className="border-l-4 border-blue-500 pl-4">
                        <QuestionCard
                          question={q as any}
                          type="mc"
                          onAnswerChange={handleAnswerChange}
                          userAnswer={userAnswers[q.id]}
                          isSubmitted={isSubmitted}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part II: True/False */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold mb-4 text-green-600 ">
                    PHẦN II: Trắc nghiệm Đúng/Sai (Câu 25-28)
                  </h4>
                  <div className="space-y-6">
                    {questions.filter(q => q.type === 'tf').map(q => (
                      <div key={q.id} className="border-l-4 border-green-500 pl-4">
                        <QuestionCard
                          question={q as any}
                          type="tf"
                          onAnswerChange={handleAnswerChange}
                          userAnswer={userAnswers[q.id]}
                          isSubmitted={isSubmitted}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button and Results */}
                <div className="mt-8 pt-6 border-t border-gray-200 ">
                  {!isSubmitted ? (
                    <div className="flex flex-wrap justify-center gap-4">
                      <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all shadow-md flex items-center gap-2"
                      >
                        ✅ Nộp bài
                      </button>
                      <button
                        onClick={handlePrint}
                        className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                      >
                        🖨️ In đề thi
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white  p-6 rounded-xl shadow-lg border border-gray-200  mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div className="p-4 bg-blue-50  rounded-lg border border-blue-100 ">
                            <div className="text-3xl font-bold text-blue-600 ">
                              {Object.keys(userAnswers).filter(key => {
                                const q = questions.find(q => q.id === parseInt(key));
                                if (!q) return false;
                                if (q.type === 'mc') {
                                  return userAnswers[parseInt(key)] === q.answer;
                                } else {
                                  const correctAnswer = q.answer as { a: boolean; b: boolean; c: boolean; d: boolean };
                                  const userAnswer = userAnswers[parseInt(key)];
                                  return userAnswer?.a === correctAnswer.a &&
                                    userAnswer?.b === correctAnswer.b &&
                                    userAnswer?.c === correctAnswer.c &&
                                    userAnswer?.d === correctAnswer.d;
                                }
                              }).length}/{questions.length}
                            </div>
                            <div className="text-sm text-gray-600 ">Số câu đúng</div>
                          </div>
                          <div className="p-4 bg-green-50  rounded-lg border border-green-100 ">
                            <div className="text-3xl font-bold text-green-600 ">
                              {((Object.keys(userAnswers).filter(key => {
                                const q = questions.find(q => q.id === parseInt(key));
                                if (!q) return false;
                                if (q.type === 'mc') {
                                  return userAnswers[parseInt(key)] === q.answer;
                                } else {
                                  const correctAnswer = q.answer as { a: boolean; b: boolean; c: boolean; d: boolean };
                                  const userAnswer = userAnswers[parseInt(key)];
                                  return userAnswer?.a === correctAnswer.a &&
                                    userAnswer?.b === correctAnswer.b &&
                                    userAnswer?.c === correctAnswer.c &&
                                    userAnswer?.d === correctAnswer.d;
                                }
                              }).length / questions.length) * 10).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600 ">Điểm (thang 10)</div>
                          </div>
                          <div className="p-4 bg-blue-50  rounded-lg border border-blue-100 ">
                            <div className="text-3xl font-bold text-blue-600 ">
                              {startTime ? Math.floor((Date.now() - startTime) / 60000) : 0} phút
                            </div>
                            <div className="text-sm text-gray-600 ">Thời gian làm bài</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setUserAnswers({});
                            setStartTime(Date.now());
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                          🔄 Làm lại
                        </button>
                        <button
                          onClick={() => {
                            setQuestions([]);
                            setUserAnswers({});
                            setIsSubmitted(false);
                            setStartTime(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
                        >
                          ➕ Tạo đề mới
                        </button>
                        <button
                          onClick={handleDownload}
                          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                        >
                          📥 Tải kết quả
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Benefits */}
              {!isSubmitted && (
                <div className="bg-white  p-6 rounded-xl shadow-sm border border-gray-200  mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800  flex items-center gap-2">
                    ℹ️ Lợi ích của đề thi mô phỏng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 mt-1">✅</span>
                      <div>
                        <p className="font-semibold text-gray-800 ">Làm quen format đề thi</p>
                        <p className="text-sm text-gray-600 ">Cấu trúc giống 95% đề thi thật của Bộ GD&ĐT</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-500 mt-1">⏱️</span>
                      <div>
                        <p className="font-semibold text-gray-800 ">Rèn kỹ năng quản lý thời gian</p>
                        <p className="text-sm text-gray-600 ">50 phút cho 24 câu, trung bình 2 phút/câu</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-500 mt-1">📊</span>
                      <div>
                        <p className="font-semibold text-gray-800 ">Ôn tập kiến thức toàn diện</p>
                        <p className="text-sm text-gray-600 ">Bao gồm cả 3 lớp 10, 11, 12 theo SGK KNTT & Cánh Diều</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 mt-1">🏆</span>
                      <div>
                        <p className="font-semibold text-gray-800 ">Đánh giá năng lực thực tế</p>
                        <p className="text-sm text-gray-600 ">Xem kết quả ngay, biết điểm mạnh/yếu để cải thiện</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Overall Statistics */}
          {examHistory.length > 0 && (
            <div className="bg-white  rounded-xl shadow-sm border border-blue-100  p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 ">
                📊 Thống kê tổng quan
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50  rounded-xl p-4 text-center border border-blue-100 ">
                  <div className="text-3xl font-bold text-blue-600 ">{examHistory.length}</div>
                  <div className="text-sm text-gray-600  mt-1">Đề đã làm</div>
                </div>
                <div className="bg-green-50  rounded-xl p-4 text-center border border-green-100 ">
                  <div className="text-3xl font-bold text-green-600 ">
                    {(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600  mt-1">Điểm TB</div>
                </div>
                <div className="bg-purple-50  rounded-xl p-4 text-center border border-purple-100 ">
                  <div className="text-3xl font-bold text-purple-600 ">
                    {Math.max(...examHistory.map(e => e.percentage)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600  mt-1">Cao nhất</div>
                </div>
                <div className="bg-orange-50  rounded-xl p-4 text-center border border-orange-100 ">
                  <div className="text-3xl font-bold text-orange-600 ">
                    {examHistory.reduce((sum, e) => sum + e.timeSpent, 0)}
                  </div>
                  <div className="text-sm text-gray-600  mt-1">Tổng phút</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white  rounded-xl shadow-sm border border-gray-200  p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 ">
              📜 Lịch sử làm bài
            </h3>

            {examHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <span className="text-6xl">📜</span>
                </div>
                <p className="text-gray-600 text-lg">Chưa có lịch sử thi</p>
                <p className="text-gray-500 text-sm mt-2">Tạo và làm đề thi để xem lịch sử tại đây</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center mx-auto gap-2"
                >
                  ✨ Tạo đề thi ngay
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {examHistory.map((exam, idx) => (
                  <div
                    key={exam.id}
                    className="border border-gray-200  rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-300 :border-blue-700 bg-white "
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800  mb-2">{exam.examTitle}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600  mb-3">
                          <span className="flex items-center gap-1">
                            📅 {new Date(exam.createdAt).toLocaleString('vi-VN')}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {exam.timeSpent} phút
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 ">Độ chính xác</span>
                            <span className={`font-bold ${exam.percentage >= 80 ? 'text-green-600' :
                              exam.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {exam.score}/{exam.totalQuestions} ({exam.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200  rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${exam.percentage >= 80 ? 'bg-green-500' :
                                exam.percentage >= 50 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                              style={{ width: `${exam.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => setSelectedExam(exam)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedExam && (
        <ExamReviewModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default Product4;
