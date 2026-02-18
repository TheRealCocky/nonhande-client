'use client';
import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ChallengeProps } from '../types';

export default function ListenSelect({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const { options, correct, audioUrl } = activity.content;

    const [shuffledOptions] = useState(() => {
        if (!options) return [];
        const copy = [...options];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    });

    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        if (isAnswered) return;
        setSelected(option);
        onSetAnswer({ userAnswer: option, isValid: true });
    };

    const playSound = (url?: string) => {
        if (!url) return;
        new Audio(url).play().catch(() => {});
    };

    return (
        // Reduzi o space-y de 12 para 6 no mobile
        <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto px-2">

            {/* 1. Cabeçalho mais compacto */}
            <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/60 block mb-1">
                    Audição
                </span>
                <h2 className="text-lg font-bold text-foreground/80 leading-tight">
                    Ouve e escolhe a opção
                </h2>
            </div>

            {/* 2. Áudio com margens reduzidas (py-2 em vez de py-6) */}
            <div className="flex justify-center py-2">
                {audioUrl && (
                    <button
                        type="button"
                        onClick={() => playSound(audioUrl as string)}
                        className="p-8 bg-gold rounded-2xl text-white shadow-[0_5px_0_0_#b8860b] active:shadow-none active:translate-y-1 transition-all group"
                    >
                        <Volume2 size={40} className="group-hover:animate-pulse" />
                    </button>
                )}
            </div>

            {/* 3. Grid de Opções mais colado e com botões ligeiramente menores (p-4) */}
            <div className="grid grid-cols-1 gap-3 w-full">
                {shuffledOptions.map((opt: string, i: number) => {
                    const isCorrect = isAnswered && opt === correct;
                    const isCurrentSelection = selected === opt && !isAnswered;

                    return (
                        <button
                            key={`${activity.id}-${i}`}
                            disabled={isAnswered}
                            onClick={() => handleSelect(opt)}
                            className={`
                                p-4 rounded-xl border-2 border-b-4 text-left font-bold transition-all text-lg flex items-center gap-3
                                ${!isAnswered && !isCurrentSelection ? 'border-border bg-card text-foreground active:translate-y-1' : ''}
                                ${isCurrentSelection ? 'border-gold bg-gold/10 text-gold shadow-[0_2px_0_0_#b8860b]' : ''}
                                ${isCorrect ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-500 !shadow-[0_2px_0_0_#10b981]' : ''}
                                ${isAnswered && !isCorrect ? 'border-border opacity-40 text-muted-foreground' : ''}
                            `}
                        >
                            <span className="w-7 h-7 shrink-0 rounded-md border border-border bg-muted/30 flex items-center justify-center text-xs">
                                {i + 1}
                            </span>
                            <span className="truncate">{opt}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}