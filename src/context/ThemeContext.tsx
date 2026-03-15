'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeConfig } from '@/types';

const defaultTheme: ThemeConfig = {
  primaryColor: '#1e3a5f',
  secondaryColor: '#c49a2a',
  accentColor: '#e8731a',
  headerStyle: 'default',
  footerStyle: 'default',
  fontFamily: 'Prompt',
  logoPosition: 'left',
  navStyle: 'mega-menu',
};

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig> | null;
}) {
  const [theme, setTheme] = useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
  });

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--primary-light', lightenColor(theme.primaryColor, 20));
    root.style.setProperty('--primary-dark', darkenColor(theme.primaryColor, 15));
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--secondary-light', lightenColor(theme.secondaryColor, 15));
    root.style.setProperty('--secondary-dark', darkenColor(theme.secondaryColor, 15));
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--accent-light', lightenColor(theme.accentColor, 15));
    root.style.setProperty('--accent-dark', darkenColor(theme.accentColor, 15));

    root.style.fontFamily = `'${theme.fontFamily}', sans-serif`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility: lighten a hex color
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Utility: darken a hex color
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export default ThemeContext;
