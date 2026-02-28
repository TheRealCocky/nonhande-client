'use client';

import { X, Video, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface JoinRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (id: string) => void;
}

export default function JoinRoomModal({ isOpen, onClose, onJoin }: JoinRoomModalProps) {
    const [id, setId] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleInputChange = (val: string) => {
        setId(val);
        if (error) setError(null);
    };

    const validateAndJoin = () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const cleanId = id.trim();

        if (!cleanId) {
            setError("O ID é obrigatório.");
            return;
        }

        if (!uuidRegex.test(cleanId)) {
            setError("ID Inválido.");
            return;
        }

        setError(null);
        onJoin(cleanId);
    };

    return (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end sm:justify-center items-center overflow-hidden">
            {/* Backdrop com Blur Premium */}
            <div
                className="absolute inset-0 bg-background/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card: Mobile-First (cola em baixo no mobile, centra no desktop) */}
            <div className="relative w-full max-w-[420px] bg-card border-t-2 sm:border-2 border-border rounded-t-[32px] sm:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-500 ease-out flex flex-col max-h-[95dvh] sm:max-h-[min(600px,90vh)]">

                {/* Handle visual para deslize mobile */}
                <div className="shrink-0 w-10 h-1 bg-border/50 rounded-full mx-auto mt-4 mb-2 sm:hidden" />

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground active:scale-75 transition-all z-20"
                >
                    <X size={22} />
                </button>

                {/* Header fixo no topo do modal */}
                <div className="shrink-0 pt-8 pb-4 px-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shadow-inner">
                        <Video size={28} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight italic">Entrar na Aula</h3>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Validar Identificador</p>
                    </div>
                </div>

                {/* Corpo do Modal com Scroll Interno Inteligente */}
                <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6 custom-scrollbar overscroll-contain">
                    <div className="space-y-3">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="0000-0000-0000-0000"
                                className={`w-full bg-background border-2 p-5 rounded-2xl outline-none text-center font-mono text-xs sm:text-sm uppercase tracking-widest transition-all appearance-none ${
                                    error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border focus:border-gold focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                                }`}
                                value={id}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-500 animate-in zoom-in-95 duration-200">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={validateAndJoin}
                        disabled={!id}
                        className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] active:scale-[0.97] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale"
                    >
                        <Video size={18} strokeWidth={3} />
                        Aceder Sala
                    </button>

                    <p className="text-center text-[8px] text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-30 pt-4 leading-relaxed">
                        Nonhande Secure Access • Luanda 2026
                    </p>
                </div>
            </div>
        </div>
    );
}