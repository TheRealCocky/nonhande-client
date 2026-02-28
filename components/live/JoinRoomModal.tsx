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

    // Limpa o erro quando o usuário volta a digitar
    useEffect(() => {
        if (error) setError(null);
    }, [id]);

    if (!isOpen) return null;

    const validateAndJoin = () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const cleanId = id.trim();

        if (!cleanId) {
            setError("O ID não pode estar vazio.");
            return;
        }

        if (!uuidRegex.test(cleanId)) {
            setError("Formato de ID inválido. Verifique o código.");
            return;
        }

        setError(null);
        onJoin(cleanId);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-4 transition-all">
            {/* Backdrop com desfoque premium */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-card border-2 border-border rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground active:scale-75 transition-all"
                >
                    <X size={24} />
                </button>

                {/* Header do Modal */}
                <div className="flex flex-col items-center text-center space-y-4 mb-8 mt-2">
                    <div className="w-16 h-16 bg-gold/10 rounded-[24px] flex items-center justify-center text-gold shadow-inner">
                        <Video size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Entrar na Aula</h3>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
                            Acesso via Identificador Único
                        </p>
                    </div>
                </div>

                {/* Formidário */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="0000-0000-0000-0000"
                                className={`w-full bg-background border-2 p-5 rounded-2xl outline-none text-center font-mono text-xs uppercase tracking-widest transition-all ${
                                    error ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-gold'
                                }`}
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>

                        {/* Mensagem de Erro Inline - UX Séria */}
                        <div className={`flex items-center justify-center gap-2 text-red-500 transition-all duration-300 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 h-0 pointer-events-none'}`}>
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
                        </div>
                    </div>

                    <button
                        onClick={validateAndJoin}
                        disabled={!id}
                        className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale transition-all"
                    >
                        <Video size={18} strokeWidth={3} />
                        Validar Acesso
                    </button>
                </div>

                {/* Rodapé do Modal */}
                <p className="mt-8 text-center text-[9px] text-muted-foreground font-medium px-4 leading-relaxed uppercase tracking-tighter">
                    Certifique-se de que o ID foi fornecido pelo instrutor da Nonhande.
                </p>
            </div>
        </div>
    );
}