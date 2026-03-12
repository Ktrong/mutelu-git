"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading || categories.length === 0) return null;

    return (
        <section className="mt-6 px-4">
            <h2 className="text-lg font-bold mb-3 text-slate-800">รายการสินค้า</h2>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                {categories.map((cat: any) => (
                    <div
                        key={cat.id}
                        title={cat.tooltip || cat.description || cat.name}
                        className="flex-shrink-0 w-[145px] rounded-[1.2rem] p-2 pr-0 shadow-sm flex items-center justify-between border border-gold-primary/10 transition-all active:scale-95 cursor-pointer relative overflow-hidden h-[60px] group"
                        style={{ backgroundColor: cat.bgColor || "#D9C4A1" }}
                    >
                        {/* Background Image Layer */}
                        {cat.bgImageUrl && (
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.bgImageUrl})` }}
                            />
                        )}

                        {/* Overlay to ensure readability and apply brand feel */}
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 group-hover:opacity-30 transition-opacity"
                            style={{ backgroundColor: cat.bgImageUrl ? `${cat.bgColor}80` : 'transparent' }} // semi-transparent overlay if BG image exists
                        />

                        <div className="flex flex-col justify-center pl-1 z-10 w-[65%]">
                            <div
                                className="text-[10px] font-black leading-tight drop-shadow-sm line-clamp-1"
                                style={{ color: cat.textColor || "#1e293b" }}
                            >
                                {cat.name}
                            </div>
                            {cat.subtitle && (
                                <div
                                    className="text-[8px] font-bold mt-0.5 leading-tight opacity-90 line-clamp-1"
                                    style={{ color: cat.textColor || "#334155" }}
                                >
                                    {cat.subtitle}
                                </div>
                            )}
                        </div>
                        <div className="w-[35%] h-full flex items-end relative">
                            {cat.imageUrl ? (
                                <div
                                    className="w-full h-[90%] bg-contain bg-bottom bg-no-repeat transition-transform group-hover:scale-110"
                                    style={{ backgroundImage: `url(${cat.imageUrl})` }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    ✨
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination indicators for categories */}
            <div className="flex justify-center gap-1 mt-2">
                <div className="w-16 h-[2px] bg-gold-primary/10 rounded-full"></div>
                <div className="w-2.5 h-[2px] bg-gold-primary rounded-full"></div>
                <div className="w-16 h-[2px] bg-gold-primary/10 rounded-full"></div>
            </div>
        </section>
    );
}
