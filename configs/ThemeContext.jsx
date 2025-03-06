"use client";

import React, {
  createContext,
  useState,
  useLayoutEffect,
  useContext,
} from "react";

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to light on server

  useLayoutEffect(() => {
    // Load saved theme from localStorage on client
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme || "light");

    // Conditionally set html class based on theme
    if (savedTheme === 'dark') {
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.className = ''; // Or 'light' if you have light-specific class
    }
  }, []);

  useLayoutEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : ''; // Or 'light'
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
