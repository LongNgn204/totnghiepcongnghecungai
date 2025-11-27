import React, { useState, useEffect } from 'react';
import {
  getStudyGroups,
  createStudyGroup,
  getStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  addGroupMessage,
  StudyGroup,
  GroupMessage,
  getUserProfile,
} from '../utils/shareUtils';
import Card from './atoms/Card';
import Button from './atoms/Button';
import Modal from './molecules/Modal';
import FormField from './molecules/FormField';
import { Users, Plus, LogOut, MessageSquare, User, Calendar } from 'lucide-react';

const Product7: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [user] = useState(getUserProfile());

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = () => setGroups(getStudyGroups());

  const handleCreateGroup = (name: string, description: string, isPublic: boolean) => {
    if (!name.trim()) return;
    createStudyGroup({ name, description, createdBy: user.id, category: 'Công nghệ', isPublic });
    setShowCreateModal(false);
    loadGroups();
  };

  const handleJoinGroup = (groupId: string) => {
    if (joinStudyGroup(groupId)) {
      loadGroups();
      setSelectedGroup(getStudyGroup(groupId));
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    leaveStudyGroup(groupId);
    setSelectedGroup(null);
    loadGroups();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    addGroupMessage(selectedGroup.id, newMessage);
    setNewMessage('');
    setSelectedGroup(getStudyGroup(selectedGroup.id));
  };

  const isUserInGroup = (group: StudyGroup) => group.members.some(m => m.id === user.id);
  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('vi-VN');

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="text-center">
        <h2 className="text-h3 md:text-h2">Nhóm Học Tập</h2>
        <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
          Tạo hoặc tham gia các nhóm để học cùng bạn bè, chia sẻ tài liệu và tiến bộ hơn mỗi ngày.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Button onClick={() => setShowCreateModal(true)} isFullWidth><Plus size={16} className="mr-2" />Tạo nhóm mới</Button>
          <Card>
            <h3 className="text-h5 mb-4">Danh sách nhóm</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {groups.map(group => (
                <Card
                  key={group.id}
                  interactive
                  onClick={() => setSelectedGroup(getStudyGroup(group.id))}
                  className={`p-4 ${selectedGroup?.id === group.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <p className="font-bold text-text-primary">{group.name}</p>
                  <p className="text-sm text-text-secondary line-clamp-2">{group.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                    <span>{group.members.length} thành viên</span>
                    {!isUserInGroup(group) && <Button size="sm" onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id); }}>Tham gia</Button>}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedGroup ? (
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="text-h4">{selectedGroup.name}</h2>
                <p className="text-text-secondary">{selectedGroup.description}</p>
                <div className="flex items-center gap-4 text-sm text-text-secondary mt-2">
                  <span><Users size={14} className="inline mr-1" />{selectedGroup.members.length} thành viên</span>
                  <span><Calendar size={14} className="inline mr-1" />{formatDate(selectedGroup.createdAt)}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedGroup.chat.map(msg => (
                  <div key={msg.id} className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl px-3 py-2 ${msg.userId === user.id ? 'bg-primary-600 text-white' : 'bg-surface-hover'}`}>
                      {msg.userId !== user.id && <p className="text-xs font-bold mb-1">{msg.userName}</p>}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              {isUserInGroup(selectedGroup) && (
                <div className="p-4 border-t border-border flex gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Nhập tin nhắn..." className="input flex-1" />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>Gửi</Button>
                  <Button onClick={() => handleLeaveGroup(selectedGroup.id)} variant="danger">Rời nhóm</Button>
                </div>
              )}
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <div className="text-center text-text-secondary">
                <p className="text-lg font-medium">Chọn một nhóm để xem chi tiết</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateGroup} />}
    </div>
  );
};

function CreateGroupModal({ onClose, onCreate }: { onClose: () => void, onCreate: (name: string, desc: string, isPublic: boolean) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  return (
    <Modal isOpen title="Tạo nhóm học tập mới" onClose={onClose}>
      <div className="space-y-4">
        <FormField id="group-name" label="Tên nhóm" required>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Học nhóm Công nghệ lớp 12" />
        </FormField>
        <FormField id="group-desc" label="Mô tả">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả ngắn về nhóm..." rows={3} />
        </FormField>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is-public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="w-4 h-4 text-primary-600 bg-background border-border rounded focus:ring-primary-500" />
          <label htmlFor="is-public" className="text-sm text-text-secondary">Công khai (Mọi người có thể thấy và tham gia)</label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button onClick={() => onCreate(name, description, isPublic)}>Tạo nhóm</Button>
        </div>
      </div>
    </Modal>
  );
}

export default Product7;
