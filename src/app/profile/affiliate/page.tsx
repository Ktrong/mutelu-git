"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import Link from 'next/link';

export default function AffiliateApplicationPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        phoneNumber: '',
        socialLinks: '',
        address: '',
        idCardNumber: '',
        bankName: '',
        bankAccountNo: '',
        bankAccountName: ''
    });

    const [idCardImage, setIdCardImage] = useState<File | null>(null);
    const [bankPassbookImage, setBankPassbookImage] = useState<File | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                checkExistingApplication(parsedUser.id);
            } else {
                window.location.href = '/auth/login?redirect=/profile/affiliate';
            }
        }
    }, []);

    const checkExistingApplication = async (userId: string) => {
        try {
            const res = await fetch(`/api/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.user?.affiliateApplication) {
                    setSuccess(true);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'bank') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'id') setIdCardImage(e.target.files[0]);
            if (type === 'bank') setBankPassbookImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!idCardImage || !bankPassbookImage) {
            setError('กรุณาอัปโหลดรูปภาพบัตรประชาชนและสมุดบัญชีธนาคาร');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const data = new FormData();
            data.append('userId', user.id);
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            data.append('idCardImage', idCardImage);
            data.append('bankPassbookImage', bankPassbookImage);

            const res = await fetch('/api/profile/affiliate-application', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const result = await res.json();
                setError(result.error || 'เกิดข้อผิดพลาดในการสมัคร กรุณาลองใหม่อีกครั้ง');
            }
        } catch (err) {
            console.error(err);
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <main className="min-h-screen bg-var-bg pb-24 pt-[80px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="pb-24">
                <div className="px-4 max-w-xl mx-auto pt-10">
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg text-center border border-gold-light/20">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">ส่งใบสมัครเรียบร้อยแล้ว</h2>
                        <p className="text-slate-500 mb-8">
                            ระบบได้รับข้อมูลการสมัครตัวแทนจำหน่ายของคุณแล้ว กรุณารอการตรวจสอบและอนุมัติจากผู้ดูแลระบบ ภายใน 1-2 วันทำการ
                        </p>
                        <Link href="/profile" className="inline-block bg-slate-800 text-white font-bold px-8 py-3 rounded-full hover:bg-slate-700 transition-colors shadow-md">
                            กลับสู่หน้าโปรไฟล์
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="pb-24">

            <div className="px-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6 mt-4">
                    <Link href="/profile" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">สมัครตัวแทนจำหน่าย (Affiliate)</h1>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gold-light/20 shadow-xl relative overflow-hidden">
                    <p className="text-sm text-slate-500 mb-6">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง เพื่อใช้ในการพิจารณาและโอนเงินค่าคอมมิชชั่นให้กับคุณ</p>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* 1. ข้อมูลส่วนตัวและติดต่อ */}
                        <div>
                            <h3 className="text-lg font-bold text-gold-secondary mb-4 flex items-center gap-2">
                                <span className="bg-gold-light text-gold-secondary w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                ข้อมูลการติดต่อ
                            </h3>
                            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                                    <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="08X-XXX-XXXX" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">ช่องทางโซเชียลมีเดีย (Facebook, IG, TikTok, ฯลฯ)</label>
                                    <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="วางลิงก์โปรไฟล์ของคุณ" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">ที่อยู่ปัจจุบัน <span className="text-red-500">*</span></label>
                                    <textarea name="address" required value={formData.address} onChange={handleInputChange} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* 2. ข้อมูลยืนยันตัวตน */}
                        <div>
                            <h3 className="text-lg font-bold text-gold-secondary mb-4 flex items-center gap-2">
                                <span className="bg-gold-light text-gold-secondary w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                ข้อมูลยืนยันตัวตน
                            </h3>
                            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">เลขประจำตัวประชาชน (13 หลัก) <span className="text-red-500">*</span></label>
                                    <input type="text" name="idCardNumber" required maxLength={13} value={formData.idCardNumber} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="X-XXXX-XXXXX-XX-X" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">รูปถ่ายหน้าบัตรประชาชน <span className="text-red-500">*</span></label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden">
                                        <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'id')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {idCardImage ? (
                                            <p className="text-sm font-bold text-emerald-600 line-clamp-1">{idCardImage.name}</p>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Upload className="w-6 h-6 mb-2" />
                                                <span className="text-xs">คลิกหรือลากไฟล์มาวางที่นี่</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">ไฟล์ JPEG, PNG ขนาดไม่เกิน 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. ข้อมูลบัญชีรับเงิน */}
                        <div>
                            <h3 className="text-lg font-bold text-gold-secondary mb-4 flex items-center gap-2">
                                <span className="bg-gold-light text-gold-secondary w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                ข้อมูลบัญชีรับเงิน (สำหรับรับค่าคอมมิชชั่น)
                            </h3>
                            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">ธนาคาร <span className="text-red-500">*</span></label>
                                    <input type="text" name="bankName" required value={formData.bankName} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="เช่น กสิกรไทย, ไทยพาณิชย์" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">เลขที่บัญชี <span className="text-red-500">*</span></label>
                                        <input type="text" name="bankAccountNo" required value={formData.bankAccountNo} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="XXXXXXXXXX" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">ชื่อบัญชี <span className="text-red-500">*</span></label>
                                        <input type="text" name="bankAccountName" required value={formData.bankAccountName} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="ชื่อ-นามสกุล ที่ตรงกับบัตรประชาชน" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">รูปถ่ายหน้าแรกสมุดบัญชี <span className="text-red-500">*</span></label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden">
                                        <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'bank')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {bankPassbookImage ? (
                                            <p className="text-sm font-bold text-emerald-600 line-clamp-1">{bankPassbookImage.name}</p>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Upload className="w-6 h-6 mb-2" />
                                                <span className="text-xs">คลิกหรือลากไฟล์มาวางที่นี่</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">ไฟล์ JPEG, PNG ขนาดไม่เกิน 5MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-800 text-white font-bold py-4 rounded-full text-base hover:bg-slate-700 transition-colors shadow-lg shadow-slate-800/20 disabled:opacity-70 flex items-center justify-center"
                            >
                                {submitting ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "ส่งใบสมัครตัวแทนจำหน่าย"
                                )}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-4">
                                การส่งใบสมัครถือว่าคุณยอมรับเงื่อนไขและข้อตกลงในการเป็นตัวแทนจำหน่ายของเราแล้ว
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
