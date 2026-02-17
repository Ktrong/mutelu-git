"use client";

import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-cream selection:bg-gold-light pb-20 pt-20">
            <section className="text-center mb-12 px-4 mt-8">
                <h1 className="text-4xl md:text-5xl font-sarabun font-bold text-gray-900 mb-4 tracking-tight">
                    ติดต่อเรา
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                    หากมีข้อสงสัยหรือต้องการคำแนะนำเพิ่มเติม สามารถติดต่อเราได้ผ่านช่องทางด้านล่าง
                </p>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gold/10 h-full">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลติดต่อ</h3>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-cream-dark p-3 rounded-full text-gold-dark">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">อีเมล</h4>
                                        <p className="text-gray-600">support@iucrative.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-cream-dark p-3 rounded-full text-gold-dark">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">เบอร์โทรศัพท์</h4>
                                        <p className="text-gray-600">02-123-4567</p>
                                        <p className="text-sm text-gray-500">(จันทร์ - ศุกร์, 09:00 - 18:00)</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-cream-dark p-3 rounded-full text-gold-dark">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">ที่อยู่</h4>
                                        <p className="text-gray-600">
                                            123 อาคารมูเตลู ชั้น 9<br />
                                            เขตปทุมวัน กรุงเทพมหานคร 10330
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h4 className="font-bold text-gray-800 mb-4">ติดตามเรา</h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-gold hover:border-gold transition-all">
                                        <Facebook size={20} />
                                    </a>
                                    <a href="#" className="p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-gold hover:border-gold transition-all">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="#" className="p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-gold hover:border-gold transition-all">
                                        <Twitter size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient"></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 rounded-xl bg-cream-light/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                        placeholder="ชื่อของคุณ"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 rounded-xl bg-cream-light/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                        placeholder="อีเมลของคุณ"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
                                <select
                                    id="subject"
                                    className="w-full px-4 py-3 rounded-xl bg-cream-light/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all appearance-none"
                                >
                                    <option value="">เลือกหัวข้อติดต่อ</option>
                                    <option value="order">ติดตามคำสั่งซื้อ</option>
                                    <option value="custom">สอบถามบริการวอลเปเปอร์สั่งทำ</option>
                                    <option value="issue">แจ้งปัญหาการใช้งาน</option>
                                    <option value="other">อื่นๆ</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">ข้อความ</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-cream-light/50 border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none"
                                    placeholder="พิมพ์ข้อความของคุณที่นี่..."
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <Send size={20} />
                                ส่งข้อความ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
