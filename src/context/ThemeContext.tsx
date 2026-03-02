"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Default theme values
export const DEFAULT_THEME = {
    logoUrl: "", // Empty implies using text logo
    bgColor: "#FEF9E7", // Cream background
    textColor: "#1A202C", // Dark slate text
    fontFamily: "sarabun",
    fontSize: 16, // Base font size in px
};

export type ThemeType = typeof DEFAULT_THEME;

interface ThemeContextType {
    theme: ThemeType;
    updateTheme: (newTheme: Partial<ThemeType>) => void;
    saveTheme: () => Promise<void>;
    resetTheme: () => void;
}

const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>(DEFAULT_THEME);

    // Initialize from API and fallback to localStorage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const res = await fetch('/api/settings/theme');
                if (res.ok) {
                    const data = await res.json();
                    if (data.theme) {
                        setTheme({ ...DEFAULT_THEME, ...data.theme });
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch theme from DB:", error);
            }

            // Fallback to local storage
            const savedTheme = localStorage.getItem("siteTheme");
            if (savedTheme) {
                try {
                    setTheme({ ...DEFAULT_THEME, ...JSON.parse(savedTheme) });
                } catch (e) {
                    console.error("Failed to parse saved theme");
                }
            }
        };

        loadTheme();
    }, []);

    // Sync theme changes to CSS Variables and localStorage
    useEffect(() => {
        localStorage.setItem("siteTheme", JSON.stringify(theme));

        const root = document.documentElement;
        root.style.setProperty("--custom-bg-color", theme.bgColor);
        root.style.setProperty("--custom-bg-color-rgb", hexToRgb(theme.bgColor));
        root.style.setProperty("--custom-text-color", theme.textColor);

        // Scale body font size based on the selected base font size
        root.style.setProperty("--custom-font-size", `${theme.fontSize}px`);

        // Handle font family mapping (assuming we have these defined in CSS or loaded via Next.js Google Fonts)
        let fontVar = "var(--font-sarabun)";
        if (theme.fontFamily === "inter") fontVar = "var(--font-inter)";
        else if (theme.fontFamily === "prompt") fontVar = "'Prompt', sans-serif";
        else if (theme.fontFamily === "kanit") fontVar = "'Kanit', sans-serif";

        root.style.setProperty("--custom-font-family", fontVar);
    }, [theme]);

    const updateTheme = (newSettings: Partial<ThemeType>) => {
        setTheme((prev) => ({ ...prev, ...newSettings }));
    };

    const saveTheme = async () => {
        try {
            const res = await fetch('/api/settings/theme', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(theme)
            });
            if (!res.ok) throw new Error('Failed to save theme');
            alert('Theme saved successfully! It is now live for all users.');
        } catch (error) {
            console.error("Error saving theme:", error);
            alert('Failed to save theme to database.');
        }
    };

    const resetTheme = () => {
        setTheme(DEFAULT_THEME);
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, saveTheme, resetTheme }}>
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
