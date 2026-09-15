import React from 'react';

interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  label,
  iconBgColor = 'bg-[var(--color-primary-light)]',
  iconColor = 'text-[var(--color-primary)]',
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      className={`
        flex flex-col items-center justify-center
        bg-[var(--color-bg-card)]
        border border-[var(--color-border-light)]
        rounded-xl
        transition-all duration-200
        hover:shadow-[var(--shadow-md)]
        hover:border-[var(--color-primary)]
        cursor-pointer
        ${className}
      `}
      style={{
        padding: 'clamp(1rem, 2vw, 1.5rem)',
        minWidth: 'clamp(80px, 10vw, 120px)',
      }}
    >
      {/* Icon */}
      <div
        className={`
          flex items-center justify-center rounded-xl mb-3
          ${iconBgColor}
        `}
        style={{
          width: 'clamp(2.5rem, 3.5vw, 3.5rem)',
          height: 'clamp(2.5rem, 3.5vw, 3.5rem)',
        }}
      >
        <span className={iconColor}>{icon}</span>
      </div>

      {/* Label */}
      <p className="text-body text-center">{label}</p>
    </button>
  );
};

export default QuickActionCard;
