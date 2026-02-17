"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, ShoppingBag, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "หน้าแรก", href: "/" },
        { name: "สินค้ายอดนิยม", href: "/#top-products" },
        { name: "มาใหม่", href: "/#new-arrivals" },
        { name: "สินค้าทั้งหมด", href: "/products" },
        { name: "คำถามที่พบบ่อย", href: "/faq" },
        { name: "ติดต่อเรา", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-cream/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <span className="font-sarabun font-bold text-2xl text-gold-dark tracking-wider">
                            MUTELU<span className="text-gold">WALLPAPER</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors duration-200 hover:text-gold ${pathname === link.href ? "text-gold-dark" : "text-gray-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-gold transition-colors">
                            <Search size={20} />
                        </button>
                        <Link href="/profile" className="text-gray-600 hover:text-gold transition-colors">
                            <User size={20} />
                        </Link>
                        <Link href="/auth/login" className="text-sm font-medium text-gold-dark border border-gold-dark px-4 py-1.5 rounded-full hover:bg-gold-light/20 transition-all">
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gold p-2 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-cream border-t border-gold/10 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gold hover:bg-cream-dark/50 rounded-md transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-gold/20 my-2 pt-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gold hover:bg-cream-dark/50 rounded-md"
                            >
                                โปรไฟล์
                            </Link>
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gold-dark hover:text-gold hover:bg-cream-dark/50 rounded-md"
                            >
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
