import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function APITester() {
  const { user } = useAuth();
  const [endpoint, setEndpoint] = useState('/api/auth/login');
  const [method, setMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    email: "test@example.com",
    password: "123456"
  }, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';

  const testEndpoint = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id && { 'X-User-ID': user.id })
        }
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const fullUrl = `${apiUrl}${endpoint}`;
      console.log('Request:', { method, url: fullUrl, headers: options.headers, body: requestBody });

      const res = await fetch(fullUrl, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data
      });

      console.log('Response:', { status: res.status, data });
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    { name: 'Register', method: 'POST', endpoint: '/api/auth/register', body: { email: 'test@example.com', password: '123456', displayName: 'Test User' } },
    { name: 'Login', method: 'POST', endpoint: '/api/auth/login', body: { email: 'test@example.com', password: '123456' } },
    { name: 'Get User', method: 'GET', endpoint: '/api/auth/me', body: null },
    { name: 'Forgot Password', method: 'POST', endpoint: '/api/auth/forgot-password', body: { email: 'test@example.com' } },
    { name: 'Health Check', method: 'GET', endpoint: '/api/health', body: null }
  ];

  const loadQuickTest = (test: typeof quickTests[0]) => {
    setMethod(test.method);
    setEndpoint(test.endpoint);
    setRequestBody(test.body ? JSON.stringify(test.body, null, 2) : '');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 mb-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <i className="fas fa-flask"></i>
          API Tester - Kiểm tra Backend
        </h1>
        <p className="text-white/90">
          Test các API endpoints và xem request/response
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Request */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-paper-plane text-blue-600"></i>
            Request
          </h2>

          {/* Quick Test Buttons */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Tests</label>
            <div className="flex flex-wrap gap-2">
              {quickTests.map((test) => (
                <button
                  key={test.name}
                  onClick={() => loadQuickTest(test)}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {test.name}
                </button>
              ))}
            </div>
          </div>

          {/* API URL */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">API Base URL</label>
            <input
              type="text"
              value={apiUrl}
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-mono text-gray-600"
            />
          </div>

          {/* Method */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Endpoint */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/auth/login"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Request Body */}
          {method !== 'GET' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Request Body (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            </div>
          )}

          {/* User Info */}
          {user && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <i className="fas fa-user mr-2"></i>
                Logged in as: <strong>{user.email}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1 font-mono">
                User ID: {user.id}
              </p>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={testEndpoint}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Send Request
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Response */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-terminal text-green-600"></i>
            Response
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                Error
              </p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
            </div>
          )}

          {response && (
            <div className="space-y-4">
              {/* Status */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`text-lg font-bold ${response.status >= 200 && response.status < 300 ? 'text-green-600' : 'text-red-600'}`}>
                  {response.status} {response.statusText}
                </p>
              </div>

              {/* Headers */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Response Headers</p>
                <div className="p-4 bg-gray-900 rounded-lg overflow-auto max-h-40">
                  <pre className="text-green-400 text-xs font-mono">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Body */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Response Body</p>
                <div className="p-4 bg-gray-900 rounded-lg overflow-auto max-h-96">
                  <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
                  alert('Response copied to clipboard!');
                }}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Response
              </button>
            </div>
          )}

          {!response && !error && (
            <div className="text-center text-gray-400 py-12">
              <i className="fas fa-code text-6xl mb-4"></i>
              <p>Send a request to see the response</p>
            </div>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-book text-purple-600"></i>
          API Documentation
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Authentication Endpoints</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/register</code> - Đăng ký tài khoản mới</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/login</code> - Đăng nhập</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /api/auth/me</code> - Lấy thông tin user hiện tại</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/forgot-password</code> - Gửi mã reset password</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/verify-reset-token</code> - Xác thực mã reset</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth/reset-password</code> - Đặt lại mật khẩu</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Headers Required</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">Content-Type: application/json</code> - Bắt buộc cho tất cả POST/PUT</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded">X-User-ID: [user_id]</code> - Bắt buộc cho protected endpoints (tự động thêm nếu đã login)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
