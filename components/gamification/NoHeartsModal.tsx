'use client';

import { Heart, Store, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NoHeartsModalProps {
    isOpen: boolean;
    onClose: () => void;
    nextHeartInSeconds?: number; // Opcional: vem do teu UserContext ou Backend
}

export default function NoHeartsModal({ isOpen, onClose, nextHeartInSeconds = 0 }: NoHeartsModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    // Formata os segundos para algo como "14:20 min"
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')} min`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop com desfoque angolano */}
            <div
                className="absolute inset-0 bg-background/90 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            <div className="relative bg-card border-2 border-red-500/30 p-8 rounded-[40px] max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-300">

                {/* Ícone com Pulsação */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                    <div className="relative w-full h-full bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                        <Heart size={48} className="text-red-500 fill-red-500" />
                    </div>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-2">
                    Sem fôlego, Kota!
                </h3>

                <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                    A tua energia esgotou-se. Podes esperar pela regeneração ou trocar os teus pontos na loja agora.
                </p>

                {/* Info de Tempo vs Loja */}
                <div className="grid gap-4 mb-8">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 text-gold">
                            <Clock size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Próximo em</span>
                        </div>
                        <span className="font-black text-foreground">
                    {nextHeartInSeconds > 0 ? formatTime(nextHeartInSeconds) : "24:00 min"}
                </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/realgamification/shop')}
                        className="group w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl border-b-4 border-red-800 transition-all active:border-b-0 active:translate-y-1 flex items-center justify-center gap-3"
                    >
                        <Store size={20} />
                        Ir para a Loja
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-4 text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] hover:text-white transition-colors"
                    >
                        Continuar a Descansar
                    </button>
                </div>
            </div>
        </div>
    );
}