"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Check, CreditCard, QrCode, X, Download } from 'lucide-react';
import PhoneMockup from './iPhoneMockup';

declare const Omise: any;

import { useSearchParams } from 'next/navigation';

interface Wallpaper {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    downloadUrl?: string;
    offerings?: Wallpaper[];
}

export default function CustomOrderForm() {
    const searchParams = useSearchParams();
    const wpIdFromUrl = searchParams.get('id');

    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [selectedWp, setSelectedWp] = useState<Wallpaper | null>(null);
    const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]); // Array of offering IDs
    // ... rest of state stays same
    const [formData, setFormData] = useState({
        displayedName: '',
        birthDate: '',
        dayOfWeek: 'วันอาทิตย์',
        zodiac: 'มังกร',
        email: '',
        discountCode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card'>('promptpay');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCode = localStorage.getItem('affiliateCode');
            if (savedCode) {
                setFormData(prev => ({ ...prev, discountCode: savedCode }));
            }
        }

        const fetchWallpapers = async () => {
            const res = await fetch('/api/wallpapers/with-offerings');
            const data = await res.json();
            console.log('[OrderForm] wpIdFromUrl:', wpIdFromUrl);
            console.log('[OrderForm] API data:', data);
            if (Array.isArray(data) && data.length > 0) {
                setWallpapers(data);

                // If there's an ID in URL, find it. Otherwise take first one
                let targetWp = null;
                if (wpIdFromUrl) {
                    targetWp = data.find((wp: any) => wp.id === wpIdFromUrl);
                    console.log('[OrderForm] Found by ID:', targetWp?.title);
                }
                if (!targetWp) {
                    targetWp = data.find((wp: any) => wp.offerings && wp.offerings.length > 0) || data[0];
                    console.log('[OrderForm] Fallback to:', targetWp?.title);
                }

                if (targetWp) {
                    setSelectedWp(targetWp);
                    if (targetWp.offerings) {
                        setSelectedOfferings(targetWp.offerings.map((o: any) => o.id));
                    }
                }
            }
        };

        // Load Omise.js
        const script = document.createElement('script');
        script.src = 'https://cdn.omise.co/omise.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            if (typeof Omise !== 'undefined') {
                Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || 'pkey_test_5x9z9v3h6u4v3h6u4v3'); // Use fallback for demo/testing
            }
        };

        fetchWallpapers();
    }, [wpIdFromUrl]);

    const processPayment = async (orderId: string, totalAmount: number) => {
        return new Promise((resolve, reject) => {
            if (paymentMethod === 'card') {
                Omise.createToken('card', {
                    // In a real app, you'd have card input fields. 
                    // For this demo/image matching, we assume Omise's pre-built form or simplified fields
                    name: formData.displayedName,
                    // other card info...
                }, async (statusCode: number, response: any) => {
                    if (statusCode === 200) {
                        resolve({ token: response.id });
                    } else {
                        reject(new Error(response.message));
                    }
                });
            } else {
                // PromptPay source creation
                Omise.createSource('promptpay', {
                    amount: totalAmount * 100,
                    currency: 'thb',
                }, async (statusCode: number, response: any) => {
                    if (statusCode === 200) {
                        resolve({ source: response.id });
                    } else {
                        reject(new Error(response.message));
                    }
                });
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWp) return;

        setIsSubmitting(true);
        setMessage('');
        setQrCodeUrl('');

        try {
            // 1. Create the order
            const totalAmount = calculateTotal();
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    wallpaperId: selectedWp.id,
                    totalAmount: totalAmount,
                    affiliateCode: formData.discountCode
                })
            });

            const order = await orderRes.json();
            if (!orderRes.ok) throw new Error(order.error || 'Failed to create order');

            // 2. Process Payment (Bypassed for debugging/demo)
            /*
            let paymentPayload: any = {};
            try {
                paymentPayload = await processPayment(order.id, totalAmount);
            } catch (payErr: any) {
                setMessage(`Payment Error: ${payErr.message}`);
                setIsSubmitting(false);
                return;
            }

            // 3. Confirm with Backend
            const payRes = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    ...paymentPayload
                })
            });

            const payData = await payRes.json();
            if (payRes.ok) {
                if (payData.download_uri) {
                    setQrCodeUrl(payData.download_uri);
                    setMessage('กรุณาสแกน QR Code ด้านบนเพื่อชำระเงิน');
                } else {
                    setMessage('สั่งซื้อสำเร็จ! ดูตัวอย่างวอลเปเปอร์ของคุณด้านล่าง');
                    setShowPreview(true);
                }
            } else {
                setMessage(payData.error || 'การชำระเงินขัดข้อง');
            }
            */

            // Simulation of success for debugging
            setMessage('สั่งซื้อสำเร็จ! ดูตัวอย่างวอลเปเปอร์ของคุณด้านล่าง');
            setShowPreview(true);
        } catch (error: any) {
            setMessage(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        setIsSubmitting(false);
    };

    // Calculate total price including selected offerings
    const calculateTotal = () => {
        let total = selectedWp?.price || 0;
        if (selectedWp?.offerings && selectedOfferings.length > 0) {
            const offeringsTotal = selectedWp.offerings
                .filter(offering => selectedOfferings.includes(offering.id))
                .reduce((sum, offering) => sum + offering.price, 0);
            total += offeringsTotal;
        }
        return total;
    };

    // Toggle individual offering selection
    const toggleOffering = (offeringId: string) => {
        setSelectedOfferings(prev =>
            prev.includes(offeringId)
                ? prev.filter(id => id !== offeringId)
                : [...prev, offeringId]
        );
    };

    // Toggle all offerings
    const toggleAllOfferings = () => {
        if (selectedWp?.offerings) {
            if (selectedOfferings.length === selectedWp.offerings.length) {
                setSelectedOfferings([]);
            } else {
                setSelectedOfferings(selectedWp.offerings.map(o => o.id));
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-[2.5rem] bg-gradient-to-br from-[#FFF5F7] via-[#FFF9F2] to-[#F2FCFF] shadow-xl font-sans text-[#4A4A4A]">
            {/* Additional Content Blocks (Moved to top as requested) */}
            {selectedWp && (selectedWp as any).contents && (selectedWp as any).contents.length > 0 && (
                <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="text-xs font-bold text-slate-400 uppercase text-center tracking-widest mb-1">รายละเอียดเพิ่มเติม</h4>
                    {(selectedWp as any).contents.map((block: any, index: number) => (
                        <div key={block.id || index} className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-white">
                            <img src={block.imageUrl} alt="" className="w-full h-auto object-cover block" />
                            {block.text && (
                                <div
                                    className={`absolute w-full p-4 text-center pointer-events-none break-words z-10 leading-relaxed`}
                                    style={{
                                        color: block.textColor,
                                        fontFamily: block.fontFamily === 'kanit' ? 'var(--font-kanit)' : block.fontFamily,
                                        fontSize: block.textSize === 'xs' ? '0.75rem' : block.textSize === 'sm' ? '0.875rem' : block.textSize === 'lg' ? '1.125rem' : block.textSize === 'xl' ? '1.25rem' : block.textSize === '2xl' ? '1.5rem' : '1rem',
                                        bottom: block.textPosition === 'bottom' ? 0 : 'auto',
                                        left: 0, right: 0,
                                        transform: block.textPosition === 'center' ? 'translateY(-50%)' : 'none',
                                        top: block.textPosition === 'center' ? '50%' : (block.textPosition === 'top' ? 0 : 'auto'),
                                        textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {block.text}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />
                </div>
            )}

            <h2 className="text-center text-xl font-bold mb-6 text-slate-800">รายละเอียดการสั่งซื้อ</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Selected Wallpaper Display */}
                {selectedWp && (
                    <div className="bg-gradient-to-br from-[#E0F7F1] to-[#D4F1F4] p-4 rounded-2xl shadow-md">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-24 bg-white rounded-xl overflow-hidden shadow-lg">
                                <img src={selectedWp.imageUrl} alt={selectedWp.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-base text-slate-800">{selectedWp.title}</h3>
                                <p className="text-sm text-slate-600 mt-1">ราคา: {selectedWp.price.toFixed(2)} บาท</p>
                            </div>
                        </div>

                        {/* Offerings Section */}
                        {selectedWp.offerings && selectedWp.offerings.length > 0 && (
                            <div className="space-y-2 pt-3 border-t border-white/50">
                                <div className="flex items-center justify-between px-1 mb-2">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase">ของถวายสำหรับวอลเปเปอร์นี้</h4>
                                    <button
                                        type="button"
                                        onClick={toggleAllOfferings}
                                        className="text-[10px] font-bold text-amber-600 hover:text-amber-700 underline"
                                    >
                                        {selectedOfferings.length === selectedWp.offerings.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {selectedWp.offerings.map((offering) => {
                                        const isSelected = selectedOfferings.includes(offering.id);
                                        return (
                                            <div
                                                key={offering.id}
                                                onClick={() => toggleOffering(offering.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${isSelected
                                                    ? 'bg-amber-50 border-amber-300 shadow-sm'
                                                    : 'bg-white/50 border-transparent hover:bg-white/80'
                                                    }`}
                                            >
                                                <div className="w-10 h-14 bg-white rounded-lg overflow-hidden shadow-sm">
                                                    <img src={offering.imageUrl} alt={offering.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-800">{offering.title}</p>
                                                    <p className="text-xs text-amber-600">+{offering.price.toFixed(2)} บาท</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-amber-500' : 'bg-slate-200'
                                                    }`}>
                                                    {isSelected && <Check className="w-4 h-4 stroke-[3] text-white" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* Input Fields */}
                <div className="space-y-3 pt-2">
                    <div>
                        <label className="block text-xs font-bold mb-1 ml-1">ชื่อที่แสดงในวอลเปเปอร์</label>
                        <input
                            type="text" required
                            className="w-full bg-[#FEFEED] rounded-xl p-3 text-sm border-none shadow-inner outline-none focus:ring-1 ring-[#FFDAB9]/50"
                            value={formData.displayedName}
                            onChange={(e) => setFormData({ ...formData, displayedName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1 ml-1">วัน เดือน ปีเกิด (พ.ศ.)</label>
                        <input
                            type="text" required placeholder="เช่น 1 มกราคม 2530"
                            className="w-full bg-[#FEFEED] rounded-xl p-3 text-sm border-none shadow-inner outline-none focus:ring-1 ring-[#FFDAB9]/50"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold mb-1 ml-1">วันในสัปดาห์</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-[#FEFEED] rounded-xl p-3 text-sm border-none shadow-inner outline-none appearance-none cursor-pointer"
                                    value={formData.dayOfWeek}
                                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                >
                                    {["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"].map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA048]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 ml-1">ราศีตามวันเกิด</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-[#FEFEED] rounded-xl p-3 text-sm border-none shadow-inner outline-none appearance-none cursor-pointer"
                                    value={formData.zodiac}
                                    onChange={(e) => setFormData({ ...formData, zodiac: e.target.value })}
                                >
                                    {["มังกร", "กุมภ์", "มีน", "เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู"].map(z => (
                                        <option key={z} value={z}>{z}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFA048]" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1 ml-1">อีเมล</label>
                        <input
                            type="email" required
                            className="w-full bg-[#FEFEED] rounded-xl p-3 text-sm border-none shadow-inner outline-none focus:ring-1 ring-[#FFDAB9]/50"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1 ml-1">โค้ดส่วนลด</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-[#FEFEED] rounded-xl p-3 text-sm border-none shadow-inner outline-none focus:ring-1 ring-[#FFDAB9]/50"
                                value={formData.discountCode}
                                onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                            />
                            <button
                                type="button"
                                className="bg-[#E2E8F0] px-4 py-2 rounded-xl text-sm font-bold border-2 border-[#FFA048] active:scale-95 transition-all"
                            >
                                ใช้งาน
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold mb-2 ml-1">ช่องทางการชำระเงิน</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setPaymentMethod('promptpay')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all border-2 ${paymentMethod === 'promptpay' ? 'bg-[#E0F7F1] border-[#FFA048]' : 'bg-white border-transparent'}`}
                            >
                                <QrCode className={`w-6 h-6 ${paymentMethod === 'promptpay' ? 'text-[#FFA048]' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-bold">PROMPTPAY</span>
                            </div>
                            <div
                                onClick={() => setPaymentMethod('card')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all border-2 ${paymentMethod === 'card' ? 'bg-[#E0F7F1] border-[#FFA048]' : 'bg-white border-transparent'}`}
                            >
                                <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#FFA048]' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-bold">CREDIT CARD</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total and Submit */}
                <div className="pt-4 space-y-4">
                    {qrCodeUrl && (
                        <div className="bg-white p-4 rounded-3xl shadow-inner flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                            <img src={qrCodeUrl} alt="PromptPay QR" className="w-48 h-48" />
                            <p className="text-[10px] font-bold text-slate-400">สแกนเพื่อชำระเงิน {calculateTotal().toFixed(2)} บาท</p>
                        </div>
                    )}

                    <div className="bg-white/50 p-3 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600">วอลเปเปอร์หลัก</span>
                            <span className="font-bold">{(selectedWp?.price || 0).toFixed(2)} บาท</span>
                        </div>
                        {selectedOfferings.length > 0 && selectedWp?.offerings && (
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-amber-600">ของถวาย ({selectedOfferings.length} รายการ)</span>
                                <span className="font-bold text-amber-600">
                                    +{selectedWp.offerings
                                        .filter(o => selectedOfferings.includes(o.id))
                                        .reduce((sum, o) => sum + o.price, 0)
                                        .toFixed(2)} บาท
                                </span>
                            </div>
                        )}
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                            <span className="font-bold text-base">ยอดรวมทั้งหมด</span>
                            <span className="text-xl font-bold text-[#FFA048]">{calculateTotal().toFixed(2)} บาท</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="bg-white border-2 border-slate-200 py-3 px-6 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            ดูตัวอย่าง
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#FFA048]/30 border-2 border-[#FFA048] py-3 rounded-2xl font-bold text-lg active:scale-[0.98] transition-all hover:bg-[#FFA048]/40 disabled:opacity-50"
                        >
                            {isSubmitting ? 'กำลังดำเนินการ...' : (qrCodeUrl ? 'ตรวจสอบการชำระเงิน' : 'ตกลง')}
                        </button>
                    </div>

                    {message && (
                        <p className={`text-center text-xs font-bold animate-pulse ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-orange-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>

            {/* Preview Modal Overlay */}
            {showPreview && selectedWp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm flex flex-col items-center gap-6 py-10">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-0 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center space-y-2 mb-2">
                            <h3 className="text-white text-xl font-bold">วอลเปเปอร์ของคุณพร้อมแล้ว!</h3>
                            <p className="text-white/60 text-xs">ตัวอย่างวอลเปเปอร์บนเครื่องผู้ใช้งาน</p>
                        </div>

                        {/* iPhone Mockup */}
                        <div className="scale-[0.85] md:scale-100 origin-top">
                            <PhoneMockup
                                wallpaperUrl={selectedWp.downloadUrl || selectedWp.imageUrl}
                                title={formData.displayedName || selectedWp.title}
                                subtitle={selectedWp.title}
                                dayOfWeek={formData.dayOfWeek}
                                zodiac={formData.zodiac}
                                showWatermark={true}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full max-w-[280px]">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="w-full bg-gold-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-primary/20 hover:bg-gold-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                ตกลง
                            </button>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="w-full bg-white/10 text-white font-bold py-3 rounded-2xl hover:bg-white/20 transition-all text-sm border border-white/10"
                            >
                                กลับหน้าหลัก
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
