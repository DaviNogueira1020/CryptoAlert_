/**
 * Design System Centralizado
 * Paleta de cores, tipografia, sombras, animações e temas
 */

// ============================================================================
// CORES
// ============================================================================
export const COLORS = {
  // Base
  black: '#000000',
  white: '#FFFFFF',

  // Primárias
  cyan: '#00B8D4',
  cyanDark: '#0099AA',
  cyanLight: '#33C9E0',

  purple: '#5B52FF',
  purpleDark: '#4642CC',
  purpleLight: '#7C70FF',

  // Fundos
  background: '#000000',
  surface: '#0A0E27',
  surfaceLight: '#151A3B',
  surfaceDark: '#050812',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Texto
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    inverse: '#000000',
  },

  // Gradientes
  gradient: {
    primary: 'linear-gradient(135deg, #00B8D4 0%, #5B52FF 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    neon: 'linear-gradient(45deg, #00B8D4 0%, #5B52FF 50%, #00B8D4 100%)',
  },
};

// ============================================================================
// TIPOGRAFIA
// ============================================================================
export const TYPOGRAPHY = {
  // Fontes
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "Monaco", monospace',
  },

  // Tamanhos
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  // Pesos
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Alturas de linha
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================================================
// SOMBRAS
// ============================================================================
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Sombras coloridas (Neon)
  neon: {
    cyan: '0 0 20px rgba(0, 184, 212, 0.5)',
    purple: '0 0 20px rgba(91, 82, 255, 0.5)',
    success: '0 0 20px rgba(16, 185, 129, 0.5)',
    danger: '0 0 20px rgba(239, 68, 68, 0.5)',
  },

  // Sombras internas
  inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// ============================================================================
// ESPAÇAMENTO
// ============================================================================
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '6rem',    // 96px
};

// ============================================================================
// BORDAS
// ============================================================================
export const BORDERS = {
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  width: {
    none: '0',
    thin: '1px',
    base: '2px',
    thick: '4px',
  },
};

// ============================================================================
// Z-INDEX
// ============================================================================
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  backdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// ============================================================================
// TRANSIÇÕES E ANIMAÇÕES
// ============================================================================
export const TRANSITIONS = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  timing: {
    linear: 'linear',
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom easing
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// ============================================================================
// COMPONENTES - BOTÕES
// ============================================================================
export const BUTTON_STYLES = {
  base: `
    relative inline-flex items-center justify-center
    font-semibold transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },

  variants: {
    primary: `
      bg-gradient-to-r from-cyan to-purple
      text-white hover:shadow-lg
      shadow-lg shadow-purple/40
      hover:from-cyanDark hover:to-purpleDark
    `,

    secondary: `
      bg-surface border border-cyan/50
      text-cyan hover:border-cyan hover:bg-surface
      hover:shadow-neon
    `,

    ghost: `
      text-white hover:bg-surface/50
      border border-transparent hover:border-cyan/30
    `,

    danger: `
      bg-danger/10 border border-danger/50
      text-danger hover:bg-danger/20
      hover:border-danger
    `,
  },

  rounded: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  },
};

// ============================================================================
// COMPONENTES - CARDS
// ============================================================================
export const CARD_STYLES = {
  base: `
    relative bg-surface border border-cyan/20
    rounded-lg overflow-hidden
    transition-all duration-300
    hover:border-cyan/50 hover:shadow-lg
    hover:shadow-cyan/20
  `,

  backdrop: `
    backdrop-blur-xl bg-surface/80
    border border-white/10
  `,

  neon: `
    relative border-2 border-transparent
    bg-clip-padding
    before:absolute before:inset-0 before:bg-gradient-to-r
    before:from-cyan before:to-purple before:rounded-lg
    before:-z-10 before:blur-lg
  `,
};

// ============================================================================
// COMPONENTES - INPUTS
// ============================================================================
export const INPUT_STYLES = {
  base: `
    w-full px-4 py-2.5 rounded-lg
    bg-surface border border-cyan/30
    text-white placeholder-text-tertiary
    focus:outline-none focus:border-cyan focus:ring-2
    focus:ring-cyan/50 transition-all duration-200
  `,

  error: `
    border-danger focus:border-danger focus:ring-danger/50
  `,

  success: `
    border-success focus:border-success focus:ring-success/50
  `,
};

// ============================================================================
// COMPONENTES - BADGES
// ============================================================================
export const BADGE_STYLES = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',

  variants: {
    primary: 'bg-purple/20 text-purple border border-purple/50',
    success: 'bg-success/20 text-success border border-success/50',
    warning: 'bg-warning/20 text-warning border border-warning/50',
    danger: 'bg-danger/20 text-danger border border-danger/50',
    info: 'bg-info/20 text-info border border-info/50',
  },
};

// ============================================================================
// BREAKPOINTS
// ============================================================================
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// HELPERS
// ============================================================================
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Converte hex para rgb com opacity
  if (!color.startsWith('#')) return color;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const combineClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default {
  COLORS,
  TYPOGRAPHY,
  SHADOWS,
  SPACING,
  BORDERS,
  Z_INDEX,
  TRANSITIONS,
  BUTTON_STYLES,
  CARD_STYLES,
  INPUT_STYLES,
  BADGE_STYLES,
  BREAKPOINTS,
  getColorWithOpacity,
  combineClasses,
};
