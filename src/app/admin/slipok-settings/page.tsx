'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Users, ShoppingCart, Settings, Monitor, Menu, DollarSign, Percent } from "lucide-react";

export default function SlipOKSettingsPage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [branchId, setBranchId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/slipok-settings');
            if (res.ok) {
                const data = await res.json();
                setApiKey(data.apiKey || '');
                setBranchId(data.branchId || '');
            }
        } catch (error) {
            console.error('Failed to fetch SlipOK settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/slipok-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, branchId }),
            });

            if (res.ok) {
                setMessage('Settings saved successfully!');
            } else {
                setMessage('Failed to save settings.');
            }
        } catch (error) {
            console.error('Failed to save SlipOK settings:', error);
            setMessage('An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading settings...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    <h2 className="text-2xl font-bold gold-text">Iucrative</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Admin Console</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button onClick={() => router.push('/admin#dashboard')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <LayoutDashboard className="w-4 h-4" /> แดชบอร์ด
                    </button>
                    <button onClick={() => router.push('/admin#wallpapers')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <ImageIcon className="w-4 h-4" /> วอลเปเปอร์
                    </button>
                    <button onClick={() => router.push('/admin#categories')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Settings className="w-4 h-4" /> หมวดหมู่
                    </button>
                    <button onClick={() => router.push('/admin#slideshows')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Monitor className="w-4 h-4" /> สไลด์โชว์
                    </button>
                    <button onClick={() => router.push('/admin/menus')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Menu className="w-4 h-4" /> จัดการเมนู (Navbar)
                    </button>
                    <button onClick={() => router.push('/admin#users')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Users className="w-4 h-4" /> สมาชิก/แอดมิน
                    </button>
                    <button onClick={() => router.push('/admin#affiliate-apps')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Users className="w-4 h-4" /> คำขอเป็นตัวแทน
                    </button>
                    <button onClick={() => router.push('/admin#orders')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <ShoppingCart className="w-4 h-4" /> รายการสั่งซื้อ (Custom)
                    </button>
                    <button onClick={() => router.push('/admin#faqs')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Settings className="w-4 h-4" /> คำถามที่พบบ่อย (FAQs)
                    </button>
                    <button onClick={() => router.push('/admin#commissions')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <Percent className="w-4 h-4" /> Affiliate MLM
                    </button>
                    <button onClick={() => router.push('/admin#payouts')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <DollarSign className="w-4 h-4" /> แจ้งถอนเงิน
                    </button>
                    <button onClick={() => router.push('/admin#payment-channels')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors text-slate-400 hover:bg-white/5">
                        <DollarSign className="w-4 h-4" /> ช่องทางรับเงิน
                    </button>
                    <button onClick={() => router.push('/admin/slipok-settings')} className="w-full p-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-colors bg-white/10 text-white">
                        <Settings className="w-4 h-4" /> ตั้งค่า API สลิป (SlipOK)
                    </button>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={() => {
                            localStorage.removeItem('adminUser');
                            router.push('/admin/login');
                        }}
                        className="flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white"
                    >
                        <Settings className="w-4 h-4" /> ออกจากระบบ
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">SlipOK Settings</h1>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <p className="text-gray-600 mb-6 font-light">
                            Configure your SlipOK API credentials to enable automated payment slip verification.
                        </p>

                        {message && (
                            <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                                    API Key
                                </label>
                                <input
                                    type="text"
                                    id="apiKey"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9C4A1] focus:border-transparent transition-colors"
                                    placeholder="e.g. YOUR_SLIPOK_API_KEY"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch ID
                                </label>
                                <input
                                    type="text"
                                    id="branchId"
                                    value={branchId}
                                    onChange={(e) => setBranchId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9C4A1] focus:border-transparent transition-colors"
                                    placeholder="e.g. YOUR_SLIPOK_BRANCH_ID"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto px-6 py-3 bg-[#D9C4A1] hover:bg-[#c2aa84] text-gray-900 font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
