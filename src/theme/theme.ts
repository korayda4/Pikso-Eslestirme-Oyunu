export const THEME = {
  colors: {
    // Brand Pastel Palette
    primary: '#8B5CF6',       // Vibrant Pastel Purple
    primaryLight: '#EDE9FE',  // Soft Lilac Tint
    primaryDark: '#6D28D9',
    secondary: '#F97316',     // Sweet Peach Orange
    secondaryLight: '#FFEDD5',
    accent: '#EC4899',        // Bubblegum Pink
    accentLight: '#FCE7F3',
    yellow: '#F59E0B',        // Warm Sun Yellow
    yellowLight: '#FEF3C7',
    mint: '#10B981',          // Fresh Mint Green
    mintLight: '#D1FAE5',
    sky: '#0EA5E9',           // Baby Sky Blue
    skyLight: '#E0F2FE',

    // Feedback
    success: '#10B981',
    successLight: '#DCFCE7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',

    // Backgrounds & Neutrals
    background: '#FAF7F5',    // Warm Cloud Milk White
    surface: '#FFFFFF',
    surfaceSubtle: '#F4EFEA',
    surfaceBorder: '#E7DFD5',
    textMain: '#2D3142',      // Deep Slate Gray (softer than pure black)
    textMuted: '#71788E',
    textLight: '#9EA3B0',

    // Card Overlay
    overlay: 'rgba(26, 26, 36, 0.45)',
  },

  shadows: {
    soft: {
      shadowColor: '#2D3142',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    medium: {
      shadowColor: '#2D3142',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 6,
    },
    bouncyButton: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    xxl: 40,
  },

  typography: {
    titleLarge: {
      fontSize: 32,
      fontWeight: '800' as const,
      letterSpacing: -0.5,
    },
    titleMedium: {
      fontSize: 24,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
    },
    headline: {
      fontSize: 20,
      fontWeight: '700' as const,
    },
    bodyLarge: {
      fontSize: 17,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 15,
      fontWeight: '500' as const,
    },
    caption: {
      fontSize: 13,
      fontWeight: '600' as const,
    },
  },
};
