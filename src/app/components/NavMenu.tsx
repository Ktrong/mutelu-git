"use client";

import Link from 'next/link';
import { X, Home, LogIn, Star, Sparkles, ShoppingBag, User, HelpCircle, Mail } from 'lucide-react';

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NavMenu({ isOpen, onClose }: NavMenuProps) {
    const menuItems = [
        { label: 'หน้าหลัก', href: '/', icon: <Home className="w-5 h-5" /> },
        { label: 'เข้าสู่ระบบ', href: '/auth/login', icon: <LogIn className="w-5 h-5" /> },
        { label: 'สินค้ายอดนิยม', href: '/#popular', icon: <Star className="w-5 h-5" /> },
        { label: 'สินค้ามาใหม่', href: '/#new', icon: <Sparkles className="w-5 h-5" /> },
        { label: 'รายการสินค้า', href: '/products', icon: <ShoppingBag className="w-5 h-5" /> },
        { label: 'ข้อมูลส่วนตัว', href: '/profile', icon: <User className="w-5 h-5" /> },
        { label: 'คำถามที่พบบ่อย', href: '/faq', icon: <HelpCircle className="w-5 h-5" /> },
        { label: 'ติดต่อเรา', href: '/contact', icon: <Mail className="w-5 h-5" /> },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Side Menu */}
            <nav className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[101] shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-10">
                        <span className="text-xl font-bold gold-text">Iucrative Menu</span>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center gap-4 p-4 text-slate-600 hover:text-gold-primary hover:bg-gold-light/10 rounded-2xl transition-all font-medium border-b border-gold-light/20 last:border-none"
                            >
                                <span className="text-gold-primary">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                            © 2026 Iucrative Wallpaper
                        </p>
                    </div>
                </div>
            </nav>
        </>
    );
}
