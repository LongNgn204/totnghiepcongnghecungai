import React, { useEffect, useState } from 'react';
import { Play, Youtube, Shield, Sparkles } from 'lucide-react';
import { knowledgeAPI } from '../utils/apiClient';
import LoadingSpinner from './LoadingSpinner';

interface LearningContextPanelProps {
  grade?: string;
  subject?: string;
  topic?: string;
}

interface Lesson {
  id: string;
  topic: string;
  module: string;
  subject: string;
  grade: string;
  level: string;
  summary?: string;
  tags?: string[];
  thumbnail?: string;
  url: string;
  sourceTitle: string;
  channel?: string;
  reliability?: number;
}

const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const colorMap: Record<string, string> = {
    beginner: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    intermediate: 'bg-amber-50 text-amber-600 border-amber-100',
    advanced: 'bg-purple-50 text-purple-600 border-purple-100',
  };
  const styles = colorMap[level] || colorMap.beginner;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      {level === 'beginner' && 'Cơ bản'}
      {level === 'intermediate' && 'Nâng cao vừa'}
      {level === 'advanced' && 'Chuyên sâu'}
    </span>
  );
};

const LearningContextPanel: React.FC<LearningContextPanelProps> = ({ grade, subject, topic }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await knowledgeAPI.getResources({
          grade,
          subject,
          topic,
          limit: 6,
        });
        setLessons(response.data.lessons || []);
      } catch (err) {
        console.error('Learning context error', err);
        setError('Không thể tải nguồn kiến thức');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [grade, subject, topic]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <LoadingSpinner />
          Đang đồng bộ ngân hàng kiến thức...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-red-100 shadow-lg p-6 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_45px_rgba(15,23,42,0.05)] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Gợi ý từ AI</p>
          <h3 className="text-lg font-bold text-slate-900">Nguồn học tập đáng tin cậy</h3>
        </div>
        <Sparkles className="text-primary" size={20} />
      </div>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <a
            href={lesson.url}
            target="_blank"
            rel="noopener noreferrer"
            key={lesson.id}
            className="flex gap-4 rounded-2xl border border-slate-100 p-3 hover:border-primary/40 hover:shadow-md transition group"
          >
            <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 relative">
              {lesson.thumbnail ? (
                <img src={lesson.thumbnail} alt={lesson.topic} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Youtube size={28} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Play size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">{lesson.subject}</span>
                <span className="text-xs text-slate-400">• Lớp {lesson.grade}</span>
                <LevelBadge level={lesson.level} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{lesson.topic}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{lesson.summary || lesson.sourceTitle}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield size={14} />
                {lesson.channel || 'Nguồn xác thực'}
                {lesson.reliability && <span>· Độ tin cậy {(lesson.reliability * 100).toFixed(1)}%</span>}
              </div>
            </div>
          </a>
        ))}

        {lessons.length === 0 && (
          <div className="text-center text-sm text-slate-500 py-6">
            Chưa có nguồn phù hợp. Hãy chạy trình thu thập hoặc cập nhật bộ lọc.
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningContextPanel;


