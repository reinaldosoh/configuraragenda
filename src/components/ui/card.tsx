import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component for displaying content in a contained area
 */
function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}: CardProps): JSX.Element {
  const baseClasses = 'rounded-lg bg-white shadow-sm';
  
  const variantClasses = {
    default: '',
    bordered: 'border border-gray-200'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
