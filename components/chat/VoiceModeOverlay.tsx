'use client';

import React from 'react';
import { X, AudioLines } from 'lucide-react';

interface VoiceModeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    agentName: string;
}

export const VoiceModeOverlay = ({ isOpen, onClose, isLoading, agentName }: VoiceModeOverlayProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-300">

            {/* 1. BOTÃO FECHAR */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-4 rounded-full bg-card-custom border border-border-custom text-foreground/50 hover:text-gold transition-all"
            >
                <X size={28} />
            </button>

            {/* 2. AVATAR CENTRAL COM GLOW */}
            <div className="relative group">
                {/* Efeito de Brilho de Fundo */}
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-[80px] group-hover:bg-gold/30 transition-all duration-700" />

                <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border border-gold/30 flex items-center justify-center bg-card-custom shadow-[0_0_60px_rgba(212,175,55,0.15)]">
                    <AudioLines
                        size={60}
                        className={`text-gold md:size-20 ${isLoading ? 'animate-pulse' : 'animate-glow-gold'}`}
                    />
                </div>
            </div>

            {/* 3. INFO STATUS */}
            <div className="mt-12 text-center">
                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-gold">
                    {agentName.replace('_', ' ')}
                </h2>
                <p className="mt-4 text-foreground/40 text-sm font-medium tracking-widest uppercase italic">
                    {isLoading ? "A processar sabedoria..." : "Podes falar, mestre..."}
                </p>
            </div>

            {/* 4. ONDAS SONORAS DINÂMICAS */}
            <div className="mt-16 flex items-end gap-1.5 h-16">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 bg-gold rounded-full transition-all duration-500"
                        style={{
                            /* Se estiver a carregar, fica baixo. Se não, simula movimento */
                            height: isLoading ? '20%' : `${30 + Math.random() * 70}%`,
                            opacity: 0.2 + (i * 0.08),
                        }}
                    />
                ))}
            </div>
        </div>
    );
};