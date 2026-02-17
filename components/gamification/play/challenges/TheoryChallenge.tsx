'use client';

import { useEffect } from 'react';
import { ChallengeProps } from '../types';
import { BookOpen, Volume2 } from 'lucide-react';

export default function TheoryChallenge({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const { question, content } = activity;
    const audioUrl = content?.audioUrl as string | undefined;

    useEffect(() => {
        if (!isAnswered) {
            onSetAnswer({ userAnswer: 'READ', isValid: true });
        }
    }, [isAnswered, onSetAnswer]);

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => {});
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col min-h-[60vh] justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Secção Superior: Título e Identificação */}
            <div className="space-y-4 text-center">
                <div className="inline-flex flex-col items-center gap-2">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                        <BookOpen size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/60">
                        Explicação Teórica
                    </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter leading-tight italic px-4">
                    {question}
                </h2>
            </div>

            {/* Secção Central: O Conteúdo "À Vontade" */}
            <div className="flex-1 flex flex-col justify-center py-8 px-2 relative">
                {/* Brilho de fundo sutil para focar a leitura */}
                <div className="absolute inset-0 bg-gold/5 blur-[80px] rounded-full -z-10" />

                <div className="space-y-6">
                    <p className="text-xl md:text-3xl font-medium text-foreground/90 leading-[1.5] tracking-tight whitespace-pre-wrap italic font-serif text-center md:text-left">
                        {String(content?.explanation || 'Sem explicação disponível.')}
                    </p>

                    {/* Barra de progresso visual interna (detalhe de retenção) */}
                    <div className="w-12 h-1 bg-gold/30 rounded-full mx-auto md:mx-0" />
                </div>

                {/* Áudio colado ao texto para evitar dispersão em telas pequenas */}
                {audioUrl && (
                    <div className="mt-6 flex justify-center md:justify-start">
                        <button
                            onClick={playAudio}
                            type="button"
                            className="flex items-center gap-3 px-6 py-4 bg-gold text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-transform"
                        >
                            <Volume2 size={18} /> Ouvir Pronúncia
                        </button>
                    </div>
                )}
            </div>

            {/* Secção Inferior: Instrução de Saída */}
            <div className="pb-4">
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] text-center">
                    Lê com atenção e clica em Entendido
                </p>
            </div>
        </div>
    );
}
