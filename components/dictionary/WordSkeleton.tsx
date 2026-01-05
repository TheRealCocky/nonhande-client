'use client';

import React from 'react';

export default function WordSkeleton({ index = 0 }: { index?: number }) {
    return (
        <div
            className="w-full h-[66px] bg-card-custom/50 border border-border-custom/40 rounded-[20px] px-5 flex items-center gap-4 relative overflow-hidden shadow-sm"
            style={{
                animationDelay: `${index * 0.05}s`,
            }}
        >
            {/* Shimmer - Efeito de luz mais suave e natural */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-platinum/5 to-transparent z-10" />

            {/* Círculo do Áudio - Mais "limpo" */}
            <div className="w-10 h-10 rounded-full bg-border-custom/50 animate-pulse flex-shrink-0" />

            {/* Termo Nativo - Mais definido */}
            <div className="h-5 w-24 bg-border-custom/80 rounded-lg animate-pulse" />

            {/* Linha Divisória - Quase invisível mas presente */}
            <div className="h-[1px] flex-1 bg-border-custom/20 mx-2" />

            {/* Significado/Tradução - Mais suave */}
            <div className="h-4 w-32 bg-border-custom/40 rounded-md animate-pulse" />
        </div>
    );
}