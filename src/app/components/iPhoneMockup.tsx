interface PhoneMockupProps {
    wallpaperUrl?: string;
    title?: string;
    subtitle?: string;
}

export default function PhoneMockup({
    wallpaperUrl = "/images/sample-wallpaper.jpg",
    title = "เศรษฐีทันใจ",
    subtitle = "เสริมทรัพย์ รวยล้นพ้น"
}: PhoneMockupProps) {
    return (
        <section className="px-4">
            <div className="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-20"></div>

                {/* Screen Content (Wallpaper) */}
                <div className="absolute inset-0 bg-gold-light z-0">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${wallpaperUrl}")` }}>
                        <div className="absolute inset-0 bg-black/10"></div>

                        {/* Clock Overlay */}
                        <div className="absolute top-20 left-0 right-0 text-center text-white z-10">
                            <div className="text-6xl font-extralight">09:41</div>
                            <div className="text-sm font-medium mt-1">Friday, February 6</div>
                        </div>

                        {/* Auspicious Text */}
                        <div className="absolute bottom-32 left-0 right-0 text-center px-4">
                            <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                <div className="text-white font-bold text-lg mb-1">{title}</div>
                                <div className="text-white/80 text-[10px]">{subtitle}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-20"></div>
            </div>
        </section>
    );
}
