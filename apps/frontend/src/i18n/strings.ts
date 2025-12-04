export const strings = {
  appName: 'CryptoAlert',
  nav: {
    dashboard: 'Dashboard',
    alerts: 'Alerts',
    settings: 'Settings',
    login: 'Login',
  },
  login: {
    title: 'Sign In',
    email: 'Email',
    password: 'Password',
    remember: 'Remember me',
    submit: 'Sign In',
    or: 'or',
    registerTab: 'Create account',
    signInTab: 'Sign In',
    success: 'Login successful.',
    error: 'Authentication failed. Check your credentials.',
    name: 'Name',
    processing: 'Processing...',
    createAccount: 'Create Account',
    signIn: 'Sign In',
  },
  common: {
    required: 'Field is required.',
    unknownError: 'Something went wrong. Please try again.',
  },
};

// Exporta o tipo após a declaração do objeto
export type Strings = typeof strings;