import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  progress?: number; // 0-100 for progress bar
  showProgress?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  text = 'Đang xử lý...',
  progress,
  showProgress = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      {/* Spinner */}
      <div className={`${sizeClasses[size]} border-4 border-${color}-200 dark:border-${color}-800 border-t-${color}-600 dark:border-t-${color}-400 rounded-full animate-spin`}></div>
      
      {/* Text */}
      {text && (
        <p className={`${textSizes[size]} text-gray-600 dark:text-gray-400 font-medium animate-pulse`}>
          {text}
        </p>
      )}
      
      {/* Progress Bar */}
      {showProgress && progress !== undefined && (
        <>
          <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            {Math.round(progress)}%
          </p>
        </>
      )}
    </div>
  );
};

export default LoadingSpinner;
