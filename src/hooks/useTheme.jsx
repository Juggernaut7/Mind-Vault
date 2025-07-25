// src/hooks/useTheme.js
import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';

// Zustand store for theme
const useThemeStore = create((set) => ({
  theme: localStorage.getItem('mindvault_theme') || 'dark', // Default to dark
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mindvault_theme', newTheme);
      return { theme: newTheme };
    }),
}));

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const themeState = useThemeStore();

  useEffect(() => {
    // Apply the 'dark' class to the html element
    const htmlElement = document.documentElement;
    if (themeState.theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [themeState.theme]);

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};