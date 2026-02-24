'use client';
import { useState, useMemo } from 'react';
import { Volume2 } from 'lucide-react';
import { ChallengeProps } from '../types';

interface ActivityWithAudio extends ReturnType<() => ChallengeProps['activity']> {
    audio?: string;
    audioUrl?: string;
}
interface ExtendedActivityContent {
    audio?: string;
    audioUrl?: string;
    fileUrl?: string;
    options?: string[];
    correct?: string;
}
export default function MultipleChoice({ activity, isAnswered, onSetAnswer }: ChallengeProps) {
    const act = activity as ActivityWithAudio;
    console.log("Atividade Atual:", act.id, act.content);
    const distratores = (act.content?.options as string[]) || [];
    const correct = (act.content?.correct as string) || '';

    const audioUrl = useMemo(() => {
        const content = act.content as ExtendedActivityContent | undefined;
        const extraFields = act as unknown as ExtendedActivityContent;

        return (
            act.audio ||
            act.audioUrl ||
            content?.audioUrl ||
            content?.audio ||
            content?.fileUrl ||
            extraFields.fileUrl
        );
    }, [act]);

    // 🟢 RESET DE ESTADO (A FORMA CORRETA):
    // Guardamos o ID da atividade anterior para detetar quando ela muda
    const [prevId, setPrevId] = useState(act.id);
    const [selected, setSelected] = useState<string | null>(null);

    // Se o ID mudou, resetamos o 'selected' DURANTE o render (sem useEffect)
    if (act.id !== prevId) {
        setPrevId(act.id);
        setSelected(null);
    }

    // 🟢 BARALHAR (COM USEMEMO):
    // Como o render acontece, o useMemo garante que as opções só mudam quando o act.id mudar
    const shuffledOptions = useMemo(() => {
        const all = Array.from(new Set([correct, ...distratores])).filter(Boolean);
        const copy = [...all];

        // Fisher-Yates dentro do useMemo é seguro
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [act.id, correct]);

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