import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-all duration-200 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
    secondary: 'bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-border-light)]',
    ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[clamp(0.75rem,0.9vw,0.813rem)]',
    md: 'px-4 py-2 text-[clamp(0.813rem,1vw,0.875rem)]',
    lg: 'px-6 py-3 text-[clamp(0.875rem,1.1vw,1rem)]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      suppressHydrationWarning
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
