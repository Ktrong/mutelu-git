"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, ShoppingBag, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { useTheme } from "@/context/ThemeContext";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NavigationMenu {
    id: string;
    label: string;
    url: string;
    alignment: 'LEFT' | 'CENTER' | 'RIGHT';
    fontSize?: string;
    fontFamily?: string;
    color?: string;
}

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { theme } = useTheme();

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

    const { data: menus } = useSWR<NavigationMenu[]>("/api/menus", fetcher);

    const leftMenus = menus?.filter(m => m.alignment === 'LEFT') || [];
    const centerMenus = menus?.filter(m => m.alignment === 'CENTER') || [];
    const rightMenus = menus?.filter(m => m.alignment === 'RIGHT') || [];

    // Fallback nav links if database is empty/loading
    const navLinks = menus && menus.length > 0 ? menus : [
        { id: '1', label: "หน้าแรก", url: "/", alignment: 'CENTER' as const, fontSize: 'sm', fontFamily: 'sans', color: '' },
        { id: '2', label: "สินค้าทั้งหมด", url: "/products", alignment: 'CENTER' as const, fontSize: 'sm', fontFamily: 'sans', color: '' },
    ];

    const isAdminRoute = pathname?.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        window.location.href = '/';
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-var-bg/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href={isAdminRoute ? "/admin" : "/"} className="flex-shrink-0 flex items-center">
                        {theme.logoUrl ? (
                            <img src={theme.logoUrl} alt="Logo" className="h-10 object-contain" />
                        ) : (
                            <span className="font-sarabun font-bold text-2xl text-gold-dark tracking-wider">
                                MUTELU<span className="text-gold">WALLPAPER</span>
                                {isAdminRoute && <span className="ml-2 text-xs bg-gold text-white px-2 py-0.5 rounded-full align-middle">ADMIN</span>}
                            </span>
                        )}
                    </Link>

                    {/* Desktop Menu - Left */}
                    {!isAdminRoute && leftMenus.length > 0 && (
                        <div className="hidden md:flex space-x-6 items-center flex-1 justify-start ml-6">
                            {leftMenus.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    style={link.color ? { color: link.color } : {}}
                                    className={`font-bold whitespace-nowrap transition-colors duration-200 hover:opacity-80
                                        text-${link.fontSize || 'sm'}
                                        ${link.fontFamily === 'sarabun' ? 'font-sarabun' : link.fontFamily === 'inter' ? 'font-inter' : 'font-sans'}
                                        ${!link.color && pathname === link.url ? "text-gold-dark" : !link.color ? "text-gray-600" : ""}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop Menu - Center */}
                    {!isAdminRoute && (
                        <div className={`hidden md:flex space-x-8 items-center ${leftMenus.length > 0 ? "flex-none" : "flex-1 justify-center"}`}>
                            {centerMenus.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    style={link.color ? { color: link.color } : {}}
                                    className={`font-bold whitespace-nowrap transition-colors duration-200 hover:opacity-80
                                        text-${link.fontSize || 'sm'}
                                        ${link.fontFamily === 'sarabun' ? 'font-sarabun' : link.fontFamily === 'inter' ? 'font-inter' : 'font-sans'}
                                        ${!link.color && pathname === link.url ? "text-gold-dark" : !link.color ? "text-gray-600" : ""}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {menus && menus.length === 0 && navLinks.map(link => (
                                <Link
                                    key={link.id}
                                    href={link.url}
                                    style={link.color ? { color: link.color } : {}}
                                    className={`font-bold whitespace-nowrap transition-colors duration-200 hover:opacity-80
                                        text-${link.fontSize || 'sm'}
                                        ${link.fontFamily === 'sarabun' ? 'font-sarabun' : link.fontFamily === 'inter' ? 'font-inter' : 'font-sans'}
                                        ${!link.color && pathname === link.url ? "text-gold-dark" : !link.color ? "text-gray-600" : ""}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop Menu - Right Area & User Icons */}
                    <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
                        {!isAdminRoute && rightMenus.length > 0 && (
                            <div className="flex space-x-6 items-center mr-6 border-r border-slate-200 pr-6">
                                {rightMenus.map((link) => (
                                    <Link
                                        key={link.id}
                                        href={link.url}
                                        style={link.color ? { color: link.color } : {}}
                                        className={`font-bold whitespace-nowrap transition-colors duration-200 hover:opacity-80
                                            text-${link.fontSize || 'sm'}
                                            ${link.fontFamily === 'sarabun' ? 'font-sarabun' : link.fontFamily === 'inter' ? 'font-inter' : 'font-sans'}
                                            ${!link.color && pathname === link.url ? "text-gold-dark" : !link.color ? "text-gray-600" : ""}
                                        `}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                        {isAdminRoute ? (
                            !isLoginPage && (
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-500 border border-red-500 px-4 py-1.5 rounded-full hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    ออกจากระบบ
                                </button>
                            )
                        ) : (
                            <>
                                <button className="text-gray-600 hover:text-gold transition-colors">
                                    <Search size={20} />
                                </button>
                                <Link href="/profile" className="text-gray-600 hover:text-gold transition-colors">
                                    <User size={20} />
                                </Link>
                                <Link href="/auth/login" className="text-sm font-medium text-gold-dark border border-gold-dark px-4 py-1.5 rounded-full hover:bg-gold-light/20 transition-all">
                                    เข้าสู่ระบบ
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Hide on Admin Pages? Or show streamlined? */}
                    <div className="md:hidden flex items-center">
                        {isAdminRoute ? (
                            !isLoginPage && (
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500"
                                >
                                    ออกจากระบบ
                                </button>
                            )
                        ) : (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-gold p-2 transition-colors"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Only for non-admin */}
            {!isAdminRoute && isMenuOpen && (
                <div className="md:hidden bg-var-bg border-t border-gold/10 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.id}
                                href={link.url}
                                onClick={() => setIsMenuOpen(false)}
                                style={link.color ? { color: link.color } : {}}
                                className={`block px-3 py-2 font-bold hover:bg-var-bg/50 hover:opacity-80 rounded-md transition-all
                                    text-${link.fontSize || 'base'}
                                    ${link.fontFamily === 'sarabun' ? 'font-sarabun' : link.fontFamily === 'inter' ? 'font-inter' : 'font-sans'}
                                    ${!link.color ? "text-gray-700 hover:text-gold" : ""}
                                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-gold/20 my-2 pt-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gold hover:bg-var-bg/50 rounded-md"
                            >
                                โปรไฟล์
                            </Link>
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gold-dark hover:text-gold hover:bg-var-bg/50 rounded-md"
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
