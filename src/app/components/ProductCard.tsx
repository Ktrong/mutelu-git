import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, image, category }) => {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden card-shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                {/* Placeholder for actual image if src is empty or error */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:scale-110 transition-all">
                        <Heart size={18} />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-gold hover:scale-110 transition-all">
                        <ShoppingBag size={18} />
                    </button>
                </div>

                {/* Category Tag */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-gold-dark shadow-sm">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-sarabun font-bold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-gold-dark transition-colors">
                    <Link href={`/products/${id}`}>
                        {title}
                    </Link>
                </h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gold-dark font-bold text-xl">
                        ฿{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                        ฿{(price * 1.2).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
