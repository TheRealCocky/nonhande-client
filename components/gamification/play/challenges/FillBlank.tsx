// components/gamification/play/challenges/FillBlank.tsx
import { useState } from 'react';
import { ChallengeProps } from '../types';

export default function FillBlank({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const { options, correct } = activity.content;

    // 1. Dividimos primeiro por espaços reais para manter as palavras separadas
    const words = activity.question.split(' ');

    const [selected, setSelected] = useState<string | null>(null);

    const handlePick = (word: string) => {
        if (isAnswered) return;
        setSelected(word);
        onSetAnswer({ userAnswer: word, isValid: true });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 w-full max-w-3xl mx-auto">
            <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">
                    Desafio de Gramática
                </span>
                <h2 className="text-xl font-bold text-foreground/80">Completa a frase abaixo</h2>
            </div>

            {/* O SEGREDO: Usamos flex-wrap com gap, mas cada 'palavra' é um bloco inquebrável */}
            <div className="flex flex-wrap items-baseline justify-center py-8 text-3xl md:text-4xl font-black text-foreground tracking-tight leading-loose gap-x-2">
                {words.map((word: string, wordIdx: number) => (
                    <span key={wordIdx} className="inline-flex items-baseline whitespace-nowrap">
                        {/* 2. Se a palavra contém o underscore, tratamos as suas partes sem nunca as separar */}
                        {word.split('_').map((part, partIdx, array) => (
                            <span key={partIdx} className="flex items-baseline">
                                <span>{part}</span>
                                {partIdx < array.length - 1 && (
                                    <span className={`inline-block min-w-[45px] border-b-4 text-center transition-all duration-300
                                        ${selected
                                        ? 'text-gold border-gold'
                                        : 'text-muted-foreground/40 border-muted-foreground/30'}
                                        ${isAnswered && selected === correct ? 'text-emerald-500 border-emerald-500' : ''}
                                        ${isAnswered && selected !== correct ? 'text-red-500 border-red-500' : ''}
                                    `}>
                                        {selected || '_'}
                                    </span>
                                )}
                            </span>
                        ))}
                    </span>
                ))}
            </div>

            {/* Grid de opções */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto p-4">
                {options?.map((opt: string, i: number) => (
                    <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handlePick(opt)}
                        className={`py-3 px-6 rounded-xl border-2 border-b-4 font-black transition-all text-base
                            ${selected === opt
                            ? 'border-gold bg-gold/10 text-gold translate-y-[2px] border-b-2'
                            : 'border-border bg-card text-foreground hover:border-gold/30'}
                            ${isAnswered && opt === correct ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-500' : ''}
                            ${isAnswered && selected === opt && opt !== correct ? '!border-red-500 !bg-red-500/10 !text-red-500' : ''}
                            ${isAnswered && opt !== correct && selected !== opt ? 'opacity-40 scale-95' : ''}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}