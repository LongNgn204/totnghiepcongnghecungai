import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load components
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const AuthPage = React.lazy(() => import('./components/auth/AuthPage'));
const Product2 = React.lazy(() => import('./components/Product2'));
const Product3 = React.lazy(() => import('./components/Product3'));
const Product4 = React.lazy(() => import('./components/Product4'));
const Product5 = React.lazy(() => import('./components/Product5'));
const Product6 = React.lazy(() => import('./components/Product6'));
const Product7 = React.lazy(() => import('./components/Product7'));
const Product8 = React.lazy(() => import('./components/Product8'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Flashcards = React.lazy(() => import('./components/Flashcards'));
const Leaderboard = React.lazy(() => import('./components/Leaderboard'));
const ExamHistory = React.lazy(() => import('./components/ExamHistory'));
const Profile = React.lazy(() => import('./components/Profile'));
const PWASettings = React.lazy(() => import('./components/PWASettings'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/TermsOfService'));
const NotFound = React.lazy(() => import('./components/NotFound'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFullScreenPage = location.pathname === '/' || location.pathname === '/login';

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ChatProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Landing Page (No Layout) */}
          <Route path="/" element={<LandingPage onStart={() => navigate('/chat')} />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Main App Routes (Wrapped in MainLayout) */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/chat" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
                <Route path="/san-pham-1" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
                <Route path="/san-pham-2" element={<ProtectedRoute><Product2 /></ProtectedRoute>} />
                <Route path="/san-pham-3" element={
                  <ProtectedRoute>
                    <ErrorBoundary componentName="Product3">
                      <Product3 />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/san-pham-4" element={<ProtectedRoute><Product4 /></ProtectedRoute>} />
                <Route path="/san-pham-5" element={<ProtectedRoute><Product5 /></ProtectedRoute>} />
                <Route path="/product6" element={<ProtectedRoute><Product6 /></ProtectedRoute>} />
                <Route path="/product7" element={<ProtectedRoute><Product7 /></ProtectedRoute>} />
                <Route path="/product8" element={<ProtectedRoute><Product8 /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><ExamHistory /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><PWASettings /></ProtectedRoute>} />

                {/* Public Pages inside Layout */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Suspense>
    </ChatProvider>
  );
};

export default App;
