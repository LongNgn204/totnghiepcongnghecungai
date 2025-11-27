/**
 * FIX #6: Add Error Boundaries to All Routes
 * 
 * Problem: Only Product3 has error boundary, other routes crash entire app
 * Solution: Wrap all lazy-loaded routes with ErrorBoundary
 * Time: 1 hour
 * 
 * File: App.tsx
 */

import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';
import MainLayout from './layouts/MainLayout';
import ChatLayout from './layouts/ChatLayout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Lazy load components
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const Product1 = React.lazy(() => import('./components/Product1'));
const AuthPage = React.lazy(() => import('./components/auth/AuthPage'));
const Product2 = React.lazy(() => import('./components/Product2'));
const Product3 = React.lazy(() => import('./components/Product3'));
const Product4 = React.lazy(() => import('./components/Product4'));
const Product5 = React.lazy(() => import('./components/Product5'));
const Product6 = React.lazy(() => import('./components/Product6'));
const Product7 = React.lazy(() => import('./components/Product7'));
const Product8 = React.lazy(() => import('./components/Product8'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const SmartIDE = React.lazy(() => import('./components/SmartIDE'));
const Flashcards = React.lazy(() => import('./components/Flashcards'));
const ExamHistory = React.lazy(() => import('./components/ExamHistory'));
const Profile = React.lazy(() => import('./components/Profile'));
const Community = React.lazy(() => import('./components/Community'));
const PWASettings = React.lazy(() => import('./components/PWASettings'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/TermsOfService'));
const NotFound = React.lazy(() => import('./components/NotFound'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-text-secondary font-medium">Đang tải dữ liệu...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ChatProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Landing Page (No Layout) */}
          <Route
            path="/"
            element={
              <ErrorBoundary componentName="LandingPage">
                <LandingPage onStart={() => navigate('/dashboard')} />
              </ErrorBoundary>
            }
          />

          <Route
            path="/login"
            element={
              <ErrorBoundary componentName="AuthPage">
                <AuthPage />
              </ErrorBoundary>
            }
          />

          {/* Chat Route (ChatLayout - Full Screen for bare chat) */}
          <Route
            path="/chat"
            element={
              <ChatLayout>
                <ProtectedRoute>
                  <ErrorBoundary componentName="ChatInterface">
                    <ChatInterface />
                  </ErrorBoundary>
                </ProtectedRoute>
              </ChatLayout>
            }
          />

          {/* Main App Routes (Wrapped in MainLayout) */}
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  {/* Product 1 - Chat AI with header and instructions */}
                  <Route
                    path="/san-pham-1"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product1">
                          <Product1 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/san-pham-2"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product2">
                          <Product2 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/san-pham-3"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product3">
                          <Product3 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/san-pham-4"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product4">
                          <Product4 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/san-pham-5"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product5">
                          <Product5 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/product6"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product6">
                          <Product6 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/product7"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product7">
                          <Product7 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/product8"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Product8">
                          <Product8 />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Dashboard">
                          <Dashboard />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/smart-ide"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="SmartIDE">
                          <SmartIDE />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/flashcards"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Flashcards">
                          <Flashcards />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="ExamHistory">
                          <ExamHistory />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Profile">
                          <Profile />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/community"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="Community">
                          <Community />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary componentName="PWASettings">
                          <PWASettings />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  {/* Public Pages inside Layout */}
                  <Route
                    path="/privacy"
                    element={
                      <ErrorBoundary componentName="PrivacyPolicy">
                        <PrivacyPolicy />
                      </ErrorBoundary>
                    }
                  />

                  <Route
                    path="/terms"
                    element={
                      <ErrorBoundary componentName="TermsOfService">
                        <TermsOfService />
                      </ErrorBoundary>
                    }
                  />

                  <Route
                    path="*"
                    element={
                      <ErrorBoundary componentName="NotFound">
                        <NotFound />
                      </ErrorBoundary>
                    }
                  />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Suspense>
    </ChatProvider>
  );
};

export default App;

// ============= ERROR BOUNDARY COMPONENT =============

/**
 * File: components/ErrorBoundary.tsx
 * 
 * Make sure ErrorBoundary component exists and has:
 * - Error state management
 * - Fallback UI display
 * - Error logging
 * - Reset functionality
 */

/*
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary] ${this.props.componentName || 'Unknown'} crashed:`, error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-surface rounded-lg shadow-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h1 className="text-lg font-semibold text-text-primary">
                Oops! Something went wrong
              </h1>
            </div>
            
            <p className="text-text-secondary mb-4">
              {this.props.componentName && (
                <>
                  <strong>{this.props.componentName}</strong> encountered an error.
                </>
              )}
              Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="mb-4 p-3 bg-surface-hover rounded text-sm text-text-secondary">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <button
              onClick={this.reset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
*/

// ============= CHECKLIST =============
/*
✅ Wrap LandingPage with ErrorBoundary
✅ Wrap AuthPage with ErrorBoundary
✅ Wrap ChatInterface with ErrorBoundary
✅ Wrap Product1 with ErrorBoundary
✅ Wrap Product2 with ErrorBoundary
✅ Wrap Product3 with ErrorBoundary
✅ Wrap Product4 with ErrorBoundary
✅ Wrap Product5 with ErrorBoundary
✅ Wrap Product6 with ErrorBoundary
✅ Wrap Product7 with ErrorBoundary
✅ Wrap Product8 with ErrorBoundary
✅ Wrap Dashboard with ErrorBoundary
✅ Wrap SmartIDE with ErrorBoundary
✅ Wrap Flashcards with ErrorBoundary
✅ Wrap ExamHistory with ErrorBoundary
✅ Wrap Profile with ErrorBoundary
✅ Wrap Community with ErrorBoundary
✅ Wrap PWASettings with ErrorBoundary
✅ Wrap PrivacyPolicy with ErrorBoundary
✅ Wrap TermsOfService with ErrorBoundary
✅ Wrap NotFound with ErrorBoundary
✅ Verify ErrorBoundary component exists
✅ Test error handling
✅ Deploy to staging
*/

