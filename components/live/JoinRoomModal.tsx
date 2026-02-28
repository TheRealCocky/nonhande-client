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
        <div className="fixed inset-0 z-[999] bg-background w-full h-[100dvh] flex flex-col overflow-hidden">

            {/* Header: Sempre fixo no topo */}
            <header className="shrink-0 w-full flex items-center justify-between px-6 py-6 border-b border-border/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                        <Video size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Nonhande Live</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 bg-secondary rounded-2xl active:scale-90 transition-all text-muted-foreground"
                >
                    <X size={20} />
                </button>
            </header>

            {/* Main: Scrollable para nunca cortar conteúdo com o teclado aberto */}
            <main className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center justify-center">

                <div className="w-full max-w-[400px] flex flex-col items-center space-y-8">

                    <div className="text-center space-y-3">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                            Aceder à <span className="text-gold italic">Aula</span>
                        </h2>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                            Introduza o identificador da transmissão.
                        </p>
                    </div>

                    <div className="w-full space-y-6">
                        <div className="space-y-3">
                            <input
                                type="text"
                                inputMode="text"
                                autoFocus
                                placeholder="ID: 0000-0000-0000-0000"
                                className={`w-full bg-secondary/20 border-2 p-6 rounded-[24px] outline-none text-center font-mono text-sm uppercase tracking-widest transition-all ${
                                    error ? 'border-red-500 bg-red-500/5' : 'border-border focus:border-gold focus:bg-background'
                                }`}
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    if (error) setError(null);
                                }}
                            />

                            {error && (
                                <div className="flex items-center justify-center gap-2 text-red-500 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={validateAndJoin}
                            disabled={!id}
                            className="w-full bg-gold text-white py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-20"
                        >
                            Confirmar Entrada
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="pt-4">
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.5em] opacity-30 text-center">
                            Acesso Restrito • Angola 2026
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}