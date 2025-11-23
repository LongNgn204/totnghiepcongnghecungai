import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '',
  variant = 'text',
  animation = 'pulse',
  width,
  height
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700/50';
  const animationClass = animation === 'pulse' ? 'animate-pulse duration-2000' : 'animate-wave'; // Smoother animation
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
      style={style}
    />
  );
};

// Skeleton for Question Card
export const QuestionSkeleton: React.FC = () => {
  return (
    <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 space-y-3 animate-pulse">
      {/* Question number and text */}
      <div className="space-y-2">
        <Skeleton width="30%" height="20px" className="rounded" />
        <Skeleton width="90%" height="16px" className="rounded" />
        <Skeleton width="85%" height="16px" className="rounded" />
      </div>
      
      {/* Options */}
      <div className="space-y-2 ml-4">
        <Skeleton width="70%" height="14px" className="rounded" />
        <Skeleton width="75%" height="14px" className="rounded" />
        <Skeleton width="65%" height="14px" className="rounded" />
        <Skeleton width="80%" height="14px" className="rounded" />
      </div>
      
      {/* Metadata */}
      <Skeleton width="50%" height="12px" className="rounded" />
    </div>
  );
};

// Skeleton for Exam Content
export const ExamSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-8 animate-pulse border border-gray-100 dark:border-gray-700">
      {/* Exam Header Card */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-6 text-center space-y-3">
        <Skeleton width="70%" height="32px" className="mx-auto rounded-lg" />
        <div className="flex justify-center gap-4 mt-2">
           <Skeleton width="100px" height="20px" className="rounded-full" />
           <Skeleton width="100px" height="20px" className="rounded-full" />
        </div>
      </div>
      
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Skeleton width="30px" height="30px" variant="circular" />
        <Skeleton width="40%" height="24px" className="rounded-lg" />
      </div>
      
      {/* Questions */}
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
             <QuestionSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for Chat Message
export const ChatMessageSkeleton: React.FC = () => {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      {/* Avatar */}
      <Skeleton variant="circular" width="40px" height="40px" />
      
      {/* Message content */}
      <div className="flex-1 space-y-2">
        <Skeleton width="30%" height="16px" className="rounded" />
        <Skeleton width="90%" height="14px" className="rounded" />
        <Skeleton width="85%" height="14px" className="rounded" />
        <Skeleton width="70%" height="14px" className="rounded" />
      </div>
    </div>
  );
};

// Skeleton for Statistics Card
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-3 animate-pulse">
      <Skeleton width="60%" height="20px" className="rounded" />
      <Skeleton width="40%" height="32px" className="rounded" />
      <Skeleton width="80%" height="14px" className="rounded" />
    </div>
  );
};

export default Skeleton;