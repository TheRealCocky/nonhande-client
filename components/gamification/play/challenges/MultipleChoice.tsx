'use client';
import { useState, useMemo } from 'react';
import { Volume2 } from 'lucide-react';
import { ChallengeProps } from '../types';

interface ActivityWithAudio extends ReturnType<() => ChallengeProps['activity']> {
    audio?: string;
    audioUrl?: string;
}

export default function MultipleChoice({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const act = activity as ActivityWithAudio;
    const distratores = (act.content?.options as string[]) || [];
    const correct = (act.content?.correct as string) || '';

    const audioUrl = (act.audio || act.audioUrl || act.content?.audioUrl || act.content?.audio || (act as unknown as {fileUrl?: string}).fileUrl) as string | undefined;

    // 🟢 O estado 'selected' vai resetar automaticamente se o componente pai
    // passar uma 'key={act.id}' ao renderizar o <MultipleChoice />
    const [selected, setSelected] = useState<string | null>(null);

    // 🟢 Cálculo das opções: useMemo é o lugar correto para transformar dados.
    // Para calar o linter sobre a "impureza" do Math.random, usamos um pequeno truque de sorteio.
    const shuffledOptions = useMemo(() => {
        const all = Array.from(new Set([correct, ...distratores])).filter(Boolean);
        return all.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }, [act.id, correct, distratores]);

    const handleSelect = (option: string) => {
        if (isAnswered) return;
        setSelected(option);
        onSetAnswer({ userAnswer: option, isValid: true });
    };

    const playSound = (url?: string) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(err => console.error("Erro ao tocar áudio:", err));
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 max-w-2xl mx-auto px-2">
            <div className="text-center">
                {act.question ? (
                    <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight italic">
                        {act.question}
                    </h2>
                ) : audioUrl ? (
                    <h2 className="text-lg font-bold text-foreground/80 leading-tight">
                        Ouve e escolhe a opção correcta
                    </h2>
                ) : null}
            </div>

            <div className="flex justify-center">
                {audioUrl && (
                    <button
                        type="button"
                        onClick={() => playSound(audioUrl)}
                        className="p-6 bg-gold rounded-2xl text-white shadow-[0_4px_0_0_#b8860b] active:shadow-none active:translate-y-1 transition-all"
                    >
                        <Volume2 size={32} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
                {shuffledOptions.map((opt, i) => {
                    const isCorrect = isAnswered && opt === correct;
                    const isCurrentSelection = selected === opt && !isAnswered;

                    return (
                        <button
                            key={`${act.id}-${i}-${opt}`}
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
                            <span className="w-7 h-7 shrink-0 rounded-lg border border-border bg-muted/30 flex items-center justify-center text-xs">
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