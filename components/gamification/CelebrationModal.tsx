'use client';

import { Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationProps {
    isOpen: boolean;
    isRevision: boolean;
}

export default function CelebrationModal({ isOpen, isRevision }: CelebrationProps) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            // Agora o TS reconhece estas opções perfeitamente
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#10b981', '#ffffff']
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6 animate-in fade-in duration-500">
            {/* Overlay com efeito de desfoque para dar profundidade ao mapa ao fundo */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="max-w-sm w-full text-center space-y-8 relative z-10">
                <div className="relative inline-block">
                    {/* Brilho dourado atrás do troféu */}
                    <div className="absolute inset-0 bg-gold blur-3xl opacity-30 animate-pulse"></div>
                    <Trophy size={120} className="text-gold fill-gold relative z-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                        {isRevision ? 'Revisão Concluída!' : 'Lição Superada!'}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {isRevision
                            ? 'O teu conhecimento ancestral foi reforçado.'
                            : 'Estás um passo mais perto de dominar Angola.'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                        <Star className="text-gold fill-gold mx-auto mb-1" size={20} />
                        <p className="text-[10px] font-black uppercase opacity-40 text-white">XP Ganho</p>
                        <p className="text-xl font-black text-gold">+100</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                        <RotateCcw className="text-emerald-500 mx-auto mb-1" size={20} />
                        <p className="text-[10px] font-black uppercase opacity-40 text-white">Status</p>
                        <p className="text-xl font-black text-emerald-500">Completo</p>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/realgamification/map')}
                    className="w-full bg-gold text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_6px_0_0_#b8860b] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                    Voltar ao Mapa <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}