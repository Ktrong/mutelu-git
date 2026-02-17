import HeroSection from "./components/HeroSection";
import FilterableImageGrid from "./components/FilterableImageGrid";
import NewArrivals from "./components/NewArrivals";
import PopularProducts from "./components/PopularProducts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-cream selection:bg-gold-light pb-20">
            <HeroSection />

            {/* New Arrivals Section */}
            <NewArrivals />

            {/* Popular Products */}
            <PopularProducts />

            {/* Top Products / Filterable Grid */}
            <FilterableImageGrid />

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 gold-bg opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-sarabun font-bold text-gray-900 mb-6">
                        ไม่เจอวอลเปเปอร์ที่ถูกใจใช่ไหม?
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                        ออกแบบวอลเปเปอร์มงคลเฉพาะตัวคุณ ตามดวงชะตาและเป้าหมายของคุณ
                    </p>
                    <Link href="/astrology">
                        <button className="px-10 py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-pulse">
                            สร้างวอลเปเปอร์ของคุณเอง
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
