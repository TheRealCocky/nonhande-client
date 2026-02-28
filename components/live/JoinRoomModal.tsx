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

        setError(null);
        onJoin(cleanId);
    };

    return (
        <div className="fixed inset-0 z-[150] flex flex-col justify-end sm:justify-center items-center">
            {/* Backdrop fixo */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Contentor do Modal - Blindado contra Teclado */}
            <div className="relative w-full max-w-md bg-card border-t-2 sm:border-2 border-border rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90dvh] transition-all duration-300 ease-out overflow-hidden">

                {/* Handle Mobile - Shrink 0 para não sumir */}
                <div className="shrink-0 w-12 h-1.5 bg-border rounded-full mx-auto mb-6 sm:hidden opacity-50" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-muted-foreground active:scale-75 transition-all z-10"
                >
                    <X size={24} />
                </button>

                {/* Header - Shrink 0 para manter o ícone visível */}
                <div className="shrink-0 flex flex-col items-center text-center space-y-4 mb-6">
                    <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                        <Video size={28} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight leading-none">Acesso Rápido</h3>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">Introduza o ID da aula</p>
                    </div>
                </div>

                {/* Área de Formulário com Scroll Interno Independente */}
                <div className="flex-1 overflow-y-auto px-1 pb-4 space-y-6 custom-scrollbar min-h-0">
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="UUID DA SALA"
                                className={`w-full bg-background border-2 p-5 rounded-2xl outline-none text-center font-mono text-sm uppercase tracking-[0.1em] transition-all appearance-none focus:ring-4 focus:ring-gold/5 ${
                                    error ? 'border-red-500/50' : 'border-border focus:border-gold'
                                }`}
                                value={id}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center justify-center gap-2 text-red-500 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{error}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={validateAndJoin}
                        disabled={!id}
                        className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 disabled:opacity-20 transition-all"
                    >
                        <Video size={18} strokeWidth={3} />
                        Validar Sala
                    </button>

                    <p className="text-center text-[9px] text-muted-foreground font-bold uppercase tracking-tighter opacity-40 leading-relaxed pt-2">
                        Sistema de Live Segura - Nonhand