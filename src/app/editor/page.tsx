"use client";
import { useState } from 'react';
import Link from 'next/link';
import PhoneMockup from '../components/iPhoneMockup';
import { Save, Download, Share2, Palette, Type } from 'lucide-react';

export default function EditorPage() {
    const [title, setTitle] = useState("เศรษฐีทันใจ");
    const [subtitle, setSubtitle] = useState("เสริมทรัพย์ รวยล้นพ้น");
    const [activeTab, setActiveTab] = useState('text');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left: Preview (Mobile First - Top on mobile) */}
            <div className="flex-1 bg-cream p-4 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                <div className="scale-75 md:scale-100 transform origin-center">
                    <PhoneMockup title={title} subtitle={subtitle} />
                </div>
            </div>

            {/* Right: Controls */}
            <div className="w-full md:w-[400px] bg-white p-6 flex flex-col h-full overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                    <Link href="/astrology" className="text-slate-400">←</Link>
                    <h1 className="text-lg font-bold">ปรับแต่งวอลเปเปอร์</h1>
                    <div className="w-4"></div>
                </header>

                <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'text' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
                    >
                        <Type className="w-4 h-4" />
                        ข้อความ
                    </button>
                    <button
                        onClick={() => setActiveTab('theme')}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'theme' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
                    >
                        <Palette className="w-4 h-4" />
                        ธีมสี
                    </button>
                </div>

                <div className="space-y-6 flex-1">
                    {activeTab === 'text' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">ข้อความหลัก</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-gold-primary/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">ข้อความรอง</label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-gold-primary/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'theme' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">เลือกโทนสีมงคล</label>
                            <div className="grid grid-cols-4 gap-3">
                                {['#D4AF37', '#C084FC', '#FB7185', '#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA'].map((color) => (
                                    <button
                                        key={color}
                                        className="w-full aspect-square rounded-2xl border-2 border-slate-100 hover:border-gold-primary transition-all p-1"
                                    >
                                        <div className="w-full h-full rounded-xl" style={{ backgroundColor: color }}></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-3">
                    <button className="w-full gold-bg text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Download className="w-5 h-5" />
                        ดาวน์โหลด (ใช้ 1 เครดิต)
                    </button>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50">
                            <Save className="w-4 h-4" />
                            บันทึก
                        </button>
                        <button className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50">
                            <Share2 className="w-4 h-4" />
                            แชร์
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
