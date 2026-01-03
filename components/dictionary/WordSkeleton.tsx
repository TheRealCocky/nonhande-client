'use client';

import React from 'react';

export default function WordSkeleton({ index = 0 }: { index?: number }) {
    return (
        <div
            className="w-full h-[66px] bg-card-custom border border-platinum/20 rounded-[20px] px-5 flex items-center gap-4 relative overflow-hidden shadow-sm"
            style={{
                animationDelay: `${index * 0.05}s`,
            }}
        >
            {/* Shimmer - Efeito de movimento */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-platinum/10 to-transparent z-10" />

            {/* Círculo do Áudio - Tamanho exato do WordCard */}
            <div className="w-10 h-10 rounded-full bg-platinum/30 animate-pulse flex-shrink-0" />

            {/* Termo Nativo */}
            <div className="h-5 w-24 bg-platinum/40 rounded-lg animate-pulse" />

            {/* Linha Divisória Central */}
            <div className="h-[1px] flex-1 bg-platinum/10 mx-2" />

            {/* Significado/Tradução */}
            <div className="h-4 w-32 bg-platinum/25 rounded-md animate-pulse" />
        </div>
    );
}