"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                // In a real app, save token to cookies/localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('เข้าสู่ระบบสำเร็จ!');
                router.push('/');
            } else {
                setError(data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/50 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-primary/5 rounded-full blur-3xl"></div>

                <div className="text-center mb-10 relative">
                    <h1 className="text-4xl font-bold gold-text mb-3">ยินดีต้อนรับ</h1>
                    <p className="text-slate-500 text-sm font-sarabun px-4 leading-relaxed">
                        เข้าสู่ระบบเพื่อรับวอลเปเปอร์มงคลของคุณ
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs rounded-2xl border border-red-100 font-bold animate-shake">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2 font-sarabun">อีเมล</label>
                        <input
                            type="email" required
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-gold-primary/30 focus:outline-none focus:ring-4 focus:ring-gold-primary/5 transition-all font-sarabun text-slate-700"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="pb-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2 font-sarabun">รหัสผ่าน</label>
                        <input
                            type="password" required
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-gold-primary/30 focus:outline-none focus:ring-4 focus:ring-gold-primary/5 transition-all font-sarabun text-slate-700"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full gold-bg text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-primary/20 transform transition-all hover:scale-[1.02] active:scale-95 mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังเข้าสู่ระบบ...
                            </span>
                        ) : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    <p className="text-slate-500 text-sm font-sarabun">
                        ยังไม่มีบัญชี? {' '}
                        <Link href="/auth/register" className="text-gold-secondary font-bold hover:text-gold-primary transition-colors">
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>
            </div>

            <Link href="/" className="mt-10 text-slate-400 text-sm hover:text-gold-primary transition-all flex items-center gap-2 font-sarabun">
                <span className="text-lg">←</span> กลับหน้าหลัก
            </Link>
        </div>
    );
}
