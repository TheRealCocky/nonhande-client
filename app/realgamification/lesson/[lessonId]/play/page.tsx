'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gamificationService, progressionService, Lesson, Activity } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { AnimatePresence } from 'framer-motion';

import { Header } from '@/components/gamification/play/UI/Header';
import { Footer } from '@/components/gamification/play/UI/Footer';
import { ChallengeFactory } from '@/components/gamification/play/ChallengeFactory';
import { ChallengeResponse } from '@/components/gamification/play/types';

import NoHeartsModal from '@/components/gamification/NoHeartsModal';
import CelebrationModal from '@/components/gamification/CelebrationModal';
import { PlayLoading } from "@/components/gamification/play/PlayLoading";

export default function PlayLesson() {
    const params = useParams();
    const lessonId = params?.lessonId as string;
    const router = useRouter();
    const { status, reduceHeart, refreshStatus } = useUser();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [statusJogo, setStatusJogo] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [userAnswer, setUserAnswer] = useState<unknown>(null);
    const [isValid, setIsValid] = useState(false);
    const [hearts, setHearts] = useState(5);

    const [showNoHearts, setShowNoHearts] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isRevision, setIsRevision] = useState(false);

    const activities = useMemo(() => lesson?.activities || [], [lesson]);
    const currentActivity = activities[currentIndex];
    const totalActivities = activities.length;

    const isLessonEmpty = !loading && lesson && activities.length === 0;

    const loadLesson = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await gamificationService.getLesson(lessonId);
            const alreadyCompleted = data.userHistory?.[0]?.completed;
            setIsRevision(!!alreadyCompleted);

            if (data?.activities) {
                data.activities.sort((a: Activity, b: Activity) => (a.order || 0) - (b.order || 0));
                setCurrentIndex(alreadyCompleted ? 0 : (data.userHistory?.[0]?.lastActivityOrder || 0));
            }
            setHearts(status?.hearts ?? 5);
            setLesson(data);
        } catch (err) {
            console.error('Erro ao carregar lição:', err);
        } finally {
            setLoading(false);
        }
    }, [lessonId, status]);

    useEffect(() => { if (lessonId) loadLesson(); }, [lessonId, loadLesson]);

    useEffect(() => {
        setStatusJogo('idle');
        setUserAnswer(null);
        setIsValid(false);
    }, [currentIndex]);

    const handleCheck = async () => {
        if (!currentActivity || statusJogo !== 'idle' || hearts <= 0) return;

        if (currentActivity.type === 'THEORY') {
            setStatusJogo('correct');
            new Audio('/sounds/correct.mp3').play().catch(() => {});
            return;
        }

        let isCorrect = false;
        const type = currentActivity.type;

        if (type === 'PAIRS') {
            isCorrect = userAnswer === true;
        } else if (type === 'TRANSLATE' || type === 'LISTEN_ORDER') {
            const answerStr = typeof userAnswer === 'string' ? userAnswer : '';
            isCorrect = answerStr.trim().toLowerCase() === currentActivity.content?.correct?.trim().toLowerCase();
        } else {
            isCorrect = String(userAnswer).trim() === String(currentActivity.content?.correct).trim();
        }

        setStatusJogo(isCorrect ? 'correct' : 'wrong');

        if (!isCorrect) {
            const newHearts = Math.max(0, hearts - 1);
            setHearts(newHearts);
            reduceHeart();
            try { await progressionService.loseHeart(); } catch (err) {}
            if (newHearts === 0) setTimeout(() => setShowNoHearts(true), 1000);
        }
        new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/wrong.mp3').play().catch(() => {});
    };

    const handleNext = async () => {
        if (currentIndex < totalActivities - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            try {
                setIsSubmitting(true);
                await progressionService.completeLesson({
                    lessonId,
                    score: Math.floor((hearts / 5) * 100),
                    hearts
                });
                await refreshStatus();
                setShowCelebration(true);
            } catch (err) {
                router.push('/realgamification/map');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isLessonEmpty) {
        return (
            <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                {/* Ícone Fantasma Estilizado */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative bg-card p-8 rounded-[40px] border border-gold/10 shadow-2xl">
                        <span className="text-6xl">🪘</span>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter mb-4 italic">
                    O Reino está a ser preparado...
                </h2>

                <p className="text-muted-foreground max-w-xs mx-auto mb-10 text-sm leading-relaxed">
                    Esta unidade ainda não tem lições disponíveis. Os nossos mestres estão a trabalhar no conteúdo para ti.
                </p>

                <button
                    onClick={() => router.push('/realgamification/map')}
                    className="px-10 py-4 bg-gold text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 transition-all"
                >
                    Voltar ao Mapa
                </button>

                {/* Marca de água discreta */}
                <div className="absolute bottom-10 opacity-10 pointer-events-none">
                    <p className="font-black italic tracking-widest text-4xl">NONHANDE</p>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 bg-background text-foreground transition-colors duration-300 flex flex-col select-none overflow-hidden font-sans">

            {/* ✨ O Loading flutua aqui sem matar o resto do ecrã */}
            <AnimatePresence>
                {(loading || isSubmitting) && <PlayLoading />}
            </AnimatePresence>

            <Header
                progress={((currentIndex + 1) / (totalActivities || 1)) * 100}
                hearts={hearts}
                onClose={() => router.push('/realgamification/map')}
            />


            <main className="flex-1 overflow-y-auto px-6 py-10 max-w-4xl mx-auto w-full">
                {currentActivity && (
                    <ChallengeFactory
                        activity={currentActivity}
                        isAnswered={statusJogo !== 'idle'}
                        onSetAnswer={(res: ChallengeResponse) => {
                            setUserAnswer(res.userAnswer);
                            setIsValid(res.isValid);
                        }}
                    />
                )}
            </main>

            <Footer
                status={statusJogo}
                correctAnswer={currentActivity?.content?.correct}
                disabled={!isValid || isSubmitting || !currentActivity}
                onCheck={handleCheck}
                onNext={handleNext}
                isLoading={isSubmitting}
                activityType={currentActivity?.type}
            />

            <NoHeartsModal isOpen={showNoHearts} onClose={() => router.push('/realgamification/map')} />
            <CelebrationModal isOpen={showCelebration} isRevision={isRevision} />
        </div>
    );
}
