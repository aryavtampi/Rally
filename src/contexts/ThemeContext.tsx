import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ThemeMode } from '../types';

export interface ThemeColors {
  bgPrimary: string;
  bgCard: string;
  bgGlass: string;
  bgGlassHeavy: string;
  bgGlassModal: string;
  borderGlass: string;
  borderGlassOuter: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderLight: string;
  inputBg: string;
  inputBorder: string;
  border: string;
  divider: string;
  shadowCard: string;
  shadowRaised: string;
  shadowFloating: string;
  shadowNav: string;
  accentGlow: string;
}

const LIGHT_COLORS: ThemeColors = {
  bgPrimary: 'linear-gradient(180deg, #F3F0FF 0%, #FFFFFF 100%)',
  bgCard: 'rgba(255, 255, 255, 0.60)',
  bgGlass: 'rgba(255, 255, 255, 0.55)',
  bgGlassHeavy: 'rgba(255, 255, 255, 0.72)',
  bgGlassModal: 'rgba(248, 248, 255, 0.88)',
  borderGlass: 'rgba(255, 255, 255, 0.70)',
  borderGlassOuter: 'rgba(255, 255, 255, 0.28)',
  textPrimary: '#1A1B2E',
  textSecondary: '#4A4B6A',
  textMuted: '#8A8BAA',
  borderLight: 'rgba(255, 255, 255, 0.50)',
  inputBg: 'rgba(255, 255, 255, 0.45)',
  inputBorder: 'rgba(255, 255, 255, 0.60)',
  border: 'rgba(255, 255, 255, 0.45)',
  divider: 'rgba(100, 90, 200, 0.08)',
  shadowCard: '0 1px 0 rgba(255,255,255,0.80) inset, 0 -0.5px 0 rgba(0,0,0,0.06) inset, 0 4px 24px rgba(100,80,200,0.10), 0 1px 3px rgba(0,0,0,0.06)',
  shadowRaised: '0 1px 0 rgba(255,255,255,0.80) inset, 0 -0.5px 0 rgba(0,0,0,0.08) inset, 0 12px 40px rgba(80,60,180,0.18), 0 4px 12px rgba(0,0,0,0.10)',
  shadowFloating: '0 1px 0 rgba(255,255,255,0.90) inset, 0 -0.5px 0 rgba(0,0,0,0.10) inset, 0 24px 64px rgba(60,40,160,0.20), 0 8px 24px rgba(0,0,0,0.12)',
  shadowNav: '0 1px 0 rgba(255,255,255,0.80) inset, 0 -1px 0 rgba(255,255,255,0.15) inset, 0 -8px 40px rgba(80,60,200,0.10), 0 -1px 8px rgba(0,0,0,0.06)',
  accentGlow: 'rgba(123, 114, 255, 0.20)',
};

const DARK_COLORS: ThemeColors = {
  bgPrimary: '#0D0E1A',
  bgCard: 'rgba(30, 32, 58, 0.70)',
  bgGlass: 'rgba(30, 32, 58, 0.55)',
  bgGlassHeavy: 'rgba(25, 26, 48, 0.80)',
  bgGlassModal: 'rgba(20, 22, 42, 0.92)',
  borderGlass: 'rgba(255, 255, 255, 0.12)',
  borderGlassOuter: 'rgba(255, 255, 255, 0.06)',
  textPrimary: '#F0F1FF',
  textSecondary: '#A0A1C8',
  textMuted: '#6061A0',
  borderLight: 'rgba(255, 255, 255, 0.10)',
  inputBg: 'rgba(30, 32, 58, 0.60)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.10)',
  divider: 'rgba(255, 255, 255, 0.06)',
  shadowCard: '0 1px 0 rgba(255,255,255,0.08) inset, 0 -0.5px 0 rgba(0,0,0,0.40) inset, 0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.25)',
  shadowRaised: '0 1px 0 rgba(255,255,255,0.10) inset, 0 -0.5px 0 rgba(0,0,0,0.40) inset, 0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.30)',
  shadowFloating: '0 1px 0 rgba(255,255,255,0.12) inset, 0 -0.5px 0 rgba(0,0,0,0.45) inset, 0 24px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.40)',
  shadowNav: '0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.20) inset, 0 -8px 40px rgba(0,0,0,0.40), 0 -1px 8px rgba(0,0,0,0.25)',
  accentGlow: 'rgba(123, 114, 255, 0.35)',
};

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => {},
  isDark: false,
  colors: LIGHT_COLORS,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const toggleTheme = useCallback(() => setMode((m) => (m === 'light' ? 'dark' : 'light')), []);
  const isDark = mode === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-card', colors.bgCard);
    root.style.setProperty('--bg-glass', colors.bgGlass);
    root.style.setProperty('--bg-glass-heavy', colors.bgGlassHeavy);
    root.style.setProperty('--border-glass', colors.borderGlass);
    root.style.setProperty('--border-glass-outer', colors.borderGlassOuter);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--accent-glow', colors.accentGlow);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [colors, isDark]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
