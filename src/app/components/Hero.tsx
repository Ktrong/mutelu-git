export default function Hero() {
    return (
        <section className="mt-[76px] px-4">
            <div className="lavender-gradient rounded-[2.5rem] p-6 pr-0 flex items-center justify-between relative overflow-hidden h-[190px] shadow-sm border border-purple-200/30">
                <div className="z-10 flex flex-col justify-center max-w-[60%]">
                    <h2 className="text-white font-bold text-xl mb-1 leading-tight">
                        Most Popular
                    </h2>
                    <p className="text-white/90 text-[10px] mb-4 leading-snug">
                        Clear the Block, Unlock<br />the Luck.
                    </p>
                    <button className="bg-[#D9A040] text-white font-bold py-2 px-6 rounded-full shadow-md text-xs transition-transform hover:scale-105 active:scale-95 w-fit">
                        Get Now
                    </button>
                </div>

                <div className="relative h-full w-[45%] flex items-end">
                    <div className="relative w-full h-[90%] bg-white/20 rounded-t-[2rem] border-x-[4px] border-t-[4px] border-slate-800/20 overflow-hidden transform translate-y-2">
                        <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: 'url("/images/hero-phone-bg.png")' }}>
                        </div>
                    </div>
                </div>

                <div className="absolute top-4 right-20 text-white/40 text-xs animate-pulse">✨</div>
                <div className="absolute bottom-10 left-1/2 text-white/30 text-[8px]">✨</div>
            </div>

            <div className="flex justify-center gap-1.5 mt-2">
                <div className="w-16 h-[3px] bg-purple-200/50 rounded-full"></div>
                <div className="w-4 h-[3px] bg-gold-secondary/50 rounded-full"></div>
                <div className="w-16 h-[3px] bg-purple-200/50 rounded-full"></div>
            </div>
        </section>
    );
}
