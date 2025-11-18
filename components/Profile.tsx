import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Cập nhật thành công!');
      setIsEditing(false);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        
        {/* Profile content */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-20 mb-6">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&size=160&background=random`}
              alt={user.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
            />
          </div>

          {message && (
            <div className={`mb-4 px-4 py-3 rounded-lg ${message.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {!isEditing ? (
            <div>
              {/* Display mode */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.displayName}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-envelope"></i>
                    {user.email}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    <i className="fas fa-user"></i> @{user.username}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Chỉnh sửa
                </button>
              </div>

              {user.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                    Giới thiệu
                  </h3>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <i className="fas fa-calendar text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Tham gia</p>
                      <p className="text-lg font-bold text-blue-800">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <i className="fas fa-clock text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">Lần cuối</p>
                      <p className="text-lg font-bold text-purple-800">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <i className="fas fa-check-circle text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Trạng thái</p>
                      <p className="text-lg font-bold text-green-800">Hoạt động</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Edit mode */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Viết vài dòng về bản thân..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        displayName: user.displayName,
                        bio: user.bio || ''
                      });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
