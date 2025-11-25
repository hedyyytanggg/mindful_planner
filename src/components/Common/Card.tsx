import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    padding?: 'sm' | 'md' | 'lg';
    elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            padding = 'md',
            elevation = 'md',
            className = '',
            ...props
        },
        ref
    ) => {
        const paddingStyles = {
            sm: 'p-3',
            md: 'p-6',
            lg: 'p-8',
        };

        const elevationStyles = {
            none: 'border border-gray-200',
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
        };

        return (
            <div
                ref={ref}
                className={`
          bg-white rounded-lg
          ${paddingStyles[padding]}
          ${elevationStyles[elevation]}
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
