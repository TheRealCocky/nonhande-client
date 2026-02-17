'use client';
import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ChallengeProps } from '../types';

export default function MultipleChoice({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const { options, correct, audioUrl } = activity.content;

    // ✨ SOLUÇÃO DO ERRO: Estado derivado ou resetado por ID
    // Em vez de useEffect, usamos uma técnica de "ID Tracking"
    const [currentActivityId, setCurrentActivityId] = useState(activity.id);
    const [selected, setSelected] = useState<string | null>(null);

    // Se o ID da atividade mudou durante a renderização, resetamos o estado
    if (activity.id !== currentActivityId) {
        setSelected(null);
        setCurrentActivityId(activity.id);
    }

    const handleSelect = (option: string) => {
        if (isAnswered) return;
        setSelected(option);
        onSetAnswer({
            userAnswer: option,
            isValid: true
        });
    };

    const playSound = (url?: string) => {
        if (!url) return;
        new Audio(url).play().catch(() => {});
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-6">
                {audioUrl && (
                    <button
                        onClick={() => playSound(audioUrl as string)}
                        className="p-5 bg-gold rounded-2xl text-white shadow-[0_4px_0_0_#b8860b] active:shadow-none active:translate-y-1 transition-all hover:brightness-110"
                    >
                        <Volume2 size={32} />
                    </button>
                )}
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {activity.question}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options?.map((opt: string, i: number) => {
                    const isCorrect = isAnswered && opt === correct;
                    const isCurrentSelection = selected === opt && !isAnswered;

                    return (
                        <button
                            key={`${activity.id}-${i}`} // ✨ Key única por atividade
                            disabled={isAnswered}
                            onClick={() => handleSelect(opt)}
                            className={`p-6 rounded-2xl border-2 border-b-4 text-left font-bold transition-all text-xl
                                ${isCurrentSelection
                                ? 'border-gold bg-gold/10 text-gold shadow-[0_2px_0_0_#b8860b]'
                                : ''}
                                ${!isAnswered && !isCurrentSelection
                                ? 'border-border bg-card text-foreground hover:bg-secondary/50 active:translate-y-1'
                                : ''}
                                ${isCorrect
                                ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-500 !shadow-[0_2px_0_0_#10b981]'
                                : ''}
                                ${isAnswered && !isCorrect
                                ? 'border-border opacity-40 text-muted-foreground'
                                : ''}
                            `}
                        >
                            <span className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-colors ${
                                    isCorrect ? 'border-emerald-500 bg-emerald-500/20' :
                                        isCurrentSelection ? 'border-gold bg-gold/20 text-gold' :
                                            'border-border bg-muted/30'
                                }`}>
                                    {i + 1}
                                </span>
                                {opt}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}