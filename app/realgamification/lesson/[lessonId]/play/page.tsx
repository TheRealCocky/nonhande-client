'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, CheckCircle2, AlertCircle, Loader2, Heart, BookOpen, Ghost } from 'lucide-react';
import { gamificationService, Lesson, Activity } from '@/services/api';

export default function PlayLesson() {
    const params = useParams();
    const lessonId = params?.lessonId as string;
    const router = useRouter();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hearts, setHearts] = useState(5);

    // CORREÇÃO: loadLesson com useCallback para evitar warnings de dependência do useEffect
    const loadLesson = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await gamificationService.getLesson(lessonId);
            if (data?.activities) {
                // Garante a ordem correta usando a tipagem Activity
                data.activities.sort((a: Activity, b: Activity) => (a.order || 0) - (b.order || 0));
            }
            setLesson(data);
        } catch (error: unknown) {
            console.error("Erro ao carregar lição:", error);
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        if (lessonId) loadLesson();
    }, [lessonId, loadLesson]);

    const activities = lesson?.activities || [];
    const currentActivity = activities[currentIndex];
    const isTheory = currentActivity?.type === 'THEORY';

    const handleCheck = () => {
        if (isAnswered || isTheory || !currentActivity) return;

        const correctValue = currentActivity.content?.correct;
        const correct = selectedOption === correctValue;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (!correct) {
            setHearts(prev => Math.max(0, prev - 1));
        }

        new Audio(correct ? '/sounds/correct.mp3' : '/sounds/wrong.mp3').play().catch(() => {});
    };

    const handleNext = () => {
        if (currentIndex < activities.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
            setIsCorrect(false);
        } else {
            router.push('/realgamification/map?status=completed');
        }
    };

    if (loading) return (
        <div className="h-screen bg-background flex flex-col items-center justify-center text-gold font-black uppercase tracking-[0.3em]">
            <Loader2 className="animate-spin mb-4" size={40} />
            Iniciando Prova de Bravura...
        </div>
    );

    if (!currentActivity && !loading) return (
        <div className="h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <Ghost size={64} className="text-muted-foreground mb-4 opacity-20" />
            <h2 className="text-xl font-black uppercase text-gold">Lição sem Desafios</h2>
            <p className="text-muted-foreground text-sm mt-2 mb-8">Esta lição ainda não tem conteúdo forjado.</p>
            <button onClick={() => router.back()} className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px]">Voltar</button>
        </div>
    );

    return (
        <div className="h-screen bg-background text-foreground flex flex-col font-sans select-none overflow-hidden">
            <header className="p-4 md:p-8 max-w-5xl mx-auto w-full flex items-center gap-4">
                <button onClick={() => router.push('/realgamification/map')} className="text-muted-foreground hover:text-white transition-colors">
                    <X size={28} />
                </button>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gold transition-all duration-700 ease-out"
                        style={{ width: `${((currentIndex + 1) / activities.length) * 100}%` }}
                    />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                    <Heart className="text-red-500 fill-red-500" size={18} />
                    <span className="font-black text-red-500">{hearts}</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full overflow-y-auto">
                {isTheory ? (
                    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 text-gold">
                            < BookOpen size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Conhecimento Ancestral</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase">{currentActivity.question}</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {currentActivity.content?.correct}
                            </p>
                        </div>
                        {/* CORREÇÃO: Usando Next.js Image para melhor performance */}
                        <div className="relative w-full h-64 mt-4">
                            <Image
                                src="/placeholder-theory.jpg" // Substituir por currentActivity.imageUrl se vier da API
                                alt="Ilustração teórica"
                                fill
                                className="object-cover rounded-[32px] border border-white/10 shadow-2xl"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full space-y-10 animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl md:text-4xl font-black text-center md:text-left tracking-tight">
                            {currentActivity.question}
                        </h2>

                        {currentActivity.type === 'IMAGE_CHECK' ? (
                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                {[currentActivity.content?.correct, ...(currentActivity.content?.options || [])]
                                    .filter((val): val is string => Boolean(val))
                                    .sort()
                                    .map((imgUrl, i) => (
                                        <button
                                            key={i}
                                            disabled={isAnswered}
                                            onClick={() => setSelectedOption(imgUrl)}
                                            className={`relative aspect-square rounded-[32px] overflow-hidden border-4 transition-all ${
                                                selectedOption === imgUrl ? 'border-gold scale-[0.98]' : 'border-white/5'
                                            } ${isAnswered && imgUrl === currentActivity.content?.correct ? '!border-emerald-500' : ''}
                                          ${isAnswered && selectedOption === imgUrl && imgUrl !== currentActivity.content?.correct ? '!border-red-500' : ''}`}
                                        >
                                            <Image src={imgUrl} fill className="object-cover" alt="Opção" />
                                        </button>
                                    ))}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {currentActivity.content?.options?.map((opt: string, i: number) => (
                                    <button
                                        key={i}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(opt)}
                                        className={`w-full p-6 rounded-2xl border-2 border-b-4 text-left font-bold transition-all ${
                                            selectedOption === opt ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 bg-card hover:border-white/20'
                                        } ${isAnswered && opt === currentActivity.content?.correct ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-400' : ''}
                                          ${isAnswered && selectedOption === opt && opt !== currentActivity.content?.correct ? '!border-red-500 !bg-red-500/10 !text-red-400' : ''}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className={`p-6 md:p-10 border-t border-white/5 transition-all duration-500 ${
                !isAnswered ? 'bg-background' : isCorrect || isTheory ? 'bg-emerald-500/10' : 'bg-red-500/10'
            }`}>
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        {isAnswered && !isTheory && (
                            <div className={`flex items-center gap-4 animate-in slide-in-from-left-4 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                <div className="p-3 bg-white/10 rounded-full">
                                    {isCorrect ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                </div>
                                <div>
                                    <p className="font-black text-2xl uppercase italic tracking-tighter">{isCorrect ? 'Incrível!' : 'Quase lá...'}</p>
                                    {!isCorrect && <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Correto: {currentActivity.content?.correct}</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={isAnswered || isTheory ? handleNext : handleCheck}
                        disabled={!isTheory && !selectedOption}
                        className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                            !isAnswered && !isTheory
                                ? 'bg-gold text-white border-yellow-700 disabled:opacity-20'
                                : 'bg-foreground text-background border-muted-foreground'
                        }`}
                    >
                        {isTheory ? 'Entendi' : isAnswered ? 'Continuar' : 'Verificar'}
                    </button>
                </div>
            </footer>
        </div>
    );
}