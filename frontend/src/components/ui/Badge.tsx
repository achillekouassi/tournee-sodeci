// src/components/ui/Badge.tsx

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'blue' | 'green' | 'gray' | 'orange' | 'red' | 'yellow' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant, 
  size = 'sm',
  className = '' 
}) => {
  const variants: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded border
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};