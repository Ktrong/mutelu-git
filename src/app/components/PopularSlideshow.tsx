"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function PopularSlideshow() {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const SLIDE_DURATION = 5000; // 5 seconds

    useEffect(() => {
        fetch("/api/slideshows")
            .then(res => res.json())
            .then(data => {
                setSlides(data.filter((s: any) => s.isActive));
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching slideshows:", err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, SLIDE_DURATION);

        return () => clearInterval(interval);
    }, [slides, currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (isLoading || slides.length === 0) return null;

    const slide = slides[currentSlide] as any;

    return (
        <section className="px-4 mt-6 relative group">
            <div
                key={currentSlide}
                className="w-full rounded-[2.5rem] p-8 min-h-[160px] relative overflow-hidden transition-all duration-700 ease-in-out shadow-lg slide-reveal"
                style={{ backgroundColor: slide.bgColor }}
            >
                {/* Decorative Elements */}
                <div className="absolute top-4 right-6 text-white/40">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20">
                    <Sparkles className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex justify-between items-center">
                    <div className="max-w-[60%]">
                        <h2 className="text-2xl font-black text-white mb-1 drop-shadow-sm">
                            {slide.title}
                        </h2>
                        <p className="text-white/80 text-[10px] font-medium leading-tight mb-6">
                            {slide.subtitle}
                        </p>

                        <Link href={slide.wallpaperId ? `/products/${slide.wallpaperId}` : '/products'}>
                            <button className="bg-white/95 text-[#D9A040] font-black py-2.5 px-8 rounded-full shadow-lg text-xs active:scale-95 transition-all hover:bg-white/100">
                                {slide.buttonText}
                            </button>
                        </Link>
                    </div>

                    {/* Image Area */}
                    <div className="w-1/3 aspect-[3/4] relative">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 -rotate-6 scale-105" />
                        <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl rotate-3">
                            <img
                                src={slide.imageUrl || (slide.wallpaper?.imageUrl)}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Background Glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 blur-[80px] rounded-full" />
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-gold-primary' : 'w-1.5 bg-gold-light/30'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <style jsx>{`
                .slide-reveal {
                    animation: slideReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes slideReveal {
                    from { 
                        opacity: 0; 
                        transform: translateX(100%); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
            `}</style>
        </section>
    );
}
