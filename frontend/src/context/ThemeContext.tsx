import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // 1. Check local storage
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('theme');
                if (saved) return saved === 'dark';
            } catch { /* ignore */ }

            // 2. Check Time (17:30 ~ 07:00 -> Dark Mode)
            const now = new Date();
            const minutes = now.getHours() * 60 + now.getMinutes();
            // 17:30 = 1050 minutes, 07:00 = 420 minutes
            if (minutes >= 1050 || minutes < 420) {
                return true;
            }
        }
        // 3. Default to Light Mode
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (!localStorage.getItem('theme')) {
                setIsDarkMode(mediaQuery.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
        } catch { /* ignore */ }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
