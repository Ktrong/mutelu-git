interface PhoneMockupProps {
    wallpaperUrl?: string;
    title?: string;
    subtitle?: string;
    showWatermark?: boolean;
    dayOfWeek?: string;
    zodiac?: string;
}

export default function PhoneMockup({
    wallpaperUrl = "/images/sample-wallpaper.jpg",
    title = "เศรษฐีทันใจ",
    subtitle = "เสริมทรัพย์ รวยล้นพ้น",
    showWatermark = false,
    dayOfWeek,
    zodiac
}: PhoneMockupProps) {
    return (
        <section className="px-4">
            {/* iPhone 17 Pro Max Mockup */}
            <div className="relative mx-auto w-[280px] h-[580px] bg-black rounded-[3.5rem] p-[4px] shadow-2xl overflow-hidden ring-1 ring-white/10">
                {/* Ultra-thin Bezels */}
                <div className="absolute inset-0 border-[3px] border-slate-900 rounded-[3.5rem] z-50 pointer-events-none"></div>

                {/* Dynamic Island (iPhone 17 Pro Max style) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-[60] flex items-center justify-around px-2 shadow-inner border border-white/5">
                    <div className="w-1.5 h-1.5 bg-[#001020] rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-[#050510] rounded-full border border-white/5"></div>
                </div>

                {/* Screen Content (Wallpaper) */}
                <div className="absolute inset-x-[4px] inset-y-[4px] bg-slate-950 rounded-[3.2rem] overflow-hidden z-0">
                    <div className="w-full h-full bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url("${wallpaperUrl}")` }}>
                        <div className="absolute inset-0 bg-black/10"></div>

                        {/* Clock Overlay */}
                        <div className="absolute top-20 left-0 right-0 text-center text-white z-10">
                            <div className="text-6xl font-extralight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">09:41</div>
                            <div className="text-sm font-medium mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">Friday, February 6</div>
                        </div>

                        {/* Auspicious Text - NO FRAME DESIGN */}
                        <div className="absolute bottom-32 left-0 right-0 text-center px-6 z-20">
                            <div className="space-y-1 transition-all">
                                <div className="text-white font-bold text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide">{title}</div>
                                <div className="flex justify-center items-center gap-2 mt-3">
                                    {(dayOfWeek || zodiac) && (
                                        <div className="bg-gold-primary text-[9px] font-bold text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg ring-1 ring-white/20">
                                            {dayOfWeek || 'วัน'} • {zodiac || 'ราศี'}
                                        </div>
                                    )}
                                </div>
                                <div className="text-white/90 text-xs font-medium mt-3 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] uppercase tracking-widest">{subtitle}</div>
                            </div>
                        </div>

                        {/* Watermark */}
                        {showWatermark && (
                            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center opacity-40 overflow-hidden">
                                <div className="grid grid-cols-2 gap-x-20 gap-y-32 -rotate-45 scale-150">
                                    {[...Array(6)].map((_, i) => (
                                        <span key={i} className="text-white font-bold text-[10px] tracking-widest whitespace-nowrap drop-shadow-sm">
                                            www.callmemu.com
                                        </span>
                                    ))}
                                </div>
                                {/* Center large watermark */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-[2px] px-3 py-1 rounded-full border border-white/20">
                                    <span className="text-white font-bold text-[12px] tracking-widest uppercase italic">
                                        www.callmemu.com
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Bar (Home Indicator) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/60 rounded-full z-[60] shadow-sm"></div>
            </div>
        </section>
    );
}
