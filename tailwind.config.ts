import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    light: "#F9E4B7", // Softer gold for backgrounds
                    DEFAULT: "#D4AF37", // Classic gold
                    dark: "#AA8C2C", // Darker gold for text/borders
                    hover: "#C5A028",
                },
                cream: {
                    light: "#FFFCF0", // Very light cream
                    DEFAULT: "#FEF9E7", // Lemon cream (User requested)
                    dark: "#F0E6C0",
                    accent: "#FFFACD", // Lemon Chiffon
                },
                white: {
                    DEFAULT: "#FFFFFF",
                    off: "#FAFAFA",
                },
                spiritual: {
                    light: "#F3E5F5", // Very pale purple
                    DEFAULT: "#9C27B0", // Deep purple for spirituality accents
                    dark: "#7B1FA2",
                },
            },
            fontFamily: {
                sarabun: ["var(--font-sarabun)", "sans-serif"],
                inter: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gold-gradient": "linear-gradient(to right, #B8860B, #D4AF37, #F7E0A0)",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "float-delayed": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                shimmer: "shimmer 2s linear infinite",
                "fade-in-up": "fade-in-up 0.8s ease-out forwards",
                float: "float 6s ease-in-out infinite",
                "float-delayed": "float 6s ease-in-out infinite 3s",
            },
        },
    },
    plugins: [],
};
export default config;
