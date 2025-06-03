import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export const useDarkMode = () => {
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // Load theme preference from localStorage on mount
    const savedTheme = localStorage.getItem('autocred-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('autocred-theme', newTheme);
  };

  return { theme, toggleTheme };
};