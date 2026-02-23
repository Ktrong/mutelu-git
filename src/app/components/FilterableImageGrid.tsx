"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import { useCategories, useWallpapers } from "@/lib/hooks";

const FilterableImageGrid = () => {
    const { categories, isLoading: isCategoriesLoading } = useCategories();
    // Use 'All' as default, matching the hook's expectation
    const [selectedCategoryId, setSelectedCategoryId] = useState("All");
    const { wallpapers, isLoading: isWallpapersLoading } = useWallpapers(selectedCategoryId);

    // Initial loading state for categories
    if (isCategoriesLoading && !categories) {
        return (
            <section className="py-16 bg-cream-light/50" id="products">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Prepare categories list with "All" option
    const categoriesList = Array.isArray(categories) ? categories : [];
    const allCategories = [{ id: 'All', name: 'ทั้งหมด' }, ...categoriesList];

    return (
        <section className="py-16 bg-cream-light/50" id="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-sarabun font-bold text-gray-900 mb-4">คอลเลกชันแนะนำ</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        เลือกพลังงานที่คุณต้องการดึงดูด วอลเปเปอร์ทุกชิ้นสร้างสรรค์ด้วยความตั้งใจ
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {allCategories.map((category: any) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategoryId(category.id)}
                            className={`px-6 py-2 rounded-full text-sm font-sarabun font-medium transition-all duration-300 ${selectedCategoryId === category.id
                                ? "bg-gold text-white shadow-md transform scale-105"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isWallpapersLoading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)
                    ) : (
                        wallpapers?.length > 0 ? (
                            wallpapers.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    image={product.imageUrl}
                                    category={product.category?.name || "General"}
                                    isOffering={product.isOffering}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500 font-sarabun">
                                ไม่พบวอลเปเปอร์ในหมวดหมู่นี้
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default FilterableImageGrid;
