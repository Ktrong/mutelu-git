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
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl border border-gold-light/20">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gold-text mb-2">ยินดีต้อนรับ</h1>
                    <p className="text-slate-500 text-sm">เข้าสู่ระบบเพื่อรับวอลเปเปอร์มงคลของคุณ</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs rounded-2xl border border-red-100 font-bold">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 font-sarabun">อีเมล</label>
                        <input
                            type="email" required
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 transition-all font-sarabun"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1 font-sarabun">รหัสผ่าน</label>
                        <input
                            type="password" required
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 transition-all font-sarabun"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full gold-bg text-white font-bold py-4 rounded-2xl shadow-lg transform transition-transform active:scale-95 mt-4 flex items-center justify-center ${loading ? 'opacity-70 animate-pulse' : ''}`}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400">หรือ</span>
                        </div>
                    </div>

                    <button className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        เข้าสู่ระบบด้วย Google
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    ยังไม่มีบัญชี? {' '}
                    <Link href="/auth/register" className="text-gold-secondary font-bold hover:underline">
                        สมัครสมาชิก
                    </Link>
                </p>
            </div>

            <Link href="/" className="mt-8 text-slate-400 text-sm hover:text-gold-primary transition-colors">
                ← กลับหน้าหลัก
            </Link>
        </div>
    );
}
