"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Loader2 } from "lucide-react";

export default function FAQPage() {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch('/api/faqs');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setFaqs(data);
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const getFontSizeClass = (size: string) => {
        switch (size) {
            case 'base': return 'text-sm lg:text-base';
            case 'lg': return 'text-base lg:text-lg';
            case 'xl': return 'text-lg lg:text-xl';
            default: return 'text-base';
        }
    };

    return (
        <main className="min-h-screen bg-cream selection:bg-gold-light pb-20 pt-20">
            <section className="text-center mb-12 px-4 mt-8">
                <div className="inline-flex items-center justify-center p-3 mb-6 bg-white rounded-full shadow-md animate-bounce">
                    <HelpCircle className="w-8 h-8 text-gold" />
                </div>
                <h1 className="text-4xl md:text-5xl font-sarabun font-bold text-gray-900 mb-4 tracking-tight">
                    คำถามที่พบบ่อย
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                    รวบรวมข้อสงสัยเกี่ยวกับการใช้งานและบริการของเราไว้ที่นี่
                </p>
            </section>

            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={faq.id || index}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                    ? "border-gold shadow-md ring-1 ring-gold/20"
                                    : "border-gold/10 hover:border-gold/30"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                >
                                    <span
                                        style={{ color: faq.questionColor }}
                                        className={`font-bold ${getFontSizeClass(faq.questionSize)} ${faq.fontFamily === 'serif' ? 'font-serif' : 'font-sarabun'}`}
                                    >
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-gold" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                <div
                                    className={`px-6 transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p
                                        style={{ color: faq.answerColor }}
                                        className={`leading-relaxed border-t border-gray-100 pt-4 ${getFontSizeClass(faq.answerSize)} ${faq.fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}
                                    >
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {faqs.length === 0 && (
                            <div className="text-center py-20 text-gray-400 italic">
                                ยังไม่มีข้อมูลคำถามที่พบบ่อยในขณะนี้
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-12 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gold/10">
                    <p className="text-gray-600 mb-4">ยังไม่พบคำตอบที่คุณต้องการ?</p>
                    <button className="text-gold-dark font-bold hover:underline">
                        ติดต่อทีมงานของเรา
                    </button>
                </div>
            </div>
        </main>
    );
}
