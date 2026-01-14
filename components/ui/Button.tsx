import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
        const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-primary hover:bg-primary-dark text-background shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30',
            secondary: 'bg-surface hover:bg-surface-light text-text border border-border',
            outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-background',
            ghost: 'text-text-muted hover:bg-surface hover:text-text',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
