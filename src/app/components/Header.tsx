"use client";
import { useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import NavMenu from "./NavMenu";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[60] h-[60px] gold-bg shadow-md flex items-center justify-between px-4 text-slate-800">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <Menu size={24} />
                </button>

                <h1 className="text-lg font-bold tracking-[0.2em] ml-4">
                    IUCRATIVE
                </h1>

                <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                    <ShoppingCart size={24} />
                </button>
            </header>

            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
