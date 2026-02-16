// components/gamification/play/challenges/MultipleChoice.tsx
import { Volume2 } from 'lucide-react';
import { ChallengeProps } from '../types';

export default function MultipleChoice({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const { options, correct, audioUrl } = activity.content;

    // Recuperamos o que o usuário clicou através da própria activity se o Maestro passar,
    // ou mantemos o estado visual via onSetAnswer
    const handleSelect = (option: string) => {
        if (isAnswered) return;
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
            {/* Cabeçalho da Questão */}
            <div className="flex items-center gap-6">
                {audioUrl && (
                    <button
                        onClick={() => playSound(audioUrl)}
                        className="p-5 bg-gold rounded-2xl text-white shadow-[0_4px_0_0_#b8860b] active:shadow-none active:translate-y-1 transition-all hover:brightness-110"
                    >
                        <Volume2 size={32} />
                    </button>
                )}
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {activity.question}
                </h2>
            </div>

            {/* Grelha de Opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options?.map((opt: string, i: number) => {
                    // Verificação visual se esta opção é a correta após responder
                    const isCorrect = isAnswered && opt === correct;

                    return (
                        <button
                            key={i}
                            disabled={isAnswered}
                            onClick={() => handleSelect(opt)}
                            className={`p-6 rounded-2xl border-2 border-b-4 text-left font-bold transition-all text-xl
                                /* Estado Padrão (Adaptável ao Tema) */
                                ${!isAnswered
                                ? 'border-border bg-card text-foreground hover:bg-secondary/50 active:translate-y-1'
                                : ''}

                                /* Estado Correcto */
                                ${isCorrect
                                ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-500'
                                : ''}

                                /* Estado Errado / Outras Opções */
                                ${isAnswered && !isCorrect
                                ? 'border-border opacity-40 text-muted-foreground'
                                : ''}
                            `}
                        >
                            <span className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${
                                    isCorrect ? 'border-emerald-500 bg-emerald-500/20' : 'border-border bg-muted/30'
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