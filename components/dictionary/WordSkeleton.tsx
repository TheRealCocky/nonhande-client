'use client';

import React from 'react';

export default function WordSkeleton({ index = 0 }: { index?: number }) {
    return (
        <div
            className="w-full h-[70px] bg-card-custom border border-platinum/30 rounded-[22px] px-6 flex items-center gap-4 relative overflow-hidden shadow-md"
            style={{
                animationDelay: `${index * 0.05}s`,
            }}
        >
            {/* O "Brilho" que atravessa o card - Agora com mais opacidade */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-platinum/20 to-transparent z-10" />

            {/* Ícone (Círculo) - Mais escuro/nítido */}
            <div className="w-10 h-10 rounded-full bg-platinum/40 animate-pulse flex-shrink-0" />

            {/* Texto do Termo - Mais largo e nítido */}
            <div className="h-5 w-32 bg-platinum/50 rounded-lg animate-pulse" />

            {/* Linha de preenchimento central */}
            <div className="h-[1px] flex-1 bg-platinum/20" />

            {/* Significado - Mais nítido */}
            <div className="h-4 w-28 bg-platinum/30 rounded-md animate-pulse" />
        </div>
    );
}