import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/apiClient';
import {
  History,
  FileText,
  TrendingUp,
  Trophy,
  Clock,
  Factory,
  Tractor,
  Eye,
  Trash2,
  AlertTriangle,
  Filter,
  Calendar,
  CheckCircle,
  Edit
} from 'lucide-react';
import Card from './atoms/Card';
import Button from './atoms/Button';
import Modal from './molecules/Modal';

interface ExamHistoryType { /* ... type definition ... */ }

const ExamHistory: React.FC = () => {
  const [history, setHistory] = useState<ExamHistoryType[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'industrial' | 'agriculture'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => { /* ... logic unchanged ... */ };
  const handleDelete = async (id: string) => { /* ... logic unchanged ... */ };
  const handleClearAll = async () => { /* ... logic unchanged ... */ };

  const filteredHistory = history.filter(exam => filter === 'all' || exam.examType === filter);
  const sortedHistory = [...filteredHistory].sort((a, b) => sortBy === 'date' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : b.percentage - a.percentage);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-accent-green-600';
    if (percentage >= 50) return 'text-accent-yellow-600';
    return 'text-accent-red-600';
  };

  const statItems = stats ? [
    { label: 'Đề đã làm', value: stats.totalExams, icon: FileText, color: 'text-primary-500' },
    { label: 'Điểm TB', value: `${stats.averageScore.toFixed(1)}%`, icon: TrendingUp, color: 'text-accent-green-500' },
    { label: 'Cao nhất', value: `${stats.bestScore.toFixed(1)}%`, icon: Trophy, color: 'text-accent-yellow-500' },
    { label: 'Phút học', value: stats.totalTimeSpent, icon: Clock, color: 'text-primary-500' },
    { label: 'Công nghiệp', value: stats.industrialCount, icon: Factory, color: 'text-indigo-500' },
    { label: 'Nông nghiệp', value: stats.agricultureCount, icon: Tractor, color: 'text-green-500' },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="text-center">
        <h2 className="text-h3 md:text-h2">Lịch Sử Đề Thi</h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
          Xem lại các đề thi đã làm và theo dõi tiến độ học tập của bạn.
        </p>
      </Card>

      {stats && stats.totalExams > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statItems.map(stat => (
            <Card key={stat.label} className="text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Tất cả</Button>
            <Button variant={filter === 'industrial' ? 'primary' : 'secondary'} onClick={() => setFilter('industrial')}>Công nghiệp</Button>
            <Button variant={filter === 'agriculture' ? 'primary' : 'secondary'} onClick={() => setFilter('agriculture')}>Nông nghiệp</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="input">
              <option value="date">Sắp xếp: Mới nhất</option>
              <option value="score">Sắp xếp: Điểm cao nhất</option>
            </select>
            {history.length > 0 && <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}><Trash2 size={16} /> Xóa tất cả</Button>}
          </div>
        </div>
      </Card>

      {sortedHistory.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <h3 className="text-h5">Chưa có đề thi nào</h3>
          <p className="text-text-secondary mt-2">Bắt đầu làm bài để xem lịch sử tại đây.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedHistory.map((exam) => (
            <Card key={exam.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-h6 font-bold truncate">{exam.examTitle}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mt-1">
                    <span><Calendar size={14} className="inline mr-1" />{new Date(exam.createdAt).toLocaleString('vi-VN')}</span>
                    <span><Clock size={14} className="inline mr-1" />{exam.timeSpent} phút</span>
                  </div>
                </div>
                <div className={`text-right ${getScoreColor(exam.percentage)}`}>
                  <div className="text-2xl font-bold">{exam.score}/{exam.totalQuestions}</div>
                  <div className="text-sm font-medium">({exam.percentage.toFixed(1)}%)</div>
                </div>
                <div className="flex gap-2">
                  <Button as={Link} to={`/xem-lai/${exam.id}`}><Eye size={16} /> Xem lại</Button>
                  <Button variant="ghost" onClick={() => handleDelete(exam.id)}><Trash2 size={16} className="text-accent-red-500" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <Modal isOpen title="Xác nhận xóa" onClose={() => setShowDeleteConfirm(false)}>
          <p className="text-text-secondary mb-4">Bạn có chắc muốn xóa toàn bộ lịch sử thi? Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Hủy</Button>
            <Button variant="danger" onClick={handleClearAll}>Xóa tất cả</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExamHistory;
