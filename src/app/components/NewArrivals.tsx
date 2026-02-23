"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NewArrivals() {
    const { data: wallpapers, isLoading } = useSWR('/api/wallpapers?isNew=true', fetcher);

    return (
        <section className="py-16 bg-white" id="new-arrivals">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-gold-dark font-medium uppercase tracking-wider text-sm">สินค้าใหม่</span>
                        <h2 className="text-3xl font-sarabun font-bold text-gray-900 mt-2">มาใหม่</h2>
                    </div>
                    <Link href="/products" className="group flex items-center gap-2 text-gold-dark font-medium hover:text-gold transition-colors">
                        ดูทั้งหมด <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
                    ) : Array.isArray(wallpapers) && wallpapers.length > 0 ? (
                        wallpapers.slice(0, 4).map((product: any) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                price={product.price}
                                image={product.imageUrl}
                                category={product.category?.name || "New"}
                                isOffering={product.isOffering}
                            />
                        ))
                    ) : (
                        [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
                    )}
                    {!isLoading && (!wallpapers || wallpapers.length === 0) && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            ติดตามคอลเลกชันใหม่เร็วๆ นี้
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
