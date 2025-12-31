'use client';

import React from 'react';

export default function WordSkeleton() {
    return (
        <div className="w-full h-[66px] bg-card-custom border border-platinum/20 rounded-[20px] px-5 flex items-center gap-4 relative overflow-hidden shadow-sm">

            {/* Efeito Shimmer - Aumentada a opacidade para ser mais visível */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-platinum/10 to-transparent" />

            {/* Ícone do Áudio (Círculo) - Mais nítido */}
            <div className="w-10 h-10 rounded-full bg-platinum/30 animate-pulse flex-shrink-0" />

            {/* Termo Nativo - Cor mais forte */}
            <div className="h-6 w-28 bg-platinum/40 rounded-lg animate-pulse" />

            {/* Linha Divisória - Agora visível */}
            <div className="h-[2px] flex-1 bg-platinum/10 mx-2" />

            {/* Significado/Tradução */}
            <div className="h-4 w-36 bg-platinum/25 rounded-md animate-pulse" />

        </div>
    );
}