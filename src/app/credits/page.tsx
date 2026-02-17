import Link from 'next/link';
import { CreditCard, QrCode, CheckCircle2, Star } from 'lucide-react';

export default function CreditsPage() {
    return (
        <div className="min-h-screen bg-cream pb-24">
            <header className="p-6 flex items-center justify-between">
                <Link href="/" className="text-slate-400">←</Link>
                <h1 className="text-xl font-bold text-slate-800">เติมเครดิต</h1>
                <div className="w-8"></div>
            </header>

            <div className="px-4 max-w-lg mx-auto">
                {/* Balance Card */}
                <div className="gold-bg p-8 rounded-[2.5rem] text-white mb-8 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="opacity-80 text-sm mb-1 uppercase tracking-widest font-bold">ยอดเงินคงเหลือ</p>
                        <h2 className="text-4xl font-bold flex items-center gap-2">
                            0 <span className="text-lg opacity-80 font-medium">เครดิต</span>
                        </h2>
                    </div>
                    <Star className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold-primary" />
                    เลือกแพ็คเกจ
                </h3>

                <div className="space-y-4 mb-12">
                    {[
                        { credits: 5, price: 99, label: 'เริ่มต้น', popular: false },
                        { credits: 15, price: 259, label: 'ยอดนิยม', popular: true },
                        { credits: 50, price: 790, label: 'คุ้มค่าสุดๆ', popular: false },
                    ].map((pkg) => (
                        <div
                            key={pkg.credits}
                            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative ${pkg.popular ? 'border-gold-primary bg-white shadow-md' : 'border-white bg-white/50'}`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-3 right-8 bg-gold-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Popular
                                </span>
                            )}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-2xl font-bold text-slate-800">{pkg.credits} เครดิต</h4>
                                        <span className="text-xs text-slate-400 font-medium tracking-tight">({pkg.label})</span>
                                    </div>
                                    <p className="text-slate-500 text-sm">ดาวน์โหลดภาพ 4K ได้ {pkg.credits} ครั้ง</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold gold-text">฿{pkg.price}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">บาท</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gold-light/10 mb-8">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-gold-primary" />
                        ชำระผ่าน PromptPay
                    </h4>

                    <div className="bg-slate-50 aspect-square rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <div className="text-center opacity-40">
                            <QrCode className="w-20 h-20 mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">QR CODE จะปรากฏที่นี่</p>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-xs text-slate-500">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            ยอดเงินจะเข้าบัญชีทันทีหลังชำระเงินสำเร็จ
                        </li>
                        <li className="flex items-start gap-3 text-xs text-slate-500">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            รองรับทุกธนาคาร และแอป Mobile Banking
                        </li>
                    </ul>
                </div>

                <button className="w-full gold-bg text-white font-bold py-5 rounded-[2rem] shadow-lg mb-4 flex items-center justify-center gap-2">
                    ยืนยันการชำระเงิน
                </button>
            </div>
        </div>
    );
}
