import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-cream-dark pt-16 pb-8 border-t border-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center mb-4">
                            <span className="font-sarabun font-bold text-2xl text-gold-dark tracking-wider">
                                MUTELU<span className="text-gold">WALLPAPER</span>
                            </span>
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            เสริมดวงชะตาและสไตล์ของคุณด้วยวอลเปเปอร์มงคลระดับพรีเมียม ออกแบบตามหลักโหราศาสตร์สากลและไทย
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gold-dark hover:text-gold transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gold-dark hover:text-gold transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gold-dark hover:text-gold transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">สินค้า</h3>
                        <ul className="space-y-3">
                            <li><Link href="/products" className="text-gray-600 hover:text-gold transition-colors text-sm">วอลเปเปอร์ทั้งหมด</Link></li>
                            <li><Link href="/#new-arrivals" className="text-gray-600 hover:text-gold transition-colors text-sm">มาใหม่</Link></li>
                            <li><Link href="/#top-products" className="text-gray-600 hover:text-gold transition-colors text-sm">ขายดีที่สุด</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">ช่วยเหลือ</h3>
                        <ul className="space-y-3">
                            <li><Link href="/faq" className="text-gray-600 hover:text-gold transition-colors text-sm">คำถามที่พบบ่อย</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-gold transition-colors text-sm">ติดต่อเรา</Link></li>
                            <li><Link href="/privacy" className="text-gray-600 hover:text-gold transition-colors text-sm">นโยบายความเป็นส่วนตัว</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">ติดตามข่าวสาร</h3>
                        <p className="text-gray-600 text-sm mb-4">รับข่าวสารและโปรโมชั่นพิเศษก่อนใคร</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="ใส่อีเมลของคุณ"
                                className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:border-gold"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-gold hover:bg-gold-dark focus:outline-none transition-colors"
                            >
                                ติดตาม
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gold/20 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Mutelu Wallpaper. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0">
                        {/* Payment icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
