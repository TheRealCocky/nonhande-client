'use client';

import { X, Video, AlertCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface JoinRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (id: string) => void;
}

export default function JoinRoomModal({ isOpen, onClose, onJoin }: JoinRoomModalProps) {
    const [id, setId] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Bloqueia o scroll do fundo quando o modal abre
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const validateAndJoin = () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const cleanId = id.trim();

        if (!cleanId) {
            setError("O ID é obrigatório.");
            return;
        }
        if (!uuidRegex.test(cleanId)) {
            setError("Formato de ID inválido.");
            return;
        }
        onJoin(cleanId);
    };

    return (
        <div className="fixed inset-0 z-[999] bg-background flex flex-col sm:justify-center sm:items-center">

            {/* Header do Modal - Ocupa o topo no Mobile */}
            <div className="w-full flex items-center justify-between px-6 py-6 sm:hidden border-b border-border/10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Nonhande Live</span>
                <button onClick={onClose} className="p-2 bg-secondary rounded-full active:scale-75 transition-all">
                    <X size={20} />
                </button>
            </div>

            {/* Contentor Principal: Full screen no mobile, Card no Desktop */}
            <div className="flex-1 sm:flex-none w-full sm:max-w-[450px] sm:bg-card sm:border sm:border-border sm:rounded-[48px] sm:p-12 p-8 flex flex-col justify-center relative">

                {/* Botão fechar apenas para Desktop */}
                <button
                    onClick={onClose}
                    className="hidden sm:flex absolute top-8 right-8 p-2 text-muted-foreground hover:text-foreground transition-all"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-gold/10 rounded-[32px] flex items-center justify-center text-gold shadow-2xl shadow-gold/20">
                        <Video size={40} strokeWidth={2.5} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Aceder à Aula</h2>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60 px-4">
                            Introduza o código fornecido pelo instrutor para entrar na transmissão.
                        </p>
                    </div>

                    <div className="w-full pt-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gold tracking-[0.3em] flex justify-center">ID da Sala</label>
                            <input
                                type="text"
                                placeholder="0000-0000-0000-0000"
                                className={`w-full bg-secondary/30 border-2 p-6 rounded-[24px] outline-none text-center font-mono text-sm uppercase tracking-widest transition-all ${
                                    error ? 'border-red-500' : 'border-border focus:border-gold focus:bg-background'
                                }`}
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    if (error) setError(null);
                                }}
                            />
                            {error && (
                                <div className="flex items-center justify-center gap-2 text-red-500 animate-pulse">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-black uppercase">{error}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={validateAndJoin}
                            disabled={!id}
                            className="w-full bg-gold text-white py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(212,175,55,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale"
                        >
                            Confirmar Entrada
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Footer fixo no fundo apenas no Mobile */}
                <div className="mt-auto pt-10 sm:hidden">
                    <p className="text-center text-[9px] text-muted-foreground font-black uppercase tracking-[0.5em] opacity-30">
                        Segurança Nonhande • Angola
                    </p>
                </div>
            </div>
        </div>
    );
}