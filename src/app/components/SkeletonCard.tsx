import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gold/10 animate-pulse">
            {/* Image Placeholder */}
            <div className="h-64 bg-cream-dark/30 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>

            {/* Content Placeholder */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-cream-dark/30 rounded w-2/3"></div>
                    <div className="h-4 bg-cream-dark/30 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-cream-dark/20 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gold/20 rounded-full w-1/3"></div>
                    <div className="h-8 w-8 bg-cream-dark/20 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
