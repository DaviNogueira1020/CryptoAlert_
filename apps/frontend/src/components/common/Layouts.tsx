import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../../config/animations';

// ============================================================================
// LAYOUTS BASE
// ============================================================================

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  withAnimation?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  withAnimation = true,
}) => {
  return (
    <motion.div
      {...(withAnimation && {
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        variants: pageTransitionVariants,
      })}
      className={`w-full min-h-screen bg-black py-12 px-4 sm:px-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  centered = true,
}) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-full',
    full: 'w-full',
  }[maxWidth];

  const centerClass = centered ? 'mx-auto' : '';

  return (
    <div className={`w-full ${maxWidthClass} ${centerClass} ${className}`}>
      {children}
    </div>
  );
};

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  cols = 1,
  gap = 'md',
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }[cols];

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap];

  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'between' | 'around' | 'end';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className = '',
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'md',
}) => {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    end: 'justify-end',
  }[justify];

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[align];

  const gapClass = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }[gap];

  return (
    <div
      className={`flex ${directionClass} ${justifyClass} ${alignClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================================================
// HEADER/FOOTER LAYOUTS
// ============================================================================

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ children, className = '', sticky = false }) => {
  const stickyClass = sticky ? 'sticky top-0 z-40' : '';

  return (
    <header
      className={`${stickyClass} bg-gradient-to-b from-black to-surface border-b border-cyan/20 backdrop-blur-lg ${className}`}
    >
      <Container>{children}</Container>
    </header>
  );
};

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ children, className = '' }) => {
  return (
    <footer className={`bg-surface border-t border-cyan/20 ${className}`}>
      <Container>{children}</Container>
    </footer>
  );
};

// ============================================================================
// SEÇÃO COM TÍTULO
// ============================================================================

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`py-12 sm:py-16 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.section>
  );
};

// ============================================================================
// CARD GRID COM RESPONSIVIDADE
// ============================================================================

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'compact' | 'normal' | 'spacious';
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  className = '',
  variant = 'normal',
}) => {
  const gapClass = {
    compact: 'gap-3',
    normal: 'gap-4 sm:gap-6',
    spacious: 'gap-6 sm:gap-8',
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gapClass} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
    >
      {icon && <div className="text-6xl mb-4 opacity-50">{icon}</div>}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
};

// ============================================================================
// DIVIDER COM TEXTO
// ============================================================================

interface DividerWithTextProps {
  children: React.ReactNode;
  className?: string;
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 my-6 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-cyan/0 to-cyan/50"></div>
      <span className="text-gray-400 text-sm font-medium">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-cyan/0 to-cyan/50"></div>
    </div>
  );
};

// ============================================================================
// STACK (COMPONENTE UTILITÁRIA)
// ============================================================================

interface StackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const VStack: React.FC<StackProps> = ({ children, className = '', spacing = 'md' }) => {
  const spacingClass = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  }[spacing];

  return <div className={`flex flex-col ${spacingClass} ${className}`}>{children}</div>;
};

export const HStack: React.FC<StackProps> = ({ children, className = '', spacing = 'md' }) => {
  const spacingClass = {
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
  }[spacing];

  return <div className={`flex flex-row ${spacingClass} ${className}`}>{children}</div>;
};

export default {
  PageLayout,
  Container,
  Grid,
  Flex,
  Header,
  Footer,
  Section,
  CardGrid,
  EmptyState,
  DividerWithText,
  VStack,
  HStack,
};
