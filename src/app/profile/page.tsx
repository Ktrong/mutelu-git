import Header from "../components/Header";
import { User, Settings, Package, History, LogOut } from "lucide-react";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-cream pb-24 pt-[80px]">
            <Header />

            <div className="px-4">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gold-light/20 shadow-xl mb-8 relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-20 h-20 bg-gold-light rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                            <User className="w-10 h-10 text-gold-secondary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">ผู้ใช้งานทั่วไป</h2>
                            <p className="text-xs text-slate-400">user@example.com</p>
                            <button className="bg-gold-primary/10 text-gold-secondary text-[10px] font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-widest">แก้ไขข้อมูล</button>
                        </div>
                    </div>
                </div>

                {/* Credits summary duplicated here for convenience */}
                <div className="gold-bg p-6 rounded-[2rem] text-white mb-8 flex justify-between items-center shadow-lg">
                    <div>
                        <p className="text-[10px] opacity-80 font-bold uppercase">เครดิตคงเหลือ</p>
                        <p className="text-2xl font-bold">0 <span className="text-sm font-medium">Credits</span></p>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-xs font-bold backdrop-blur-md transition-all">เติมเงิน</button>
                </div>

                <div className="space-y-3">
                    {[
                        { label: 'วอลเปเปอร์ของฉัน', icon: <Package className="w-5 h-5" />, count: '0' },
                        { label: 'ประวัติการสั่งซื้อ', icon: <History className="w-5 h-5" /> },
                        { label: 'ตั้งค่าการใช้งาน', icon: <Settings className="w-5 h-5" /> },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-5 rounded-[2rem] border border-gold-light/10 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-gold-primary">{item.icon}</div>
                                <span className="text-sm font-bold text-slate-700">{item.label}</span>
                            </div>
                            {item.count && <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full">{item.count}</span>}
                        </div>
                    ))}

                    <button className="w-full bg-red-50 text-red-500 font-bold py-5 rounded-[2rem] mt-6 flex items-center justify-center gap-2">
                        <LogOut className="w-5 h-5" />
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </main>
    );
}
