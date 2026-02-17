'use client';

import { useState, useMemo } from 'react';
import { ChallengeProps } from '../types';

// ✨ Lógica de shuffle movida para fora para garantir pureza no render
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

interface Pair {
    left: string;
    right: string;
}

export default function Pairs({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Tipagem segura para o conteúdo
    const pairs = (activity.content?.pairs as Pair[]) || [];

    const leftColumn = useMemo(() =>
            shuffleArray(pairs.map(p => p.left)),
        [activity.id, pairs]
    );

    const rightColumn = useMemo(() =>
            shuffleArray(pairs.map(p => p.right)),
        [activity.id, pairs]
    );

    const handleSelect = (val: string, side: 'L' | 'R') => {
        if (isAnswered || isChecking || matchedPairs.includes(val)) return;

        if (side === 'L') {
            setLeftSelected(val);
            if (rightSelected) setRightSelected(null);
        } else {
            if (!leftSelected) return;

            setRightSelected(val);
            setIsChecking(true);

            const isMatch = pairs.find(
                (p) => p.left === leftSelected && p.right === val
            );

            if (isMatch) {
                const newMatches = [...matchedPairs, leftSelected, val];
                setMatchedPairs(newMatches);
                setLeftSelected(null);
                setRightSelected(null);
                setIsChecking(false);

                const totalItems = pairs.length * 2;
                if (newMatches.length === totalItems) {
                    onSetAnswer({ userAnswer: true, isValid: true });
                }
            } else {
                setTimeout(() => {
                    setLeftSelected(null);
                    setRightSelected(null);
                    setIsChecking(false);
                }, 500);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-center mb-6 text-foreground tracking-tight">
                {activity.question}
            </h2>

            <div className="grid grid-cols-2 gap-6 md:gap-12">
                {/* Coluna da Esquerda */}
                <div className="space-y-3">
                    {leftColumn.map((val) => (
                        <button
                            key={`left-${val}`}
                            type="button"
                            onClick={() => handleSelect(val, 'L')}
                            disabled={matchedPairs.includes(val)}
                            className={`w-full p-4 rounded-xl border-2 border-b-4 transition-all font-bold text-lg
                                ${matchedPairs.includes(val) ? 'opacity-0 pointer-events-none' :
                                leftSelected === val
                                    ? 'border-gold bg-gold/10 text-gold shadow-sm'
                                    : 'border-border bg-card text-foreground hover:bg-secondary/50'}
                            `}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                {/* Coluna da Direita */}
                <div className="space-y-3">
                    {rightColumn.map((val) => {
                        const isThisWrong = isChecking && rightSelected === val;
                        const isThisSelected = rightSelected === val;

                        return (
                            <button
                                key={`right-${val}`}
                                type="button"
                                onClick={() => handleSelect(val, 'R')}
                                disabled={matchedPairs.includes(val)}
                                className={`w-full p-4 rounded-xl border-2 border-b-4 transition-all font-bold text-lg
                                    ${matchedPairs.includes(val) ? 'opacity-0 pointer-events-none' :
                                    isThisWrong
                                        ? 'border-red-500 bg-red-500/10 text-red-500 animate-shake'
                                        : isThisSelected
                                            ? 'border-gold bg-gold/10 text-gold shadow-sm'
                                            : 'border-border bg-card text-foreground hover:bg-secondary/50'}
                                `}
                            >
                                {val}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}