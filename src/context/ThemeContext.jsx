import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('bk_theme_mode') || 'system';
  });

  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    localStorage.setItem('bk_theme_mode', themeMode);

    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let computed = 'dark';
    if (themeMode === 'light') {
      computed = 'light';
    } else if (themeMode === 'dark') {
      computed = 'dark';
    } else {
      computed = systemDark ? 'dark' : 'light';
    }

    setActiveTheme(computed);
    if (computed === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
