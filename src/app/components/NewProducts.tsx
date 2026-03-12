"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function NewProducts() {
    const [newest, setNewest] = useState<any>(null);

    useEffect(() => {
        fetch("/api/wallpapers?isNew=true")
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) setNewest(data[0]);
            })
            .catch(err => console.error("Error fetching new wallpapers:", err));
    }, []);

    if (!newest) return null;

    return (
        <section id="new" className="mt-8 px-4 pb-12">
            <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                สินค้าใหม่ <Sparkles className="w-4 h-4 text-gold-primary" />
            </h2>

            <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl group">
                {/* Background Image Banner */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${newest.imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                {/* iPhone Mockup with Wallpaper */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-[240px] aspect-[1/2] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-xl z-20"></div>

                        {/* Wallpaper Content */}
                        <div className="absolute inset-0 bg-gold-light">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${newest.imageUrl})` }}
                            >
                                {/* Clock Overlay */}
                                <div className="absolute top-12 left-0 right-0 text-center text-white/80 font-sans z-10 drop-shadow-md">
                                    <div className="text-[10px] font-medium opacity-80 uppercase">Monday 8 July</div>
                                    <div className="text-3xl font-bold mt-0.5 tracking-tight">08:08</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gold-primary uppercase tracking-widest">New Arrival</span>
                        <h3 className="text-xl font-bold text-white">{newest.title}</h3>
                        <p className="text-xs text-slate-200 line-clamp-1">{newest.description}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
