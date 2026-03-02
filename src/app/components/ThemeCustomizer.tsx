"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Settings2, X, Upload, Palette, Type } from "lucide-react";

export default function ThemeCustomizer() {
    const { theme, updateTheme, saveTheme, resetTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if user has admin privileges
        const adminUser = localStorage.getItem('adminUser');
        if (adminUser) {
            setIsAdmin(true);
            return;
        }

        const standardUser = localStorage.getItem('user');
        if (standardUser) {
            try {
                const userObj = JSON.parse(standardUser);
                if (userObj.isAdmin) {
                    setIsAdmin(true);
                }
            } catch (e) {
                // ignore parse errors
            }
        }
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateTheme({ logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isAdmin) {
        return null;
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[100] bg-gold text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                title="Customize Theme"
            >
                <Settings2 className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-gold" />
                    <h3 className="font-bold text-slate-800 text-sm">Theme Customizer</h3>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                {/* Logo Upload */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Upload className="w-4 h-4" /> แบรนด์โลโก้
                    </label>
                    <div className="flex flex-col items-center gap-3">
                        {theme.logoUrl ? (
                            <div className="relative group w-full h-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center p-2">
                                <img src={theme.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                <button
                                    onClick={() => updateTheme({ logoUrl: "" })}
                                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold rounded-xl transition-opacity"
                                >
                                    ลบโลโก้
                                </button>
                            </div>
                        ) : (
                            <label className="w-full h-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-gold hover:bg-gold/5 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                                <span className="text-xs text-slate-500 font-medium">อัปโหลดรูปภาพ</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-100">
                        <Palette className="w-4 h-4" /> สีของเว็บไซต์
                    </label>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 font-medium">พื้นหลัง (Background)</span>
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer">
                            <input
                                type="color"
                                value={theme.bgColor}
                                onChange={(e) => updateTheme({ bgColor: e.target.value })}
                                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 font-medium">แบบอักษร (Primary Text)</span>
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer">
                            <input
                                type="color"
                                value={theme.textColor}
                                onChange={(e) => updateTheme({ textColor: e.target.value })}
                                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-100">
                        <Type className="w-4 h-4" /> ตัวอักษร
                    </label>

                    <div className="space-y-2">
                        <span className="text-sm text-slate-700 font-medium">ฟอนต์ (Font Family)</span>
                        <select
                            value={theme.fontFamily}
                            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-gold/50"
                        >
                            <option value="sarabun">Sarabun (Default)</option>
                            <option value="inter">Inter (English)</option>
                            <option value="prompt">Prompt (Modern Thai)</option>
                            <option value="kanit">Kanit (Bold Thai)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-700 font-medium">ขนาดตัวอักษรฐาน</span>
                            <span className="text-xs text-gold font-bold">{theme.fontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            step="1"
                            value={theme.fontSize}
                            onChange={(e) => updateTheme({ fontSize: Number(e.target.value) })}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gold"
                        />
                    </div>
                </div>

            </div>

            {/* Footer actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                <button
                    onClick={async () => {
                        await saveTheme();
                    }}
                    className="w-full py-2 px-4 rounded-xl text-sm font-bold text-white bg-gold hover:bg-gold-dark transition-colors shadow-md"
                >
                    บันทึกการตั้งค่า
                </button>
                <button
                    onClick={resetTheme}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                    คืนค่าเริ่มต้น (ยังไม่บันทึก)
                </button>
            </div>
        </div>
    );
}
