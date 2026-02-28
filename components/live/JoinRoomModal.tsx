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

    const validateAndJoin = () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const cleanId = id.trim();

        if (!cleanId) {
            setError("O ID é obrigatório.");
            return;
        }
        if (!uuidRegex.test(cleanId)) {
            setError("ID Inválido.");
            return;
        }
        onJoin(cleanId);
    };

    return (
        <div className="fixed inset-0 z-[999] flex flex-col justify-end sm:justify-center items-center">
            {/* Backdrop com desfoque progressivo */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card: No mobile desliza de baixo (Bottom Sheet), no Desktop é centralizado */}
            <div className="relative w-full sm:max-w-md bg-card border-t sm:border border-border rounded-t-[40px] sm:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 ease-out flex flex-col max-h-[92dvh] sm:max-h-fit overflow-hidden">

                {/* Indicador visual de "Puxar" no mobile (estilo nativo) */}
                <div className="shrink-0 w-12 h-1.5 bg-border rounded-full mx-auto mt-4 mb-2 sm:hidden opacity-40" />

                {/* Botão de Fechar Lateral */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-muted-foreground hover:bg-secondary rounded-full transition-all z-10"
                >
                    <X size={22} />
                </button>

                {/* Conteúdo com Scroll Interno caso o teclado suba */}
                <div className="overflow-y-auto px-8 pb-10 pt-10 sm:p-12">
                    <div className="flex flex-col items-center text-center">
                        {/* Icone com animação de brilho */}
                        <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6 relative shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                            <Video size={32} strokeWidth={2.5} />
                            <div className="absolute inset-0 rounded-2xl border border-gold/20 animate-pulse" />
                        </div>

                        <div className="space-y-2 mb-10">
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                Círculo de <span className="text-gold">Live</span>
                            </h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
                                Introduza o ID da Transmissão
                            </p>
                        </div>

                        {/* Formulário */}
                        <div className="w-full space-y-6">
                            <div className="space-y-3">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="0000-0000-0000-0000"
                                        className={`w-full bg-background border-2 p-5 rounded-[20px] outline-none text-center font-mono text-sm uppercase tracking-widest transition-all appearance-none ${
                                            error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border focus:border-gold'
                                        }`}
                                        value={id}
                                        onChange={(e) => {
                                            setId(e.target.value);
                                            if (error) setError(null);
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center justify-center gap-2 text-red-500 animate-in fade-in zoom-in-95">
                                        <AlertCircle size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={validateAndJoin}
                                disabled={!id}
                                className="w-full bg-foreground text-background py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.3em] active:scale-[0.97] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-10 group"
                            >
                                Validar Sala
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex flex-col items-center gap-2 pt-4">
                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-30">
                                    Sistema Nonhande v2.0
                                </span>
                                <div className="h-1 w-12 bg-gold/30 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}