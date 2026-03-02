"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, MapPin } from 'lucide-react';

export default function AstrologyPage() {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen bg-var-bg pb-24">
            {/* Header */}
            <header className="p-6 flex items-center justify-between">
                <Link href="/" className="text-slate-400">
                    <span className="text-2xl">←</span>
                </Link>
                <h1 className="text-xl font-bold text-slate-800">คำนวณพื้นดวง</h1>
                <div className="w-8"></div>
            </header>

            <div className="px-4">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-gold-primary' : 'bg-slate-200'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-gold-primary' : 'bg-slate-200'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-gold-primary' : 'bg-slate-200'}`}></div>
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">ข้อมูลวันเกิด</h2>
                            <p className="text-slate-500 text-sm">เราจะใช้ข้อมูลนี้เพื่อหาคู่สีที่เหมาะสมที่สุดสำหรับคุณ</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gold-light/10">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                                    <Calendar className="w-4 h-4 text-gold-primary" />
                                    วัน/เดือน/ปี เกิด
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold-primary/50"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gold-light/10">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                                    <Clock className="w-4 h-4 text-gold-primary" />
                                    เวลาเกิด (ถ้ามี)
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-gold-primary/50"
                                />
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full gold-bg text-white font-bold py-5 rounded-[2rem] shadow-lg flex items-center justify-center gap-2"
                            >
                                ขั้นตอนถัดไป
                                <Sparkles className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">เป้าหมายที่ต้องการ</h2>
                            <p className="text-slate-500 text-sm">คุณต้องการเสริมดวงในด้านใดเป็นพิเศษ?</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'money', label: 'การเงิน/โชคลาภ', icon: '💰', color: 'bg-yellow-100' },
                                { id: 'love', label: 'ความรัก/ความเมตตา', icon: '💖', color: 'bg-pink-100' },
                                { id: 'work', label: 'การงาน/อำนาจ', icon: '🚀', color: 'bg-blue-100' },
                                { id: 'health', label: 'สุขภาพ/ความสุข', icon: '🍀', color: 'bg-green-100' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setStep(3)}
                                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gold-light/10 flex flex-col items-center gap-3 transition-transform active:scale-95 hover:border-gold-primary"
                                >
                                    <span className={`text-3xl p-4 rounded-2xl ${item.color}`}>{item.icon}</span>
                                    <span className="font-bold text-xs text-slate-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center animate-in zoom-in duration-700">
                        <div className="mb-12 mt-8">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gold-primary blur-3xl opacity-20 animate-pulse"></div>
                                <Sparkles className="w-20 h-20 text-gold-primary mx-auto mb-6 relative z-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">คำนวณเสร็จสิ้น!</h2>
                            <p className="text-slate-500">เราพบวอลเปเปอร์ที่เหมาะกับพื้นดวงของคุณแล้ว</p>
                        </div>

                        <Link href="/editor" className="block w-full gold-bg text-white font-bold py-5 rounded-[2rem] shadow-lg mb-4">
                            ไปที่หน้าปรับแต่ง (Editor)
                        </Link>

                        <button
                            onClick={() => setStep(1)}
                            className="text-slate-400 text-sm font-medium"
                        >
                            เริ่มคำนวณใหม่
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
