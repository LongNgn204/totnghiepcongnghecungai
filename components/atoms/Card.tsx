import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, interactive = false, noPadding = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${interactive ? 'card-interactive' : 'card'}
          ${noPadding ? 'p-0' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

