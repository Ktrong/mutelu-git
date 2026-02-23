"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import { useWallpapers } from "@/lib/hooks";

export default function PopularProducts() {
    const { wallpapers, isLoading } = useWallpapers(undefined, true);

    return (
        <section className="py-16 bg-cream-light/30 border-y border-gold/10" id="top-products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-2 mb-4 bg-white rounded-full shadow-sm">
                        <Star className="w-5 h-5 text-gold animate-spin-slow" />
                    </div>
                    <h2 className="text-3xl font-sarabun font-bold text-gray-900 mb-4">สินค้ายอดนิยม</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        วอลเปเปอร์ที่ได้รับความนิยมสูงสุด เสริมดวงปังพลังบวก
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
                    ) : (
                        wallpapers?.length > 0 ? (
                            wallpapers.slice(0, 4).map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    image={product.imageUrl}
                                    category={product.category?.name || "Popular"}
                                    isOffering={product.isOffering}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                รออัปเดตสินค้ายอดนิยม
                            </div>
                        )
                    )}
                </div>

                <div className="text-center mt-10">
                    <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold-dark font-medium rounded-full hover:bg-gold hover:text-white transition-all duration-300">
                        ดูสินค้าทั้งหมด <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
