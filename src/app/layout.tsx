import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
            <body className={`${inter.variable} ${sarabun.variable} bg-cream text-gray-800`}>
                <Navbar />
                <main className="min-h-screen pt-16">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
