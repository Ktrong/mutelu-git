"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQS = [
    {
        question: "วอลเปเปอร์สายมูคืออะไร?",
        answer: "วอลเปเปอร์สายมู คือภาพพื้นหลังโทรศัพท์ที่ออกแบบโดยใช้หลักโหราศาสตร์ สีมงคล และไพ่ยิปซี เพื่อช่วยเสริมสร้างพลังงานบวกและดึงดูดสิ่งดีๆ เข้ามาในชีวิตตามความเชื่อส่วนบุคคล"
    },
    {
        question: "ต้องใช้วันเดือนปีเกิดในการสั่งทำหรือไม่?",
        answer: "สำหรับวอลเปเปอร์แบบ Custom (สั่งทำพิเศษ) จำเป็นต้องใช้วันเดือนปีเกิดและเวลาตกฟากเพื่อคำนวณลัคนาและวางองค์ประกอบให้เหมาะสมกับดวงชะตาของคุณที่สุด ส่วนวอลเปเปอร์สำเร็จรูปสามารถเลือกตามเรื่องที่ต้องการเสริมได้เลย"
    },
    {
        question: "หลังจากชำระเงินแล้วจะได้รับวอลเปเปอร์ทางไหน?",
        answer: "เมื่อชำระเงินเรียบร้อยแล้ว ระบบจะแสดงลิงก์ดาวน์โหลดทันทีบนหน้าเว็บไซต์ และจะส่งลิงก์ดาวน์โหลดไปยังอีเมลที่คุณลงทะเบียนไว้ด้วย"
    },
    {
        question: "สามารถใช้วอลเปเปอร์ร่วมกับเครื่องรางอื่นได้ไหม?",
        answer: "ได้แน่นอน วอลเปเปอร์เป็นเพียงส่วนหนึ่งในการเสริมกำลังใจ การมีเครื่องรางอื่นๆ ร่วมด้วยจะช่วยส่งเสริมพลังงานด้านบวกได้ดียิ่งขึ้น"
    },
    {
        question: "มีนโยบายการคืนเงินหรือไม่?",
        answer: "เนื่องจากเป็นสินค้าดิจิทัล ทางเราขอสงวนสิทธิ์ในการคืนเงินทุกกรณี แต่หากไฟล์มีปัญหาหรือไม่สามารถดาวน์โหลดได้ สามารถติดต่อทีมงานเพื่อขอรับไฟล์ใหม่ได้ทันที"
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                    ? "border-gold shadow-md ring-1 ring-gold/20"
                                    : "border-gold/10 hover:border-gold/30"
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                            >
                                <span className={`font-sarabun font-bold text-lg ${openIndex === index ? "text-gold-dark" : "text-gray-800"}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-gold" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            <div
                                className={`px-6 transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-48 opacity-100 pb-6" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

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
