"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, LogOut, ChevronRight, Download, Gift, Share2, Wallet, Settings, Package, History, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';
import { getImageUrl } from "@/lib/utils";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                fetchProfileData(parsedUser.id);
            } else {
                window.location.href = '/auth/login?redirect=/profile';
            }
        }
    }, []);

    const fetchProfileData = async (userId: string) => {
        try {
            const res = await fetch(`/api/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setProfileData(data.user);
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

    if (!user || !profileData) return null;

    const totalOrders = (profileData.orders?.length || 0) + (profileData.customOrders?.length || 0);
    const affiliateApp = profileData.affiliateApplication;
    const isAffiliate = profileData.affiliateCodes && profileData.affiliateCodes.length > 0;

    return (
        <main className="pb-24">

            <div className="px-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 mt-4">บัญชีของฉัน</h1>

                {/* Profile Card */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gold-light/20 shadow-xl mb-6 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-gold-light/30 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                            {user.image ? (
                                <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gold-secondary" />
                            )}
                        </div>
                        <div className="text-center md:text-left w-full">
                            <h2 className="text-xl font-bold text-slate-800">{user.name || 'ผู้ใช้งาน'}</h2>
                            <p className="text-sm text-slate-500 mb-4">{user.email}</p>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <Link href="/profile/edit" className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                                    <Settings className="w-3 h-3" /> แก้ไขข้อมูล
                                </Link>

                                {isAffiliate ? (
                                    <Link href="/affiliate" className="bg-amber-100/50 text-amber-600 hover:bg-amber-100 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-amber-200 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> ไปที่ Affiliate Dashboard
                                    </Link>
                                ) : affiliateApp?.status === 'PENDING' ? (
                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-full border border-blue-100 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> สมัครตัวแทน: รอตรวจสอบ
                                    </span>
                                ) : (
                                    <Link href="/profile/affiliate" className="bg-gold text-white hover:bg-gold-hover text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-md flex items-center gap-1">
                                        สมัคร Affiliate
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credits summary */}
                <div className="gold-bg p-6 rounded-[2rem] text-white mb-8 flex justify-between items-center shadow-lg">
                    <div>
                        <p className="text-[10px] opacity-80 font-bold uppercase">เครดิตคงเหลือ</p>
                        <p className="text-3xl font-bold">{profileData.credits || 0} <span className="text-sm font-medium">Credits</span></p>
                    </div>
                    <Link href="/credits" className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-xs font-bold backdrop-blur-md transition-all">
                        เติมเงิน
                    </Link>
                </div>

                {/* Main Menu */}
                <h3 className="font-bold text-slate-700 mb-3 px-2">เมนูการใช้งาน</h3>
                <div className="space-y-3 mb-8">
                    <Link href="/profile/wallpapers" className="bg-white p-5 rounded-[1.5rem] border border-gold-light/10 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">วอลเปเปอร์ของฉัน</span>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">{profileData.downloads?.length || 0}</span>
                    </Link>

                    <Link href="/profile/orders" className="bg-white p-5 rounded-[1.5rem] border border-gold-light/10 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <History className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">ประวัติการสั่งซื้อทั้งหมด</span>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">{totalOrders}</span>
                    </Link>
                </div>


            </div>
        </main>
    );
}
