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

    const handleSubmit = () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const cleanId = id.trim();
        if (!cleanId) return setError("O ID é obrigatório.");
        if (!uuidRegex.test(cleanId)) return setError("ID Inválido.");
        onJoin(cleanId);
    };

    return (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center">

            {/* Backdrop: Só aparece no Desktop (sm:) */}
            <div
                className="hidden sm:block absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="
                relative bg-background
                w-full h-[100dvh]          /* Mobile: Full Screen */
                sm:w-[420px] sm:h-auto     /* Desktop: Tamanho fixo */
                sm:rounded-[40px] sm:border sm:border-border sm:shadow-2xl
                flex flex-col overflow-hidden
                animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300
            ">

                {/* Header do Modal */}
                <header className="shrink-0 flex items-center justify-between px-6 py-6 border-b border-border/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                            <Video size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Nonhande Live</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-secondary rounded-2xl active:scale-90 transition-all"
                    >
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </header>

                {/* Área de Conteúdo - Flex-1 com scroll para o teclado não cortar nada */}
                <main className="flex-1 overflow-y-auto px-8 py-10 flex flex-col items-center justify-center text-center">

                    <div className="w-full max-w-[320px] space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Aceder à Aula</h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 leading-relaxed">
                                Introduza o código de acesso para entrar na transmissão ao vivo.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gold tracking-widest block">Identificador Único</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="0000-0000-0000-0000"
                                    className={`
                                        w-full bg-secondary/30 border-2 p-5 rounded-[22px] outline-none 
                                        text-center font-mono text-sm uppercase tracking-widest transition-all
                                        ${error ? 'border-red-500' : 'border-transparent focus:border-gold'}
                                    `}
                                    value={id}
                                    onChange={(e) => { setId(e.target.value); setError(null); }}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center justify-center gap-2 text-red-500 animate-pulse">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer: Botão sempre visível no fundo */}
                <footer className="shrink-0 p-8 sm:p-10 bg-gradient-to-t from-background via-background to-transparent">
                    <button
                        onClick={handleSubmit}
                        disabled={!id}
                        className="
                            w-full bg-gold text-white py-6 rounded-[24px]
                            font-black text-xs uppercase tracking-[0.3em]
                            shadow-[0_20px_40px_rgba(212,175,55,0.2)]
                            active:scale-[0.98] transition-all
                            flex items-center justify-center gap-4
                            disabled:opacity-20
                        "
                    >
                        Validar Acesso
                        <ArrowRight size={18} />
                    </button>

                    <p className="mt-6 text-center text-[8px] text-muted-foreground font-black uppercase tracking-[0.5em] opacity-30">
                        Angola • Segurança de Dados
                    </p>
                </footer>
            </div>
        </div>
    );
}