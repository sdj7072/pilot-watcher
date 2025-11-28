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
            } catch (e) { /* ignore */ }

            // 2. Check Time (18:00 ~ 06:00 -> Dark Mode)
            const hour = new Date().getHours();
            if (hour >= 18 || hour < 6) {
                return true;
            }
        }
        // 3. Default to Light Mode
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            try { localStorage.setItem('theme', 'dark'); } catch (e) { /* ignore */ }
        } else {
            root.classList.remove('dark');
            try { localStorage.setItem('theme', 'light'); } catch (e) { /* ignore */ }
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        console.log("Toggling theme. Current:", isDarkMode ? "Dark" : "Light");
        setIsDarkMode(!isDarkMode);
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
