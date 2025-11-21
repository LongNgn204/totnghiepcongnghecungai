import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log detailed error information
        console.error('=== ERROR BOUNDARY CAUGHT ===');
        console.error('Component:', this.props.componentName || 'Unknown');
        console.error('Error:', error);
        console.error('Error Message:', error.message);
        console.error('Stack:', error.stack);
        console.error('Component Stack:', errorInfo.componentStack);
        console.error('=============================');

        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full border border-red-200">
                        {/* Header */}
                        <div className="flex items-center gap-3 text-red-600 mb-6">
                            <AlertTriangle className="w-8 h-8" />
                            <h1 className="text-2xl font-bold">Component Error</h1>
                        </div>

                        {/* Error Message */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                            <h2 className="font-bold text-red-800 mb-2">Error in: {this.props.componentName}</h2>
                            <p className="text-red-700 font-mono text-sm">
                                {this.state.error?.message || 'Unknown error'}
                            </p>
                        </div>

                        {/* Stack Trace */}
                        {this.state.error?.stack && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                                    Stack Trace (click to expand)
                                </summary>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        {/* Component Stack */}
                        {this.state.errorInfo?.componentStack && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                                    Component Stack (click to expand)
                                </summary>
                                <pre className="bg-gray-900 text-yellow-400 p-4 rounded-lg text-xs overflow-x-auto">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                Go Back
                            </button>
                        </div>

                        {/* Debug Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                <strong>Debugging Tips:</strong>
                                <br />
                                1. Check browser console for full error details
                                <br />
                                2. Look at the stack trace above for the error location
                                <br />
                                3. Check if all required props/dependencies are provided
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
