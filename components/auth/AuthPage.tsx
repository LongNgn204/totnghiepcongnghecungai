import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-48px)] flex items-center justify-center bg-background px-4 py-8">
      <div className="bg-surface rounded-2xl shadow-md border border-border p-6 sm:p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3 gradient-primary text-white font-black text-xl shadow-lg shadow-primary-500/30">
            AI
          </div>
          <h1 className="text-h4">Ôn Thi THPT</h1>
          <p className="text-text-secondary text-sm">Công Nghệ - Cánh Diều / Kết nối tri thức</p>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex gap-2 mb-6 bg-background p-1 rounded-xl border border-border">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              isLogin ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              !isLogin ? 'bg-surface text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField id="username" label="Username hoặc Email" required>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          placeholder="Nhập username hoặc email"
          disabled={loading}
        />
      </FormField>

      <FormField id="password" label="Mật khẩu" required>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="Nhập mật khẩu"
          disabled={loading}
        />
      </FormField>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
            Quên mật khẩu?
          </Link>
        </div>
      </div>

      <Button type="submit" isLoading={loading} isFullWidth>
        Đăng nhập
      </Button>
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
      }, 1200);
    } catch (error: any) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-accent-green-100 text-accent-green-700 flex items-center justify-center mx-auto mb-3">
          ✓
        </div>
        <h3 className="text-h5 mb-1">Đăng ký thành công!</h3>
        <p className="text-text-secondary">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField id="username-reg" label="Username" required hint="Ít nhất 3 ký tự">
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          placeholder="Ít nhất 3 ký tự"
          disabled={loading}
        />
      </FormField>

      <FormField id="email" label="Email" required>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
          disabled={loading}
        />
      </FormField>

      <FormField id="displayName" label="Tên hiển thị" required>
        <input
          type="text"
          value={formData.displayName}
          onChange={e => setFormData({ ...formData, displayName: e.target.value })}
          placeholder="Nguyễn Văn A"
          disabled={loading}
        />
      </FormField>

      <FormField id="password-reg" label="Mật khẩu" required hint="Ít nhất 6 ký tự">
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          disabled={loading}
          minLength={6}
        />
      </FormField>

      <FormField id="confirm" label="Xác nhận mật khẩu" required>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="••••••••"
          disabled={loading}
        />
      </FormField>

      <Button type="submit" isLoading={loading} isFullWidth>
        Đăng ký tài khoản
      </Button>

      <p className="text-center text-sm text-text-secondary mt-2">
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Đăng nhập ngay
        </button>
      </p>
    </form>
  );
}
