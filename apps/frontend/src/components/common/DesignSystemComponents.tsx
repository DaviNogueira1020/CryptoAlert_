import React from 'react';
import { motion } from 'framer-motion';
import { BUTTON_STYLES, combineClasses } from '../../config/design.system';

// ============================================================================
// BOTÕES
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    rounded = 'md',
    isLoading = false,
    icon,
    children,
    className,
    disabled,
    ...props
  }, ref) => {
    const baseClass = BUTTON_STYLES.base;
    const sizeClass = BUTTON_STYLES.sizes[size];
    const variantClass = BUTTON_STYLES.variants[variant];
    const roundedClass = BUTTON_STYLES.rounded[rounded];

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={combineClasses(baseClass, sizeClass, variantClass, roundedClass, className)}
        disabled={disabled || isLoading}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {isLoading ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// CARDS
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'neon' | 'solid';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default', 
  hoverable, 
  className = '', 
  children, 
  ...props 
}) => {
  const base = 'rounded-2xl p-5 relative z-10';
  const hoverClass = hoverable ? 'transition-all duration-300' : '';
  const variants: Record<string, string> = {
    // Use solid backgrounds to avoid unwanted transparency/backdrop bleed
    default: 'bg-[#0B0F14] border border-gray-700',
    neon: 'bg-[#0A0E27] border border-[#00B8D4]/50',
    solid: 'bg-[#0B0F14] border border-slate-700',
  };

  return (
    <div 
      className={`${base} ${variants[variant] ?? variants.default} ${hoverClass} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';

// ============================================================================
// BADGES
// ============================================================================

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const variantClass = `bg-${variant}/20 text-${variant} border border-${variant}/50`;

    return (
      <span
        ref={ref}
        className={combineClasses(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
          variantClass,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================================================
// INPUTS
// ============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, icon, className, ...props }, ref) => {
    const errorClass = error ? 'border-red-500 focus:ring-red-500/50' : '';
    const successClass = success ? 'border-green-500 focus:ring-green-500/50' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</span>}
          <input
            ref={ref}
            className={combineClasses(
              'w-full px-4 py-2.5 rounded-lg bg-surface border border-cyan/30',
              'text-white placeholder-text-tertiary',
              'focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/50',
              'transition-all duration-200',
              icon ? 'pl-10' : '',
              errorClass,
              successClass,
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-1">✓ Validado</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// LOADER
// ============================================================================

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'white';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', color = 'cyan' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  const colorClass = {
    cyan: 'text-cyan',
    purple: 'text-purple',
    white: 'text-white',
  }[color];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClass} ${colorClass} border-2 border-current border-t-transparent rounded-full`}
    />
  );
};

// ============================================================================
// GLASSMORPHISM CONTAINER
// ============================================================================

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg';
}

export const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ blur = 'md', className, children, ...props }, ref) => {
    const blurClass = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    }[blur];

    return (
      <div
        ref={ref}
        className={combineClasses(
          blurClass,
          'bg-surface/80 border border-white/10 rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

// ============================================================================
// GRADIENT TEXT
// ============================================================================

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  gradient?: 'primary' | 'neon';
}

export const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ gradient = 'primary', className, children, ...props }, ref) => {
    const gradientClass = {
      primary: 'bg-gradient-to-r from-cyan to-purple',
      neon: 'bg-gradient-to-r from-cyan via-purple to-cyan',
    }[gradient];

    return (
      <span
        ref={ref}
        className={combineClasses(gradientClass, 'bg-clip-text text-transparent', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

GradientText.displayName = 'GradientText';

// ============================================================================
// ANIMATED DIVIDER
// ============================================================================

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  animate?: boolean;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ direction = 'horizontal', animate = true, className, ...props }, ref) => {
    const isHorizontal = direction === 'horizontal';

    return animate ? (
      <motion.div
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className={combineClasses(
          isHorizontal ? 'h-px w-full bg-gradient-to-r' : 'w-px h-full bg-gradient-to-b',
          'from-cyan/0 via-cyan to-cyan/0',
          className
        )}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      />
    ) : (
      <div
        ref={ref}
        className={combineClasses(
          isHorizontal ? 'h-px w-full' : 'w-px h-full',
          'bg-cyan/30',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

// ============================================================================
// TOOLTIP
// ============================================================================

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, position = 'top', children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClass = {
      top: '-top-12 left-1/2 transform -translate-x-1/2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    }[position];

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        {...props}
      >
        {children}
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute ${positionClass} bg-surface border border-cyan/50 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-40`}
          >
            {content}
          </motion.div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
