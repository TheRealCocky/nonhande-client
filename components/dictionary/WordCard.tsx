'use client';

import React from 'react';
import { Volume2, ChevronRight, Lock } from 'lucide-react';
import { WordResponse } from '@/services/api';

interface WordCardProps {
    word: WordResponse;
    isLocked: boolean;
    onAction: (e: React.MouseEvent) => void;
    onPlayAudio: (e: React.MouseEvent, url: string) => void;
}

export default function WordCard({ word, isLocked, onAction, onPlayAudio }: WordCardProps) {
    return (
        <div
            onClick={onAction}
            className="group relative w-full bg-card-custom border border-platinum/20 rounded-[18px] px-4 py-3 hover:border-gold/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer overflow-hidden flex items-center gap-4"
        >
            {/* 1. ÁUDIO */}
            <div className="flex-shrink-0">
                {word.audioUrl ? (
                    <button
                        onClick={(e) => onPlayAudio(e, word.audioUrl!)}
                        className="w-9 h-9 rounded-full bg-foreground/5 text-foreground/70 flex items-center justify-center hover:bg-gold hover:text-white transition-all active:scale-90"
                    >
                        <Volume2 size={14} />
                    </button>
                ) : (
                    <div className="w-9 h-9" />
                )}
            </div>

            {/* 2. CONTEÚDO (Word + Significado) */}
            <div className="flex-1 flex items-baseline gap-4 min-w-0">
                <h2 className="text-base md:text-lg font-black text-foreground group-hover:text-gold transition-colors tracking-tighter italic uppercase whitespace-nowrap">
                    {word.term}
                </h2>

                {/* Separador sutil que combina com o Skeleton */}
                <div className="h-[1px] flex-1 bg-platinum/10 min-w-[20px] hidden md:block" />

                {/* Significado: Mais Bold e Cinza (Silver-dark) */}
                <p className="text-silver-dark text-xs md:text-sm font-bold italic truncate max-w-[50%]">
                    {word.meaning}
                </p>
            </div>

            {/* 3. STATUS */}
            <div className="flex-shrink-0 flex items-center gap-2">
                {isLocked ? (
                    <Lock size={12} className="text-gold/30" />
                ) : (
                    <ChevronRight size={16} className="text-silver-dark opacity-0 group-hover:opacity-100 transition-all" />
                )}
            </div>

            {/* Detalhe lateral de status */}
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors ${isLocked ? 'bg-platinum/20' : 'bg-gold/40 group-hover:bg-gold'}`} />
        </div>
    );
}