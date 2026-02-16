// components/gamification/play/challenges/FillBlank.tsx
import { useState } from 'react';
import { ChallengeProps } from '../types';

export default function FillBlank({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const { options, correct } = activity.content;
    const parts = activity.question.split('_');

    const [selected, setSelected] = useState<string | null>(null);

    const handlePick = (word: string) => {
        if (isAnswered) return;
        setSelected(word);
        onSetAnswer({ userAnswer: word, isValid: true });
    };

    return (
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
            {/* Renderização da Frase com o Buraco */}
            <div className="flex flex-wrap items-baseline gap-x-2 text-2xl md:text-3xl font-black leading-relaxed justify-center py-10 text-foreground">
                {parts.map((part: string, i: number) => (
                    <span key={i} className="flex items-baseline">
                        <span>{part}</span>
                        {i < parts.length - 1 && (
                            <span className={`inline-block min-w-[120px] border-b-4 mx-2 text-center transition-all px-4 py-1
                                ${selected
                                ? 'text-gold border-gold'
                                : 'text-transparent border-muted-foreground/30 dark:border-muted-foreground/20'}
                                ${isAnswered && selected === correct ? 'text-emerald-500 border-emerald-500' : ''}
                                ${isAnswered && selected !== correct ? 'text-red-500 border-red-500' : ''}
                            `}>
                                {selected || '____'}
                            </span>
                        )}
                    </span>
                ))}
            </div>

            {/* Opções de preenchimento */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {options?.map((opt: string, i: number) => (
                    <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handlePick(opt)}
                        className={`p-4 rounded-2xl border-2 border-b-4 font-bold transition-all text-lg
                            /* Cores Base (Adaptáveis) */
                            ${selected === opt
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-border bg-card text-foreground hover:bg-secondary/50'}
                            
                            /* Cores de Resposta Correta */
                            ${isAnswered && opt === correct
                            ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-500'
                            : ''}
                            
                            /* Cores de Resposta Errada */
                            ${isAnswered && selected === opt && opt !== correct
                            ? '!border-red-500 !bg-red-500/10 !text-red-500'
                            : ''}
                            
                            /* Estado Desativado */
                            ${isAnswered && opt !== correct && selected !== opt ? 'opacity-50' : ''}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}