'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, CheckCircle2, AlertCircle, Loader2, Heart, BookOpen, Ghost } from 'lucide-react';
import { gamificationService, progressionService, Lesson, Activity } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import NoHeartsModal from '@/components/gamification/NoHeartsModal';

export default function PlayLesson() {
    const params = useParams();
    const lessonId = params?.lessonId as string;
    const router = useRouter();

    const { status, reduceHeart, refreshStatus } = useUser();
    const [showNoHearts, setShowNoHearts] = useState(false);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hearts, setHearts] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadLesson = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await gamificationService.getLesson(lessonId);
            if (data?.activities) {
                data.activities.sort((a: Activity, b: Activity) => (a.order || 0) - (b.order || 0));
                const savedOrder = data.userHistory?.[0]?.lastActivityOrder;
                if (savedOrder !== undefined && savedOrder < data.activities.length) {
                    setCurrentIndex(savedOrder);
                }
            }

            if (status) {
                setHearts(status.hearts);
            } else {
                const statusRes = await progressionService.getStatus();
                setHearts(statusRes.data.hearts);
            }

            setLesson(data);
        } catch (error: unknown) {
            console.error("Erro ao carregar lição:", error);
        } finally {
            setLoading(false);
        }
    }, [lessonId, status]);

    useEffect(() => {
        if (lessonId) loadLesson();
    }, [lessonId, loadLesson]);

    const activities = lesson?.activities || [];
    const currentActivity = activities[currentIndex];
    const isTheory = currentActivity?.type === 'THEORY';

    const handleCheck = async () => {
        if (isAnswered || isTheory || !currentActivity) return;

        // Se tentar verificar com 0 corações, abre o Twist
        if (hearts <= 0) {
            setShowNoHearts(true);
            return;
        }

        const correctValue = currentActivity.content?.correct;
        const correct = selectedOption === correctValue;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (!correct) {
            const newHeartsValue = Math.max(0, hearts - 1);
            setHearts(newHeartsValue);
            reduceHeart();

            try {
                await progressionService.loseHeart();
            } catch (e) {
                console.error("Erro ao persistir perda de coração no server:", e);
            }
        }

        const audio = new Audio(correct ? '/sounds/correct.mp3' : '/sounds/wrong.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
    };

    const handleNext = async () => {
        if (currentIndex < activities.length - 1) {
            const nextIndex = currentIndex + 1;
            try {
                await progressionService.savePoint(lessonId, nextIndex);
            } catch (e) {
                console.error("Erro ao salvar progresso parcial:", e);
            }

            setCurrentIndex(nextIndex);
            setIsAnswered(false);
            setSelectedOption(null);
            setIsCorrect(false);
        }
        else {
            try {
                setIsSubmitting(true);
                const score = Math.floor((hearts / 5) * 100);

                const response = await progressionService.completeLesson({ lessonId, score, hearts });

                await refreshStatus();
                router.push(lesson?.unitId ? `/realgamification/unit/${lesson.unitId}?success=true` : '/realgamification/map');
            } catch (error: any) {
                console.error("❌ ERRO DE REDE DETETADO:", error.message);
                router.push('/realgamification/map');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading || isSubmitting) return (
        <div className="h-screen w-full bg-background flex flex-col items-center justify-center p-4 text-center">
            <Loader2 className="animate-spin mb-6 text-gold" size={32} />
            <h2 className="text-gold font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-[10px] sm:text-xs md:text-sm leading-relaxed max-w-[250px] sm:max-w-none">
                {isSubmitting ? "Forjando Resultados..." : "Iniciando Prova de Bravura..."}
            </h2>
        </div>
    );

    if (!currentActivity && !loading) return (
        <div className="h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <Ghost size={64} className="text-muted-foreground mb-4 opacity-20" />
            <h2 className="text-xl font-black uppercase text-gold">Lição sem Desafios</h2>
            <button onClick={() => router.back()} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px]">Voltar</button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-background text-foreground flex flex-col font-sans select-none overflow-hidden">
            <header className="flex-none p-4 md:p-8 max-w-5xl mx-auto w-full flex items-center gap-4 z-20">
                <button onClick={() => router.back()} className="text-muted-foreground hover:text-white transition-colors">
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

            <main className="flex-1 overflow-y-auto px-6 pt-4 pb-10 max-w-4xl mx-auto w-full scrollbar-hide">
                <div className="min-h-full flex flex-col justify-center">
                    {isTheory ? (
                        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 text-gold">
                                <BookOpen size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Conhecimento Ancestral</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase">{currentActivity.question}</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-gold/30 pl-4">
                                    {currentActivity.content?.correct}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-10 animate-in zoom-in-95 duration-300 py-10 flex flex-col items-center md:items-start">
                            <h2 className="text-2xl md:text-4xl font-black text-center md:text-left tracking-tight leading-tight w-full">
                                {currentActivity.question}
                            </h2>
                            {/* GRID RESPONSIVO: 1 coluna no mobile, 2 no PC */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                                {currentActivity.content?.options?.map((opt: string, i: number) => (
                                    <button
                                        key={i}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(opt)}
                                        className={`w-full p-6 rounded-2xl border-2 border-b-4 text-left font-bold transition-all ${
                                            selectedOption === opt
                                                ? 'border-gold bg-gold/5 text-gold'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                        } ${isAnswered && opt === currentActivity.content?.correct ? '!border-emerald-500 !bg-emerald-500/10 !text-emerald-400' : ''}
                                          ${isAnswered && selectedOption === opt && opt !== currentActivity.content?.correct ? '!border-red-500 !bg-red-500/10 !text-red-400' : ''}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className={`flex-none p-6 md:p-10 border-t border-white/5 bg-background z-20 transition-all duration-500 ${
                isAnswered ? (isCorrect || isTheory ? 'bg-emerald-500/10' : 'bg-red-500/10') : ''
            }`}>
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 w-full md:w-auto">
                        {isAnswered && !isTheory && (
                            <div className="flex items-center gap-4 animate-in slide-in-from-left-4">
                                <div className={`p-3 rounded-full ${isCorrect ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {isCorrect ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                </div>
                                <div>
                                    <p className={`font-black text-xl uppercase italic tracking-tighter ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isCorrect ? 'Incrível!' : 'Quase lá...'}
                                    </p>
                                    {!isCorrect && <p className="text-[10px] font-black uppercase text-red-400/60">Correto: {currentActivity.content?.correct}</p>}
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

            {/* Modal de Twist */}
            <NoHeartsModal
                isOpen={showNoHearts}
                onClose={() => setShowNoHearts(false)}
                nextHeartInSeconds={status?.nextHeartInSeconds}
            />
        </div>
    );
}