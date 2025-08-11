import { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context
const ButtonContext = createContext();

// 2. Create a custom hook for components to easily access the context.
// Any component that needs button OR theme state can use this.
export function useButtons() {
  return useContext(ButtonContext);
}

// 3. Create the Provider component
export function ButtonProvider({ children }) {
  // --- Original state for tracking the active button ---
  const [activeButton, setActiveButton] = useState('home');

  // --- MERGED: State and logic for theme switching ---
  const [theme, setTheme] = useState(() => {
    // Check for a saved theme in localStorage first
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // If no saved theme, check the user's OS/browser preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // This effect applies the theme to the root <html> element whenever it changes
  useEffect(() => {
    const root = window.document.documentElement;
    // This attribute is used by your index.css file to apply the correct colors
    root.setAttribute('data-theme', theme);
    // Save the user's preference for their next visit
    localStorage.setItem('theme', theme);
  }, [theme]);

  // The function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- Combine ALL state and functions into the value object ---
  const value = {
    activeButton,
    setActiveButton,
    theme,
    toggleTheme,
  };

  return (
    <ButtonContext.Provider value={value}>
      {children}
    </ButtonContext.Provider>
  );
}
