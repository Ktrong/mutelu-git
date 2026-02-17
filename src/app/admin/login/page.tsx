"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user?.isAdmin) {
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                    router.push('/admin');
                } else {
                    setError('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้');
                }
            } else {
                setError(data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-primary/10 mb-4">
                        <ShieldCheck className="w-8 h-8 text-gold-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
                    <p className="text-slate-500 text-sm mt-2">กรุณาเข้าสู่ระบบเพื่อจัดการระบบหลังบ้าน</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-500 text-xs font-medium border border-red-100 flex items-center gap-2 animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none transition-all text-sm"
                                    placeholder="admin@iucrative.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-primary/30 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ Admin'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm">
                    <Link href="/" className="text-slate-400 hover:text-gold-primary flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        กลับสู่หน้าหลัก
                    </Link>
                </div>
            </div>
        </main>
    );
}
