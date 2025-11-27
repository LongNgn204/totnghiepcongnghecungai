import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

type Mode = 'request' | 'reset';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('request');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await res.json();
      if (!res.ok || result?.success === false) {
        throw new Error(result?.error || 'Không thể gửi mã xác thực');
      }
      setMessage(result?.data?.message || 'Mã xác thực đã được gửi đến email (hoặc hiển thị ở dev mode).');
      setMode('reset');
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: code, newPassword })
      });
      const result = await res.json();
      if (!res.ok || result?.success === false) {
        throw new Error(result?.error || 'Không thể đổi mật khẩu');
      }
      setMessage(result?.data?.message || 'Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-primary to-primary-hover rounded-full p-3 mb-4">
              <i className="fas fa-key text-3xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu</h2>
            <p className="text-gray-600">
              {mode === 'request' ? 'Nhập email để nhận mã xác thực' : 'Nhập mã xác thực và mật khẩu mới'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <i className="fas fa-exclamation-circle text-red-500 mt-0.5 flex-shrink-0"></i>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <i className="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {mode === 'request' ? (
            <form onSubmit={handleRequestCode} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-envelope text-primary"></i>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="email@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang gửi mã...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Gửi mã xác thực
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-envelope text-primary"></i>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="email@example.com"
                  required
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-shield-alt text-indigo-500"></i>
                  Mã xác thực
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all tracking-widest"
                  placeholder="Nhập mã 6 chữ số"
                  minLength={4}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-lock text-pink-500"></i>
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Ít nhất 8 ký tự, có số & chữ"
                  minLength={8}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-lock text-orange-500"></i>
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Nhập lại mật khẩu mới"
                  minLength={8}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>
                    Đổi mật khẩu ngay
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary underline"
                  onClick={() => setMode('request')}
                >
                  Gửi lại mã?
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary font-semibold text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <i className="fas fa-arrow-left"></i>
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
