'use client';

import { X, Video, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface JoinRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (id: string) => void;
}

export default function JoinRoomModal({ isOpen, onClose, onJoin }: JoinRoomModalProps) {
    const [id, setId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Ajuste dinâmico para o teclado do iPhone (Visual Viewport API)
    useEffect(() => {
        if (!isOpen || typeof window === 'undefined' || !window.visualViewport) return;

        const handleResize = () => {
            const viewport = window.visualViewport!;
            const offset = window.innerHeight - viewport.height;
            setKeyboardHeight(offset > 0 ? offset : 0);
        };

        window.visualViewport.addEventListener('resize', handleResize);
        return () => window.visualViewport?.removeEventListener('resize', handleResize);
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
        <div
            className="fixed inset-0 z-[200] flex flex-col justify-end sm:justify-center items-center overflow-hidden transition-all duration-300"
            style={{ paddingBottom: `${keyboardHeight}px` }} // Empurra o modal para cima do teclado real
        >
            {/* Backdrop com desfoque pesado para esconder o layout shift de fundo */}
            <div
                className="absolute inset-0 bg-background/40 backdrop-blur-2xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[440px] bg-card border-t sm:border border-border rounded-t-[40px] sm:rounded-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-500 ease-out flex flex-col">

                {/* Handle Mobile */}
                <div className="shrink-0 w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 mb-2 sm:hidden opacity-30" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-8 p-2 text-muted-foreground active:scale-75 transition-all z-20"
                >
                    <X size={24} />
                </button>

                {/* Conteúdo com Padding Inteligente */}
                <div className="p-8 sm:p-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-[24px] flex items-center justify-center text-gold mb-6 shadow-inner rotate-3">
                        <Video size={32} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Entrar na Aula</h3>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-8 opacity-60">Validar Identificador Único</p>

                    <div className="w-full space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                autoFocus
                                placeholder="0000-0000-0000-0000"
                                className={`w-full bg-background border-2 p-5 rounded-[24px] outline-none text-center font-mono text-sm uppercase tracking-widest transition-all appearance-none focus:ring-8 focus:ring-gold/5 ${
                                    error ? 'border-red-500/50' : 'border-border focus:border-gold'
                                }`}
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    if (error) setError(null);
                                }}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-500 animate-in zoom-in-95">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
                            </div>
                        )}

                        <button
                            onClick={validateAndJoin}
                            disabled={!id}
                            className="w-full bg-foreground text-background py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] active:scale-[0.96] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-10"
                        >
                            <Video size={18} strokeWidth={3} />
                            Aceder Agora
                        </button>

                        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-20 pt-6">
                            Nonhande • Luanda 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}