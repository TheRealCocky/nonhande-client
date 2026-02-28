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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full sm:max-w-[420px] bg-card border-t sm:border border-border rounded-t-[40px] sm:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-500 flex flex-col max-h-[95dvh]">

                {/* Handle Mobile - Shrink 0 (Nunca encolhe) */}
                <div className="shrink-0 w-12 h-1.5 bg-border rounded-full mx-auto mt-4 mb-2 sm:hidden opacity-30" />

                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-muted-foreground z-20">
                    <X size={22} />
                </button>

                {/* Área de Conteúdo - Flex-1 e Overflow-Auto (Este é o segredo) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pt-8 pb-6 flex flex-col">
                    <div className="flex flex-col items-center text-center">
                        <div className="shrink-0 w-16 h-16 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mb-6">
                            <Video size={32} strokeWidth={2.5} />
                        </div>

                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Entrar na Sala</h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Introduza o ID da Transmissão</p>
                        </div>

                        <div className="w-full space-y-4">
                            <input
                                type="text"
                                placeholder="0000-0000-0000-0000"
                                className={`w-full bg-background border-2 p-5 rounded-[20px] outline-none text-center font-mono text-sm uppercase transition-all ${
                                    error ? 'border-red-500' : 'border-border focus:border-gold'
                                }`}
                                value={id}
                                onChange={(e) => { setId(e.target.value); setError(null); }}
                            />
                            {error && (
                                <div className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-tight">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Fixo no Modal - Shrink 0 */}
                <div className="shrink-0 px-8 pb-10 sm:pb-8 pt-2">
                    <button
                        onClick={() => {
                            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                            if (!id.trim()) return setError("O ID é obrigatório.");
                            if (!uuidRegex.test(id.trim())) return setError("ID Inválido.");
                            onJoin(id.trim());
                        }}
                        className="w-full bg-foreground text-background py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.3em] active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                    >
                        Aceder Sala <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}