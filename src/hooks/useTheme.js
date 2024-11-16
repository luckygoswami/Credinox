import { useEffect, useState, useContext } from 'react';
import UserContext from '../context/UserContext';

const useTheme = () => {
  const { setThemeMode } = useContext(UserContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;

    if (
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
      setThemeMode('dark');
    } else {
      root.classList.remove('dark');
      setThemeMode('light');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
};

export default useTheme;
