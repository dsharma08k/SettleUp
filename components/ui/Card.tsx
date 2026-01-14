interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'light';
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
    const variantStyles = {
        default: 'bg-surface border-border',
        light: 'bg-surface-light border-border',
    };

    return (
        <div className={`rounded-xl border ${variantStyles[variant]} shadow-lg p-6 ${className}`}>
            {children}
        </div>
    );
}
