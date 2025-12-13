export const theme = {
  colors: {
    primary: '#6C5CE7',
    secondary: '#A29BFE',
    background: '#FFFFFF',
    white: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    backgroundDark: '#F5F5F5',
    error: '#FF6B6B',
    success: '#00C853',
    warning: '#FFA726',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as '700',
    },
    h2: {
      fontSize: 28,
      fontWeight: '600' as '600',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as '600',
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as '400',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as '400',
    },
    small: {
      fontSize: 14,
      fontWeight: '400' as '400',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as '400',
    },
  },
};

// Extend colors for compatibility
export const extendedTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    textLight: '#999999',
    borderLight: '#E8E8E8',
  },
};

export type Theme = typeof theme;
