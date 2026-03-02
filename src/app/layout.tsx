import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ReferralTracker from "./components/ReferralTracker";
import ThemeCustomizer from "./components/ThemeCustomizer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sarabun = Sarabun({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["thai", "latin"],
    variable: "--font-sarabun",
});

export const metadata: Metadata = {
    title: "Iucrative - Auspicious Wallpapers",
    description: "Enhance your luck with premium designed wallpapers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {/* The inline style here sets up the CSS variables used by tailwind below. ThemeProvider overrides this dynamically */}
            <body className={`${inter.variable} ${sarabun.variable} bg-var-bg text-var-text font-var-sans text-var-base transition-colors duration-300`}>
                <Providers>
                    <Suspense fallback={null}>
                        <ReferralTracker />
                    </Suspense>
                    <Navbar />
                    <main className="min-h-screen pt-16">
                        {children}
                    </main>
                    <Footer />
                    <ThemeCustomizer />
                </Providers>
            </body>
        </html>
    );
}
