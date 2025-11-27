import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../utils/shareUtils';
import { api } from '../utils/apiClient';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
import Card from './atoms/Card';
import Button from './atoms/Button';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await api.leaderboard.get();
      const entries = Array.isArray(data) ? data : (data.leaderboard || []);
      const mappedEntries = entries.map((e: any) => ({
        userId: e.user_id || e.userId,
        userName: e.name || e.userName,
        points: e.points || 0,
        rank: e.rank || 0,
        badge: e.badge
      }));
      setLeaderboard(mappedEntries);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="text-center">
        <h2 className="text-h3 md:text-h2">Bảng Xếp Hạng</h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
          Cùng nhau thi đua học tập và leo lên top đầu!
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Tất cả</Button>
          <Button variant={filter === 'week' ? 'primary' : 'secondary'} onClick={() => setFilter('week')}>Tuần này</Button>
          <Button variant={filter === 'month' ? 'primary' : 'secondary'} onClick={() => setFilter('month')}>Tháng này</Button>
        </div>
      </Card>

      {leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2nd */}
          <Card className="text-center p-4 pt-8 md:pt-4">
            <Medal size={32} className="mx-auto text-gray-400"/>
            <h3 className="text-h5 font-bold mt-2">{leaderboard[1]?.userName}</h3>
            <p className="text-2xl font-bold text-text-primary">{leaderboard[1]?.points} <span className="text-sm font-normal">điểm</span></p>
          </Card>
          {/* 1st */}
          <Card className="text-center p-6 border-2 border-primary-500">
            <Crown size={40} className="mx-auto text-yellow-400"/>
            <h3 className="text-h4 font-bold mt-2">{leaderboard[0]?.userName}</h3>
            <p className="text-3xl font-bold text-primary-600">{leaderboard[0]?.points} <span className="text-base font-normal">điểm</span></p>
          </Card>
          {/* 3rd */}
          <Card className="text-center p-4 pt-8 md:pt-4">
            <Award size={32} className="mx-auto text-orange-400"/>
            <h3 className="text-h5 font-bold mt-2">{leaderboard[2]?.userName}</h3>
            <p className="text-2xl font-bold text-text-primary">{leaderboard[2]?.points} <span className="text-sm font-normal">điểm</span></p>
          </Card>
        </div>
      )}

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover">
              <tr>
                <th className="p-3">Hạng</th>
                <th className="p-3">Học sinh</th>
                <th className="p-3 text-right">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.userId} className="border-b border-border last:border-b-0">
                  <td className="p-3 font-bold">#{entry.rank}</td>
                  <td className="p-3 font-semibold text-text-primary">{entry.userName}</td>
                  <td className="p-3 text-right font-bold text-primary-600">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
