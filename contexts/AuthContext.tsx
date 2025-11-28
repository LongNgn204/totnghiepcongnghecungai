// AuthContext.tsx - Handles authentication state and integrates sync pause on 401
import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncManager } from '../utils/syncManager';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: number;
  lastLogin?: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from localStorage to prevent flash of login screen
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user_data');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user:', e);
      return null;
    }
  });
  
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');

      if (storedToken) {
        try {
          const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            const userData = result.data || result;
            setUser(userData);
            localStorage.setItem('user_data', JSON.stringify(userData));
          } else if (response.status === 401) {
            // Token expired or invalid - logout user
            console.warn('Token expired or invalid (Server returned 401)');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('user_id');
            syncManager.pauseSync();
            setUser(null);
            setToken(null);
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            // Redirect to login
            window.location.href = '/login';
          }
          // If other error (500, network), keep the local user state (optimistic)
        } catch (error) {
          console.error('Error verifying token (network/server error):', error);
          // Do NOT logout on network error, keep user logged in offline
        }
      } else {
        // No token found
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const register = async (username: string, email: string, password: string, displayName: string) => {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, displayName }),
    });
    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error || 'Đăng ký thất bại');
      throw new Error(result.error || 'Đăng ký thất bại');
    }
    const data = result.data || result;
    if (!data.user || !data.token) {
      toast.error('Dữ liệu đăng ký không hợp lệ');
      throw new Error('Dữ liệu đăng ký không hợp lệ');
    }
    setUser(data.user);
    setToken(data.token);
    toast.success('Đăng ký thành công!');
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    localStorage.setItem('user_id', data.user.id);
    syncManager.resumeSync();
  };

  const login = async (identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    const payload = isEmail ? { email: identifier, password } : { username: identifier, password };
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error || 'Đăng nhập thất bại');
      throw new Error(result.error || 'Đăng nhập thất bại');
    }
    const data = result.data || result;
    if (!data.user || !data.token) {
      toast.error('Dữ liệu đăng nhập không hợp lệ');
      throw new Error('Dữ liệu đăng nhập không hợp lệ');
    }
    setUser(data.user);
    setToken(data.token);
    toast.success('Đăng nhập thành công!');
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    localStorage.setItem('user_id', data.user.id);
    syncManager.resumeSync();
  };

  const logout = () => {
    if (token) {
      fetch(`${API_URL}/api/users/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Logout error:', err));
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    // Ensure sync is paused after explicit logout
    syncManager.pauseSync();
    toast.success('Đã đăng xuất');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      toast.error(result.error || 'Cập nhật thất bại');
      throw new Error(result.error || 'Cập nhật thất bại');
    }
    setUser(result.user);
    localStorage.setItem('user_data', JSON.stringify(result.user));
    toast.success('Cập nhật thông tin thành công!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
