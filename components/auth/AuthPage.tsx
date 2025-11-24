import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-hover w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-graduation-cap text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Ôn Thi THPT</h1>
          <p className="text-gray-600">Công Nghệ Cánh Diều- Kết nối tri thức</p>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              isLogin
                ? 'bg-white text-primary shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !isLogin
                ? 'bg-white text-primary shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="fas fa-user-plus mr-2"></i>
            Đăng ký
          </button>
        </div>

        {/* Forms */}
        {isLogin ? <LoginForm /> : <RegisterForm setIsLogin={setIsLogin} />}
      </div>
    </div>
  );
}

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      // Error is handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-user mr-2 text-primary"></i>
          Username hoặc Email
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="Nhập username hoặc email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-lock mr-2 text-primary"></i>
          Mật khẩu
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="Nhập mật khẩu"
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link to="/forgot-password" className="text-primary hover:text-primary font-medium">
            <i className="fas fa-question-circle mr-1"></i>
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-primary-hover text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Đang đăng nhập...
          </>
        ) : (
          <>
            <i className="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập
          </>
        )}
      </button>
    </form>
  );
}

function RegisterForm({ setIsLogin }: { setIsLogin: (val: boolean) => void }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.username.length < 3) {
      toast.error('Username phải có ít nhất 3 ký tự');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-4xl text-green-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h3>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-user mr-2 text-primary"></i>
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="Ít nhất 3 ký tự"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-envelope mr-2 text-primary"></i>
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="email@example.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-id-card mr-2 text-primary"></i>
          Tên hiển thị
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={e => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="Nguyễn Văn A"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-lock mr-2 text-primary"></i>
          Mật khẩu
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="Ít nhất 6 ký tự"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <i className="fas fa-check-circle mr-2 text-primary"></i>
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          placeholder="Nhập lại mật khẩu"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Đang đăng ký...
          </>
        ) : (
          <>
            <i className="fas fa-user-plus mr-2"></i>
            Đăng ký tài khoản
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="text-primary hover:text-primary font-semibold"
        >
          Đăng nhập ngay
        </button>
      </p>
    </form>
  );
}
