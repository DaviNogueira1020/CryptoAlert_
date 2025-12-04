/**
 * Animações Reutilizáveis com Framer Motion
 * Variantes e presets de animação para toda a aplicação
 */

// ============================================================================
// VARIANTES DE ENTRADA
// ============================================================================

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const rotateInVariants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { opacity: 1, rotate: 0 },
};

// ============================================================================
// VARIANTES DE SAÍDA
// ============================================================================

export const fadeOutVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

export const slideUpExitVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -20 },
};

// ============================================================================
// TRANSIÇÕES PADRÃO
// ============================================================================

export const transitionSpeeds = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
};

export const transitionTiming = {
  easeIn: { ease: 'easeIn' },
  easeOut: { ease: 'easeOut' },
  easeInOut: { ease: 'easeInOut' },
  circIn: { ease: 'circIn' },
  circOut: { ease: 'circOut' },
  backIn: { ease: 'backIn' },
  backOut: { ease: 'backOut' },
};

// ============================================================================
// COMBINAÇÕES PREDEFINIDAS
// ============================================================================

export const animationPresets = {
  pageEnter: {
    initial: 'hidden',
    animate: 'visible',
    variants: slideUpVariants,
    transition: { ...transitionSpeeds.normal, ...transitionTiming.easeOut },
  },

  cardEnter: {
    initial: 'hidden',
    animate: 'visible',
    variants: scaleInVariants,
    transition: { ...transitionSpeeds.normal, ...transitionTiming.easeOut },
  },

  listItem: (delay = 0) => ({
    initial: 'hidden',
    animate: 'visible',
    variants: slideUpVariants,
    transition: { ...transitionSpeeds.normal, delay: delay * 0.05 },
  }),

  buttonHover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },

  buttonTap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },

  hoverLift: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// EFEITOS DE LOOP
// ============================================================================

export const loopEffects = {
  pulse: {
    animate: { opacity: [1, 0.5, 1] },
    transition: { duration: 2, repeat: Infinity },
  },

  float: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },

  rotate: {
    animate: { rotate: 360 },
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },

  shine: {
    animate: { backgroundPosition: ['0% 0%', '100% 100%'] },
    transition: { duration: 3, repeat: Infinity },
  },

  wave: {
    animate: { x: [0, 10, -10, 0] },
    transition: { duration: 1, repeat: Infinity },
  },

  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },

  glow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(0, 184, 212, 0.5)',
        '0 0 40px rgba(0, 184, 212, 0.8)',
        '0 0 20px rgba(0, 184, 212, 0.5)',
      ],
    },
    transition: { duration: 2, repeat: Infinity },
  },
};

// ============================================================================
// STAGGER ANIMATIONS (PARA LISTAS)
// ============================================================================

export const containerVariants = (delay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: 0.3,
    },
  },
});

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// ============================================================================
// EFEITOS DE MODAL
// ============================================================================

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// EFEITOS DE PÁGINA
// ============================================================================

export const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0 },
};

// ============================================================================
// HELPERS PARA USAR
// ============================================================================

export const getDelayVariant = (index: number, baseDelay = 0.05) => {
  return {
    variants: slideUpVariants,
    transition: { duration: 0.3, delay: index * baseDelay },
  };
};

export const getCombinedVariants = (...variants: any[]) => {
  return variants.reduce((acc, variant) => ({ ...acc, ...variant }), {});
};

export default {
  // Entrada
  fadeInVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleInVariants,
  rotateInVariants,

  // Saída
  fadeOutVariants,
  slideUpExitVariants,

  // Transições
  transitionSpeeds,
  transitionTiming,

  // Presets
  animationPresets,

  // Loops
  loopEffects,

  // Stagger
  containerVariants,
  itemVariants,

  // Modais
  modalBackdropVariants,
  modalContentVariants,

  // Página
  pageTransitionVariants,

  // Helpers
  getDelayVariant,
  getCombinedVariants,
};
