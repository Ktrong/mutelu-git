"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, PackageCheck, Clock, CheckCircle2, XCircle, Image as ImageIcon, Coins } from "lucide-react";
import Link from 'next/link';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                fetchProfileData(parsedUser.id);
            } else {
                window.location.href = '/auth/login?redirect=/profile/orders';
            }
        }
    }, []);

    const fetchProfileData = async (userId: string) => {
        try {
            const res = await fetch(`/api/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();

                // Combine and sort orders
                const regularOrders = (data.user?.orders || []).map((o: any) => ({ ...o, type: 'CREDIT' }));
                const customOrders = (data.user?.customOrders || []).map((o: any) => ({ ...o, type: 'CUSTOM' }));

                const combined = [...regularOrders, ...customOrders].sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

                setOrders(combined);
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS':
            case 'PAID':
            case 'COMPLETED':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'PENDING':
            case 'UNPAID':
                return <Clock className="w-4 h-4 text-amber-500" />;
            case 'FAILED':
            case 'CANCELLED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-slate-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'SUCCESS':
            case 'PAID':
            case 'COMPLETED':
                return 'สำเร็จ';
            case 'PENDING':
            case 'UNPAID':
                return 'รอชำระ/กำลังจัดทำ';
            case 'FAILED':
            case 'CANCELLED':
                return 'ยกเลิก/ไม่สำเร็จ';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS':
            case 'PAID':
            case 'COMPLETED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'PENDING':
            case 'UNPAID':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'FAILED':
            case 'CANCELLED':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <main className="pb-24">

            <div className="px-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6 mt-4">
                    <Link href="/profile" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">ประวัติการสั่งซื้อ</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PackageCheck className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-lg mb-2">ยังไม่มีประวัติการสั่งซื้อ</h3>
                        <p className="text-slate-500 text-sm mb-6">คุณยังไม่ได้ทำการสั่งซื้อวอลเปเปอร์หรือเติมเครดิต</p>
                        <Link href="/" className="bg-gold text-white font-bold py-3 px-8 rounded-full hover:bg-gold-hover transition-colors shadow-md inline-block">
                            เลือกดูวอลเปเปอร์
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => {
                            const isCustom = order.type === 'CUSTOM';
                            const status = isCustom ? (order.paymentStatus || order.status) : order.status;
                            const amount = isCustom ? order.totalAmount : order.amount;
                            const orderId = order.id.slice(-6).toUpperCase();
                            const title = isCustom ? (order.wallpaper?.title || 'สั่งทำวอลเปเปอร์') : 'เติมเครดิต';
                            const date = new Date(order.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            return (
                                <div key={order.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCustom ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {isCustom ? <ImageIcon className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">#{orderId} • {date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-slate-800">฿{amount?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                                        {isCustom && order.wallpaper ? (
                                            <div className="text-xs text-slate-500 truncate max-w-[150px]">
                                                {order.wallpaper.title}
                                            </div>
                                        ) : !isCustom ? (
                                            <div className="text-xs text-slate-500">
                                                +{order.credits} Credits
                                            </div>
                                        ) : <div className="text-xs text-slate-500">วอลเปเปอร์</div>}
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(status)}`}>
                                            {getStatusIcon(status)}
                                            {getStatusText(status)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
