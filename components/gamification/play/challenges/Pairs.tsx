// components/gamification/play/challenges/Pairs.tsx
import { useState, useMemo } from 'react';
import { ChallengeProps } from '../types';

export default function Pairs({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const [leftSelected, setLeftSelected] = useState<string | null>(null);
    const [rightSelected, setRightSelected] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    const shuffle = (array: any[]) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const leftColumn = useMemo(() =>
            shuffle(activity.content.pairs.map((p: any) => p.left)),
        [activity.id]
    );

    const rightColumn = useMemo(() =>
            shuffle(activity.content.pairs.map((p: any) => p.right)),
        [activity.id]
    );

    const handleSelect = (val: string, side: 'L' | 'R') => {
        if (isAnswered || isChecking || matchedPairs.includes(val)) return;

        if (side === 'L') {
            setLeftSelected(val);
            if (rightSelected) setRightSelected(null); // Reset visual se trocar de lado
        } else {
            if (!leftSelected) return;

            setRightSelected(val);
            setIsChecking(true);

            const isMatch = activity.content.pairs?.find(
                (p: any) => p.left === leftSelected && p.right === val
            );

            if (isMatch) {
                const newMatches = [...matchedPairs, leftSelected, val];
                setMatchedPairs(newMatches);
                setLeftSelected(null);
                setRightSelected(null);
                setIsChecking(false);

                const totalItems = (activity.content.pairs?.length || 0) * 2;
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
                    {leftColumn.map((val: string) => (
                        <button
                            key={`left-${val}`}
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
                    {rightColumn.map((val: string) => {
                        const isThisWrong = isChecking && rightSelected === val;
                        const isThisSelected = rightSelected === val;

                        return (
                            <button
                                key={`right-${val}`}
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