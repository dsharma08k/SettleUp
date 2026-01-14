import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
    return (
        <div
            className={`
        glass-vintage paper-texture rounded-vintage shadow-vintage
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
