"use client";

import React from "react";
import FilterableImageGrid from "../components/FilterableImageGrid";
import { Sparkles } from "lucide-react";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-cream selection:bg-gold-light pb-20 pt-20">
            {/* Header */}
            <section className="text-center mb-12 px-4">
                <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-white/50 backdrop-blur-sm border border-gold/20 shadow-sm animate-fade-in-up">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark bg-white rounded-full">
                        คลังภาพมงคล
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-sarabun font-bold text-gray-900 mb-4 tracking-tight">
                    เลือกพลังที่ใช่ <span className="gold-text">สำหรับคุณ</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                    วอลเปเปอร์ทุกชิ้นผ่านการออกแบบอย่างพิถีพิถัน ผสานศาสตร์แห่งตัวเลขและสีมงคล เพื่อเสริมดวงชะตาในด้านที่คุณต้องการ
                </p>
            </section>

            {/* Product Grid */}
            <FilterableImageGrid />

            {/* Custom Order CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gold/10 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                        <Sparkles className="w-12 h-12 text-gold mx-auto mb-4 animate-bounce" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            ต้องการวอลเปเปอร์ที่ออกแบบเฉพาะดวงคุณ?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            เรามีบริการออกแบบวอลเปเปอร์ส่วนบุคคล โดยคำนวณจากวันเดือนปีเกิดและเวลาตกฟาก เพื่อผลลัพธ์ที่แม่นยำที่สุด
                        </p>
                        <button className="px-8 py-3 bg-gold hover:bg-gold-dark text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            สั่งทำวอลเปเปอร์ส่วนตัว
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
