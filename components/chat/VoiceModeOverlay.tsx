'use client';

import React, { useEffect } from 'react';
import { X, AudioLines, Mic, MicOff, Square } from 'lucide-react';

interface VoiceModeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    agentName: string;
    isRecording: boolean;
    toggleRecording: () => void;
    // ✨ Nova prop para silenciar a IA
    onStopSpeaking?: () => void;
}

export const VoiceModeOverlay = ({
                                     isOpen,
                                     onClose,
                                     isLoading,
                                     agentName,
                                     isRecording,
                                     toggleRecording,
                                     onStopSpeaking
                                 }: VoiceModeOverlayProps) => {

    // Efeito para ativar mic ao abrir
    useEffect(() => {
        if (isOpen && !isRecording) {
            toggleRecording();
        }
    }, [isOpen]);

    // ✨ Função interna para garantir que o áudio para
    const handleStopAI = () => {
        window.speechSynthesis.cancel();
        if (onStopSpeaking) onStopSpeaking();
    };

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

            {/* 2. AVATAR CENTRAL COM GLOW DINÂMICO */}
            <div className="relative group">
                {/* Glow de gravação */}
                <div className={`absolute inset-0 bg-gold/20 rounded-full blur-[80px] transition-all duration-700 ${isRecording ? 'animate-pulse opacity-100' : 'opacity-0'}`} />

                <div className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full border flex flex-col items-center justify-center bg-card-custom shadow-2xl transition-all duration-500 ${
                    isRecording ? 'border-gold/50 shadow-gold/20' : 'border-border-custom'
                }`}>
                    {isLoading ? (
                        /* ✨ BOTÃO DE INTERRUPÇÃO: Aparece quando a IA está a processar/falar */
                        <button
                            onClick={handleStopAI}
                            className="flex flex-col items-center gap-2 group/stop"
                        >
                            <div className="relative">
                                <AudioLines size={60} className="text-gold animate-pulse group-hover/stop:opacity-0 transition-opacity" />
                                <Square size={40} className="absolute inset-0 m-auto text-red-500 opacity-0 group-hover/stop:opacity-100 transition-opacity" fill="currentColor" />
                            </div>
                            <span className="text-[10px] font-black text-red-500 animate-bounce">INTERROMPER</span>
                        </button>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Mic size={60} className={isRecording ? 'text-gold' : 'text-foreground/20'} />
                        </div>
                    )}
                </div>
            </div>

            {/* 3. INFO STATUS */}
            <div className="mt-12 text-center px-6">
                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-gold">
                    {agentName.replace('_', ' ')}
                </h2>
                <p className="mt-4 text-foreground/40 text-[10px] font-bold tracking-[0.2em] uppercase italic">
                    {isLoading ? "A IA está a falar... clica para calar" : isRecording ? "Pode falar, mestre..." : "Microfone em pausa"}
                </p>
            </div>

            {/* 4. ONDAS SONORAS (Só mexem se estiver a gravar e IA em silêncio) */}
            <div className="mt-16 flex items-end gap-1.5 h-16">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                        key={i}
                        className={`w-1.5 bg-gold rounded-full transition-all duration-500 ${
                            isRecording && !isLoading ? 'animate-bounce' : 'h-[10%]'
                        }`}
                        style={{
                            height: (isRecording && !isLoading) ? `${30 + (i * 7) % 50}%` : '10%',
                            opacity: isRecording ? (0.2 + (i * 0.08)) : 0.1,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.8 + (i * 0.1)}s`
                        }}
                    />
                ))}
            </div>

            {/* 5. CONTROLOS DE FUNDO */}
            <div className="mt-20 flex items-center gap-6">
                <button
                    onClick={toggleRecording}
                    className={`p-6 rounded-full transition-all ${
                        isRecording ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gold text-black'
                    }`}
                >
                    {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                {/* ✨ BOTÃO DE EMERGÊNCIA: Sempre visível para calar a IA se necessário */}
                <button
                    onClick={handleStopAI}
                    className="p-6 rounded-full bg-white/5 text-foreground/20 hover:text-red-500 transition-all border border-border-custom/20"
                >
                    <Square size={24} />
                </button>

                <button
                    onClick={onClose}
                    className="px-10 py-4 rounded-full bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em]"
                >
                    Encerrar
                </button>
            </div>
        </div>
    );
};