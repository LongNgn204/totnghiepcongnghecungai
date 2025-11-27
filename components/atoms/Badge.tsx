import React from 'react';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: React.ReactNode;
}

const toneClass: Record<BadgeTone, string> = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  success: 'bg-accent-green-100 text-accent-green-700 dark:bg-accent-green-900/30 dark:text-accent-green-300',
  warning: 'bg-accent-yellow-100 text-accent-yellow-800 dark:bg-accent-yellow-900/30 dark:text-accent-yellow-300',
  error: 'bg-accent-red-100 text-accent-red-700 dark:bg-accent-red-900/30 dark:text-accent-red-300',
  info: 'bg-accent-blue-100 text-accent-blue-700 dark:bg-accent-blue-900/30 dark:text-accent-blue-300',
  neutral: 'bg-neutral-200 text-text-primary dark:bg-neutral-700 dark:text-neutral-100',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ tone = 'neutral', className = '', children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`inline-flex items-center px-md py-xs rounded-full text-label font-semibold ${toneClass[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;

