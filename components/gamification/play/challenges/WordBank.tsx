'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChallengeProps } from '../types';

export default function WordBank({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const [selected, setSelected] = useState<string[]>([]);

    // ✨ Geramos o banco de palavras inicial de forma estável com useMemo
    const initialOptions = useMemo(() => {
        return [...(activity.content?.options || [])].sort(() => Math.random() - 0.5);
    }, [activity.id, activity.content?.options]);

    // Estado para palavras que ainda não foram clicadas
    const [available, setAvailable] = useState<string[]>(initialOptions);

    // Resetar o jogo sempre que a atividade mudar
    useEffect(() => {
        setAvailable(initialOptions);
        setSelected([]);
    }, [initialOptions]);

    const toggleWord = (word: string, isSelecting: boolean) => {
        if (isAnswered) return;

        const newSelected = [...selected];
        const newAvailable = [...available];

        if (isSelecting) {
            newSelected.push(word);
            const idx = newAvailable.indexOf(word);
            if (idx > -1) newAvailable.splice(idx, 1);
        } else {
            newAvailable.push(word);
            const idx = newSelected.indexOf(word);
            if (idx > -1) newSelected.splice(idx, 1);
        }

        setSelected(newSelected);
        setAvailable(newAvailable);

        onSetAnswer({
            userAnswer: newSelected.join(' '),
            isValid: newSelected.length > 0
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-8 text-foreground tracking-tight italic">
                {activity.question}
            </h2>

            {/* Zona de Resposta (DropZone) */}
            <div className="min-h-[160px] flex flex-wrap gap-3 p-6 border-y-2 border-dashed border-border/60 items-start justify-center bg-card/30 rounded-[32px] transition-colors">
                {selected.length === 0 && !isAnswered && (
                    <span className="text-muted-foreground/40 font-bold uppercase tracking-widest text-sm mt-10">
                        Toque nas palavras para traduzir
                    </span>
                )}

                {selected.map((word, i) => (
                    <button
                        key={`sel-${i}`}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => toggleWord(word, false)}
                        className={`px-5 py-3 rounded-2xl font-bold text-lg border-2 border-b-4 transition-all
                            ${isAnswered
                            ? 'border-border bg-muted/20 text-muted-foreground opacity-50'
                            : 'bg-card border-border text-foreground hover:border-red-400 dark:hover:border-red-500/50 active:translate-y-1'}
                        `}
                    >
                        {word}
                    </button>
                ))}
            </div>

            {/* Banco de Palavras */}
            <div className="flex flex-wrap gap-3 justify-center pt-6">
                {available.map((word, i) => (
                    <button
                        key={`av-${i}`}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => toggleWord(word, true)}
                        className="px-6 py-4 bg-card text-foreground border-2 border-b-4 border-border rounded-2xl font-bold text-lg active:translate-y-1 active:border-b-0 transition-all hover:bg-secondary/20 disabled:opacity-20 disabled:grayscale"
                    >
                        {word}
                    </button>
                ))}
            </div>
        </div>
    );
}