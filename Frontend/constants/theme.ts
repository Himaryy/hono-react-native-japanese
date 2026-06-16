export const Colors = {
  light: {
    primary: '#D96E28',
    accent: '#6640C4',
    bg: '#FFFFFF',
    surface: '#F8F6F5',
    ink: '#221D17',
    muted: '#87817B',
    tabIconDefault: '#87817B',
    tabIconSelected: '#D96E28',
  },
  dark: {
    primary: '#E57B38',
    accent: '#8B68E8',
    bg: '#1A1A1A',
    surface: '#262120',
    ink: '#F5F2EF',
    muted: '#87817B',
    tabIconDefault: '#87817B',
    tabIconSelected: '#E57B38',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
