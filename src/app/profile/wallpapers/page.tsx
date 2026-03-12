"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function MyWallpapersPage() {
    const [downloads, setDownloads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                fetchProfileData(parsedUser.id);
            } else {
                window.location.href = '/auth/login?redirect=/profile/wallpapers';
            }
        }
    }, []);

    const fetchProfileData = async (userId: string) => {
        try {
            const res = await fetch(`/api/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setDownloads(data.user?.downloads || []);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-var-bg pb-24 pt-[80px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    return (
        <main className="pb-24">

            <div className="px-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6 mt-4">
                    <Link href="/profile" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">วอลเปเปอร์ของฉัน</h1>
                </div>

                {downloads.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-lg mb-2">ยังไม่มีวอลเปเปอร์</h3>
                        <p className="text-slate-500 text-sm mb-6">คุณยังไม่ได้ทำการดาวน์โหลดวอลเปเปอร์ใดๆ</p>
                        <Link href="/" className="bg-gold text-white font-bold py-3 px-8 rounded-full hover:bg-gold-hover transition-colors shadow-md inline-block">
                            เลือกดูวอลเปเปอร์
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {downloads.map((download: any) => (
                            <div key={download.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group relative">
                                <div className="aspect-[9/16] relative bg-slate-100 overflow-hidden">
                                    <img
                                        src={getImageUrl(download.generatedUrl || download.wallpaper?.imageUrl || '/images/sample-wallpaper.jpg')}
                                        alt={download.wallpaper?.title || 'Wallpaper'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay downoad button */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <a href={getImageUrl(download.generatedUrl || download.wallpaper?.downloadUrl || download.wallpaper?.imageUrl)} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-800 p-3 rounded-full hover:scale-110 transition-transform shadow-lg">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-slate-800 text-xs truncate">{download.wallpaper?.title || 'วอลเปเปอร์สายมู'}</h3>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        {new Date(download.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
