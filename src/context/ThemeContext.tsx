import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'day';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'mausamsetu_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const root = document.documentElement;
    root.classList.remove('day');
    root.classList.add('dark');
    document.body.style.backgroundColor = '#030712';
    document.body.style.color = '#f1f5f9';
  }, []);

  const toggleTheme = () => {
    // Keep app in dark mode as requested
    setThemeState('dark');
    const root = document.documentElement;
    root.classList.remove('day');
    root.classList.add('dark');
  };

  const setTheme = (_t: Theme) => {
    setThemeState('dark');
    const root = document.documentElement;
    root.classList.remove('day');
    root.classList.add('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
