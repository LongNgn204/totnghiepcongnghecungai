import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'register') {
                // Validate
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Mật khẩu xác nhận không khớp');
                }
                if (formData.password.length < 6) {
                    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
                }
                if (!formData.displayName.trim()) {
                    throw new Error('Vui lòng nhập tên hiển thị');
                }

                await register(formData.email, formData.password, formData.displayName);
                setSuccess('Đăng ký thành công!');
                setTimeout(() => {
                    onClose();
                    resetForm();
                    navigate('/dashboard');
                }, 1500);
            } else {
                await login(formData.email, formData.password);
                setSuccess('Đăng nhập thành công!');
                setTimeout(() => {
                    onClose();
                    resetForm();
                    navigate('/dashboard');
                }, 1000);
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            displayName: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess('');
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        resetForm();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl shadow-xl max-w-md w-full animate-scale-in">
                {/* Header */}
                <div className="p-6 rounded-t-2xl relative bg-gradient-to-r from-primary-600 to-accent-purple-600 text-white">
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="absolute top-4 right-4 text-white/90 hover:bg-white/20 rounded-full p-2 transition-all"
                        aria-label="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            {mode === 'login' ? <User className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
                        </div>
                        <h2 className="text-h4 mb-1">
                            {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                        </h2>
                        <p className="text-sm opacity-90">Ôn Thi THPT QG môn Công Nghệ</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6 bg-background p-1 rounded-xl border border-border">
                        <button
                            onClick={() => mode !== 'login' && switchMode()}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'login'
                                ? 'bg-surface text-text-primary shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Đăng Nhập
                        </button>
                        <button
                            onClick={() => mode !== 'register' && switchMode()}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${mode === 'register'
                                ? 'bg-surface text-text-primary shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Đăng Ký
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-accent-red-100/70 border border-accent-red-200 rounded-xl text-accent-red-700 text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-accent-green-100/70 border border-accent-green-200 rounded-xl text-accent-green-700 text-sm flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Display Name (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">
                                    Tên hiển thị
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="input pl-10 bg-background"
                                        placeholder="Nguyễn Văn A"
                                        required={mode === 'register'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input pl-10 bg-background"
                                    placeholder="student@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-text-primary mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input pl-10 bg-background"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {mode === 'register' && (
                                <p className="text-xs text-text-tertiary mt-1">Ít nhất 6 ký tự</p>
                            )}
                        </div>

                        {/* Confirm Password (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-bold text-text-primary mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="input pl-10 bg-background"
                                        placeholder="••••••••"
                                        required={mode === 'register'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Remember Me - Login only */}
                        {mode === 'login' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    defaultChecked={true}
                                    className="w-4 h-4 text-primary-600 bg-background border-border rounded focus:ring-primary-500 focus:ring-2"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-text-secondary cursor-pointer select-none">
                                    Giữ đăng nhập (30 ngày)
                                </label>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full gradient-primary text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {mode === 'login' ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                    {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Note */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-text-secondary">
                            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                            <button
                                onClick={switchMode}
                                className="text-primary-600 font-bold hover:text-primary-700 hover:underline"
                            >
                                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                            </button>
                        </p>
                    </div>

                    <p className="text-center text-xs text-text-tertiary mt-4 pt-4 border-t border-border">
                        Dữ liệu được lưu trữ an toàn trên Cloudflare Workers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
