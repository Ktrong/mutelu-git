"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon, DollarSign, Users, CheckCircle, PieChart, Info, Plus, LogOut } from 'lucide-react';

export default function AffiliateDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [codes, setCodes] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'codes' | 'team' | 'payouts'>('overview');

    const [newCodeName, setNewCodeName] = useState('');
    const [creatingCode, setCreatingCode] = useState(false);

    const [payoutAmount, setPayoutAmount] = useState('');
    const [requestingPayout, setRequestingPayout] = useState(false);
    const [payoutMessage, setPayoutMessage] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (!userData) {
                // Not logged in
                window.location.href = '/auth/login?redirect=/affiliate';
                return;
            }
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchData(parsedUser.id);
        }
    }, []);

    const fetchData = async (userId: string) => {
        setLoading(true);
        try {
            const [dashRes, codeRes, payoutRes] = await Promise.all([
                fetch(`/api/affiliate/dashboard?userId=${userId}`),
                fetch(`/api/affiliate/codes?userId=${userId}`),
                fetch(`/api/affiliate/payout?userId=${userId}`)
            ]);

            if (dashRes.ok) setStats(await dashRes.json());
            if (codeRes.ok) setCodes(await codeRes.json());
            if (payoutRes.ok) setPayouts(await payoutRes.json());
        } catch (error) {
            console.error("Failed to load affiliate data:", error);
        }
        setLoading(false);
    };

    const handleCreateCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCodeName || !user) return;
        setCreatingCode(true);

        try {
            const res = await fetch('/api/affiliate/codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, code: newCodeName.trim(), discountPercent: 10 }) // Default 10%
            });

            if (res.ok) {
                setNewCodeName('');
                fetchData(user.id);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create code");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating code");
        }
        setCreatingCode(false);
    };

    const handleRequestPayout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!payoutAmount || !user) return;
        setRequestingPayout(true);
        setPayoutMessage('');

        try {
            const res = await fetch('/api/affiliate/payout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, amount: parseFloat(payoutAmount) })
            });

            if (res.ok) {
                setPayoutAmount('');
                setPayoutMessage('ส่งคำขอถอนเงินสำเร็จ');
                fetchData(user.id);
            } else {
                const data = await res.json();
                setPayoutMessage(data.error || "Failed to request payout");
            }
        } catch (error) {
            console.error(error);
            setPayoutMessage("Error requesting payout");
        }
        setRequestingPayout(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/auth/login?redirect=/affiliate';
    };


    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || !stats) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Affiliate Dashboard</h1>
                    <p className="text-slate-500">จัดการเครือข่าย ค่าคอมมิชชั่น และลิงก์แนะนำของคุณในที่เดียว</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-all font-semibold text-sm border border-slate-200"
                >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                </button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-amber-100 text-sm font-semibold mb-1">ยอดเงินคงเหลือ (ถอนได้)</p>
                        <h2 className="text-4xl font-bold">฿{stats.balance.toFixed(2)}</h2>
                    </div>
                    <DollarSign className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/20" />
                </div>

                <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-md border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold mb-1">สมาชิกในทีม (Team)</p>
                        <h2 className="text-3xl font-bold">{stats.team.level1} <span className="text-base font-normal text-slate-400">คน</span></h2>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-md border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold mb-1">ยอดขายจากรหัสของคุณ</p>
                        <h2 className="text-3xl font-bold">฿{stats.totalSales.toFixed(2)}</h2>
                        <p className="text-xs text-slate-400 mt-1">{stats.totalOrders} รายการสั่งซื้อ</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                        <PieChart className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                {[
                    { id: 'overview', label: 'ภาพรวม' },
                    { id: 'codes', label: 'รหัสส่วนลด/ลิงก์' },
                    { id: 'team', label: 'ทีมสายงาน' },
                    { id: 'payouts', label: 'การถอนเงิน' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                            : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Areas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-slate-800">ยินดีต้อนรับกลับมา, {user.name || user.email}!</h3>
                        <p className="text-slate-500 text-sm">นี่คือข้อมูลสรุปรวมบัญชีตัวแทนจำหน่ายของคุณ คุณสามารถโปรโมทลิงก์หรือรหัสส่วนลดเพื่อให้ผู้ใช้งานคนอื่นสมัครต่อจากคุณ หรือสั่งซื้อวอลเปเปอร์ได้</p>

                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
                            <Info className="w-5 h-5 shrink-0" />
                            <p>ผู้ที่สมัครใช้งานผ่านลิงก์ของคุณจะกลายเป็นสมาชิกในทีมคุณอัตโนมัติ ซึ่งคุณจะได้รับค่าคอมมิชชั่นตามสัดส่วน (MLM %)</p>
                        </div>
                    </div>
                )}

                {/* CODES TAB */}
                {activeTab === 'codes' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">รหัสส่วนลดและ Referral Links</h3>
                                <p className="text-sm text-slate-500">สร้างรหัสเพื่อใช้ลดราคาและติดตามยอดขาย</p>
                            </div>

                            <form onSubmit={handleCreateCode} className="flex gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    required
                                    placeholder="ตั้งชื่อรหัส (เช่น MUTE10)"
                                    value={newCodeName}
                                    onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                                    className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none flex-1"
                                />
                                <button
                                    type="submit"
                                    disabled={creatingCode}
                                    className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> สร้างรหัส
                                </button>
                            </form>
                        </div>

                        <div className="space-y-3">
                            {codes.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 text-sm">ยังไม่มีรหัสส่วนลด</div>
                            ) : (
                                codes.map(code => (
                                    <div key={code.id} className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-amber-600 text-lg">{code.code}</span>
                                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                                            </div>
                                            <p className="text-xs text-slate-500">สร้างเมื่อ {new Date(code.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto overflow-hidden">
                                            <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                                            <input
                                                readOnly
                                                disabled
                                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${code.code}`}
                                                className="bg-transparent border-none text-xs text-slate-600 w-full md:w-64 outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/?ref=${code.code}`);
                                                    alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
                                                }}
                                                className="text-amber-600 hover:text-amber-800 text-xs font-bold pl-2 border-l border-slate-300"
                                            >
                                                คัดลอก
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TEAM TAB */}
                {activeTab === 'team' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-slate-800">ทีมสายงาน (Downlines)</h3>
                        <p className="text-sm text-slate-500 mb-4">รายชื่อสมาชิกที่สมัครผ่านลิงก์แนะนำของคุณ (Level 1)</p>

                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">ชื่อ / อีเมล</th>
                                        <th className="px-4 py-3 font-semibold">ระดับชั้น</th>
                                        <th className="px-4 py-3 font-semibold">วันที่สมัคร</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.team.members.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-slate-400">ยังไม่มีสมาชิกในทีม</td>
                                        </tr>
                                    ) : (
                                        stats.team.members.map((member: any) => (
                                            <tr key={member.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-slate-800">{member.name || '-'}</p>
                                                    <p className="text-xs text-slate-500">{member.email}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-bold">Level 1</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">
                                                    {new Date(member.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PAYOUTS TAB */}
                {activeTab === 'payouts' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">แจ้งถอนค่าคอมมิชชั่น</h3>
                            <form onSubmit={handleRequestPayout} className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="w-full sm:w-1/2">
                                    <label className="block text-xs font-bold text-slate-600 mb-1">จำนวนเงินที่ต้องการถอน (ยอดคงเหลือ ฿{stats.balance.toFixed(2)})</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">฿</span>
                                        <input
                                            type="number"
                                            min="100"
                                            step="0.01"
                                            max={stats.balance}
                                            required
                                            placeholder="ขั้นต่ำ 100 บาท"
                                            value={payoutAmount}
                                            onChange={(e) => setPayoutAmount(e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={requestingPayout || stats.balance < 100}
                                    className="w-full sm:w-auto bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors"
                                >
                                    ยืนยันการถอน
                                </button>
                            </form>
                            {payoutMessage && (
                                <p className={`mt-3 text-sm font-bold ${payoutMessage.includes('สำเร็จ') ? 'text-green-600' : 'text-red-500'}`}>
                                    {payoutMessage}
                                </p>
                            )}
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-700 mb-3">ประวัติการแจ้งถอน</h4>
                            <div className="space-y-2">
                                {payouts.length === 0 ? (
                                    <p className="text-sm text-slate-400 py-4">ยังไม่มีประวัติการแจ้งถอน</p>
                                ) : (
                                    payouts.map(payout => (
                                        <div key={payout.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payout.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                    payout.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                        'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">ถอนเงิน {payout.amount.toFixed(2)} บาท</p>
                                                    <p className="text-xs text-slate-500">{new Date(payout.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${payout.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    payout.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {payout.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                                                        payout.status === 'REJECTED' ? 'ถูกปฏิเสธ' :
                                                            'รอตรวจสอบ'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
