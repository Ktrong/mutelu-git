"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Moon, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useSlideshows } from "@/lib/hooks";
import Image from "next/image";

const HeroSection = () => {
    const { slideshows, isLoading } = useSlideshows();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance slideshow
    useEffect(() => {
        if (slideshows && slideshows.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % slideshows.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [slideshows]);

    const nextSlide = () => {
        if (slideshows && slideshows.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % slideshows.length);
        }
    };

    const prevSlide = () => {
        if (slideshows && slideshows.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + slideshows.length) % slideshows.length);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cream animate-pulse">
                <div className="text-center">
                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                    <div className="flex justify-center gap-4">
                        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </section>
        );
    }

    // Default Static Content (Fallback)
    const renderStaticHero = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center transition-opacity duration-500">
            <div className="inline-flex items-center justify-center p-1 mb-6 rounded-full bg-white/50 backdrop-blur-sm border border-gold/20 shadow-sm animate-fade-in-up">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark bg-white rounded-full">
                    New Collection
                </span>
                <span className="px-3 text-xs font-medium text-gray-600">
                    ปลดล็อกพลังศักดิ์สิทธิ์ต้อนรับปี 2569
                </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-sarabun font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                เสริมดวง <span className="gold-text relative inline-block">
                    เสริมพลัง
                    <Sparkles className="absolute -top-6 -right-8 text-gold w-8 h-8 animate-bounce" />
                </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                ค้นพบวอลเปเปอร์มงคลพรีเมียมที่ออกแบบมาเพื่อสมดุลพลังงานของคุณ ความเชื่อที่ทันสมัยผสานกับการออกแบบที่หรูหรา
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/products">
                    <button className="px-8 py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                        <Moon size={20} />
                        เลือกชมวอลเปเปอร์
                    </button>
                </Link>
                <Link href="/about">
                    <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-full shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                        <Star size={20} className="text-gold" />
                        เกี่ยวกับเรา
                    </button>
                </Link>
            </div>
        </div>
    );

    // If no slideshows, show static
    if (!slideshows || slideshows.length === 0) {
        return (
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cream">
                {/* Background Effects (Static) */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold/10 blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/20 blur-[100px] animate-float"></div>
                    <div className="absolute top-20 right-[15%] opacity-20 animate-float-delayed">
                        <Star size={48} className="text-gold" />
                    </div>
                    <div className="absolute bottom-40 left-[10%] opacity-20 animate-float">
                        <Moon size={64} className="text-purple-300" />
                    </div>
                </div>
                {renderStaticHero()}
                {/* Gradient Overlay at bottom */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none"></div>
            </section>
        );
    }

    const currentSlide = slideshows[currentIndex];

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cream group">
            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full transition-colors duration-1000" style={{ backgroundColor: currentSlide?.bgColor || '#FEF9E7' }}>
                {/* Background Image if exists */}
                {currentSlide?.imageUrl && (
                    <div className="absolute inset-0">
                        <Image
                            src={currentSlide?.imageUrl}
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/50 to-cream"></div>
            </div>

            {/* Content */}
            <div key={currentIndex} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                {/* Optional Tag/Label (Static for now or loop if added to DB) */}
                <div className="inline-flex items-center justify-center p-1 mb-6 rounded-full bg-white/50 backdrop-blur-sm border border-gold/20 shadow-sm">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark bg-white rounded-full">
                        Featured
                    </span>
                    <span className="px-3 text-xs font-medium text-gray-600">
                        {currentSlide?.subtitle || "ปลดล็อกพลังศักดิ์สิทธิ์ต้อนรับปี 2567"}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-sarabun font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                    {currentSlide?.title}
                    {/* Add Sparkles only if it's the first slide or consistently? Let's add consistently */}
                    <span className="gold-text relative inline-block ml-2">
                        <Sparkles className="absolute -top-6 -right-8 text-gold w-8 h-8 animate-bounce" />
                    </span>
                </h1>

                {/* Subtitle from DB or default */}
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    {currentSlide?.subtitle || "ค้นพบวอลเปเปอร์มงคลพรีเมียมที่ออกแบบมาเพื่อสมดุลพลังงานของคุณ ความเชื่อที่ทันสมัยผสานกับการออกแบบที่หรูหรา"}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href={currentSlide?.wallpaperId ? `/order?id=${currentSlide.wallpaperId}` : "/order"}>
                        <button className="px-8 py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                            <Moon size={20} />
                            {currentSlide?.buttonText || "สั่งซื้อเลย"}
                        </button>
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows */}
            {
                slideshows.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/80 rounded-full backdrop-blur-sm transition-all text-gray-800 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/80 rounded-full backdrop-blur-sm transition-all text-gray-800 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={32} />
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                            {slideshows.map((_: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? "bg-gold w-8" : "bg-gold/30 hover:bg-gold/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )
            }

            {/* Gradient Overlay at bottom */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none"></div>
        </section >
    );
};

export default HeroSection;
