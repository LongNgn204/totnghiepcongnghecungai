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
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl relative">
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="text-center text-white">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            {mode === 'login' ? <User className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                            {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
                        </h2>
                        <p className="text-blue-100 text-sm">Ôn Thi THPT QG môn Công Nghệ</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => mode !== 'login' && switchMode()}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'login'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Đăng Nhập
                        </button>
                        <button
                            onClick={() => mode !== 'register' && switchMode()}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'register'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Đăng Ký
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Display Name (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Tên hiển thị
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        placeholder="Nguyễn Văn A"
                                        required={mode === 'register'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                    placeholder="student@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {mode === 'register' && (
                                <p className="text-xs text-gray-500 mt-1">Ít nhất 6 ký tự</p>
                            )}
                        </div>

                        {/* Confirm Password (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer select-none">
                                    Giữ đăng nhập (30 ngày)
                                </label>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
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
                        <p className="text-sm text-gray-600">
                            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                            <button
                                onClick={switchMode}
                                className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
                            >
                                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                            </button>
                        </p>
                    </div>

                    {/* Backend Note */}
                    <p className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        Dữ liệu được lưu trữ an toàn trên Cloudflare Workers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
