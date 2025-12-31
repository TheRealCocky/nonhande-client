'use client';

import React from 'react';

export default function WordSkeleton() {
    return (
        <div className="w-full h-[62px] bg-card-custom/5 border border-platinum/10 rounded-[18px] px-4 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="w-9 h-9 rounded-full bg-platinum/10 animate-pulse flex-shrink-0" />
            <div className="h-5 w-24 bg-platinum/20 rounded animate-pulse" />
            <div className="h-[1px] flex-1 bg-platinum/5" />
            <div className="h-4 w-32 bg-platinum/10 rounded animate-pulse" />
        </div>
    );
}