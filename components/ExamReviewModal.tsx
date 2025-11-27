import React from 'react';
import { ExamHistory } from '../utils/examStorage';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';
import { exportExamToPDF } from '../utils/exportPDF';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Modal from './molecules/Modal';
import Card from './atoms/Card';
import Button from './atoms/Button';
import Badge from './atoms/Badge';

interface ExamReviewModalProps {
  exam: ExamHistory;
  onClose: () => void;
}

const getLevelBadge = (level: QuestionLevel) => {
  switch (level) {
    case QuestionLevel.KNOW: return <Badge tone="success">Biết</Badge>;
    case QuestionLevel.UNDERSTAND: return <Badge tone="warning">Hiểu</Badge>;
    case QuestionLevel.APPLY: return <Badge tone="error">Vận dụng</Badge>;
    default: return <Badge>N/A</Badge>;
  }
};

const ExamReviewModal: React.FC<ExamReviewModalProps> = ({ exam, onClose }) => {
  const mcQuestions = exam.questions.filter((q: any): q is QuestionMC => q.options);
  const tfQuestions = exam.questions.filter((q: any): q is QuestionTF => !q.options);

  const getAnswerStatus = (questionId: number, correctAnswer: any) => {
    const userAnswer = exam.userAnswers[questionId];
    return { isCorrect: userAnswer === correctAnswer, userAnswer, correctAnswer };
  };

  const pieData = [
    { name: 'Đúng', value: exam.score, color: 'hsl(var(--color-accent-green-500))' },
    { name: 'Sai', value: exam.totalQuestions - exam.score, color: 'hsl(var(--color-accent-red-500))' },
  ];

  return (
    <Modal isOpen title="Xem lại đề thi" onClose={onClose} size="xl">
      <div className="space-y-6">
        <Card>
          <h3 className="text-h5">{exam.examTitle}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mt-2">
            <span>Ngày thi: {new Date(exam.createdAt).toLocaleString('vi-VN')}</span>
            <span>Thời gian: {exam.timeSpent} phút</span>
            <span className="font-bold text-lg text-primary-600">Điểm: {exam.score}/{exam.totalQuestions}</span>
              </div>
        </Card>

        <Card>
          <h3 className="text-h6 mb-4">Phân tích kết quả</h3>
          <ResponsiveContainer width="100%" height={200}>
                <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
        </Card>

                  <div>
          <h3 className="text-h6 mb-2">Chi tiết câu trả lời</h3>
          {mcQuestions.map(q => {
                const status = getAnswerStatus(q.id, q.answer);
                return (
              <Card key={q.id} className={`mb-4 border-l-4 ${status.isCorrect ? 'border-accent-green-500' : 'border-accent-red-500'}`}>
                <p className="font-semibold">Câu {q.id}: {q.question}</p>
                <div className="mt-2 space-y-2">
                  {q.options.map((option, idx) => (
                    <div key={idx} className={`p-2 rounded-md border ${status.correctAnswer === option ? 'bg-accent-green-100 border-accent-green-500' : status.userAnswer === option ? 'bg-accent-red-100 border-accent-red-500' : 'bg-surface'}`}>
                      {option}
                      </div>
                  ))}
                    </div>
              </Card>
                        );
                      })}
          {tfQuestions.map(q => {
            // Simplified TF review
            return <Card key={q.id} className="mb-4"><p>Câu {q.id}: {q.question}</p></Card>;
              })}
          </div>

        <div className="text-right">
          <Button onClick={onClose}>Đóng</Button>
                        </div>
                      </div>
    </Modal>
  );
};

export default ExamReviewModal;
