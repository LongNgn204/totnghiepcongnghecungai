import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  getStats,
  getAllGoals,
  saveGoal,
  updateGoal,
  deleteGoal,
  getActivityChartData,
  getScoreTrendData,
  StudyGoal,
  StudyStats
} from '../utils/studyProgress';
import Card from './atoms/Card';
import Button from './atoms/Button';
import FormField from './molecules/FormField';
import Modal from './molecules/Modal';
import { Plus, Trash2, Check, Target, BarChart2, TrendingUp, Activity, Clock, BookOpen, Zap } from 'lucide-react';

const Product6: React.FC = () => {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [scoreTrendData, setScoreTrendData] = useState<any[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7);

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    type: 'exam-score' as StudyGoal['type'],
    target: 80,
    deadline: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = () => {
    setStats(getStats());
    setGoals(getAllGoals());
    setActivityData(getActivityChartData(selectedPeriod));
    setScoreTrendData(getScoreTrendData());
  };

  const handleCreateGoal = () => {
    if (!goalForm.title.trim()) return;
    saveGoal({
      title: goalForm.title,
      description: goalForm.description,
      type: goalForm.type,
      target: goalForm.target,
      unit: '%', // Simplified for now
      startDate: new Date().toISOString(),
      endDate: goalForm.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: goalForm.deadline
    });
    loadData();
    setShowCreateGoal(false);
    setGoalForm({ title: '', description: '', type: 'exam-score', target: 80, deadline: '' });
  };

  const handleToggleGoal = (goal: StudyGoal) => {
    updateGoal(goal.id, { completed: !goal.completed });
    loadData();
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
      deleteGoal(id);
      loadData();
    }
  };

  const CHART_COLORS = ['#0ea5e9', '#10b981', '#06b6d4', '#8b5cf6'];

  if (!stats) {
    return <div>Loading...</div>;
  }

  const mainStats = [
    { label: 'Thời gian học', value: `${Math.round(stats.totalStudyTime / 60)}h`, icon: Clock, color: 'text-primary-500' },
    { label: 'Đề đã làm', value: stats.totalExams, icon: BookOpen, color: 'text-accent-green-500' },
    { label: 'Điểm TB', value: `${stats.averageScore.toFixed(1)}%`, icon: Zap, color: 'text-primary-500' },
    { label: 'Chuỗi ngày', value: stats.currentStreak, icon: Activity, color: 'text-accent-red-500' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="text-center">
        <h2 className="text-h3 md:text-h2">Theo Dõi Tiến Độ Học Tập</h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
          Phân tích thống kê, đặt mục tiêu và theo dõi sự tiến bộ của bạn qua các biểu đồ trực quan.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map(stat => (
          <Card key={stat.label} className="text-center">
            <div className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center bg-primary-50 dark:bg-primary-900/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-bold text-text-primary mt-4">{stat.value}</p>
            <p className="text-sm text-text-secondary font-medium">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h5 flex items-center gap-2"><BarChart2 className="text-primary-500" />Hoạt động học tập</h3>
            <div className="flex gap-1 bg-background p-1 rounded-lg border border-border">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedPeriod(days as any)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${selectedPeriod === days ? 'bg-surface shadow-sm text-primary-600' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--color-text-tertiary)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="Thi" name="Thi thử" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chat" name="Hỏi AI" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Flashcard" name="Ôn thẻ" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-h5 mb-4 flex items-center gap-2"><TrendingUp className="text-accent-green-500" />Xu hướng điểm số</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={scoreTrendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="exam" stroke="var(--color-text-tertiary)" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="var(--color-text-tertiary)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="score" name="Điểm số" stroke={CHART_COLORS[1]} fill="url(#colorScore)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h5 flex items-center gap-2"><Target className="text-accent-red-500" />Mục tiêu học tập</h3>
          <Button onClick={() => setShowCreateGoal(true)}><Plus size={16} className="mr-2" />Tạo mục tiêu</Button>
        </div>
        {goals.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-text-secondary">Chưa có mục tiêu nào. Hãy tạo một mục tiêu mới!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <Card key={goal.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-bold text-text-primary ${goal.completed ? 'line-through' : ''}`}>{goal.title}</h4>
                      <p className="text-sm text-text-secondary">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button size="sm" variant="ghost" onClick={() => handleToggleGoal(goal)}><Check size={16} /></Button>
                       <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)}><Trash2 size={16} className="text-accent-red-500" /></Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Tiến độ</span>
                      <span className="font-semibold">{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 border border-border"><div className="bg-primary-500 h-full rounded-full" style={{ width: `${progress}%` }}></div></div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {showCreateGoal && (
        <Modal isOpen title="Tạo mục tiêu mới" onClose={() => setShowCreateGoal(false)}>
          <div className="space-y-4">
            <FormField id="goal-title" label="Tên mục tiêu" required>
              <input type="text" value={goalForm.title} onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} />
            </FormField>
            <FormField id="goal-desc" label="Mô tả">
              <textarea value={goalForm.description} onChange={e => setGoalForm({ ...goalForm, description: e.target.value })} rows={2} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField id="goal-target" label="Mục tiêu (số)">
                <input type="number" value={goalForm.target} onChange={e => setGoalForm({ ...goalForm, target: Number(e.target.value) })} />
              </FormField>
              <FormField id="goal-deadline" label="Deadline">
                <input type="date" value={goalForm.deadline} onChange={e => setGoalForm({ ...goalForm, deadline: e.target.value })} />
              </FormField>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowCreateGoal(false)}>Hủy</Button>
              <Button onClick={handleCreateGoal}>Tạo</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Product6;
