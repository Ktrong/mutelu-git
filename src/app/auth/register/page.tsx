"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        terms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.terms) {
            setError('กรุณายอมรับเงื่อนไขการใช้งาน');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('สมัครสมาชิกสำเร็จ!');
                router.push('/auth/login');
            } else {
                setError(data.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
            }
        } catch (err) {
            setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl border border-gold-light/20">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gold-text mb-2">สมัครสมาชิก</h1>
                    <p className="text-slate-500 text-sm">เริ่มต้นเส้นทางความรวยด้วยวอลเปเปอร์สายมู</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs rounded-2xl border border-red-100 font-bold">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">ชื่อ-นามสกุล</label>
                        <input
                            type="text" required
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 transition-all font-sarabun"
                            placeholder="กรุณากรอกชื่อของคุณ"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">อีเมล</label>
                        <input
                            type="email" required
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 transition-all font-sarabun"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">รหัสผ่าน</label>
                        <input
                            type="password" required
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 transition-all font-sarabun"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="flex items-start gap-2 ml-1">
                        <input
                            type="checkbox" id="terms" className="mt-1"
                            checked={formData.terms}
                            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        />
                        <label htmlFor="terms" className="text-[10px] text-slate-500 leading-tight">
                            ฉันยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว (PDPA)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full gold-bg text-white font-bold py-4 rounded-2xl shadow-lg transform transition-transform active:scale-95 mt-4 flex items-center justify-center ${loading ? 'opacity-70 animate-pulse' : ''}`}
                    >
                        {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีผู้ใช้'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    มีบัญชีอยู่แล้ว? {' '}
                    <Link href="/auth/login" className="text-gold-secondary font-bold hover:underline">
                        เข้าสู่ระบบ
                    </Link>
                </p>
            </div>

            <Link href="/" className="mt-8 text-slate-400 text-sm hover:text-gold-primary transition-colors">
                ← กลับหน้าหลัก
            </Link>
        </div>
    );
}
