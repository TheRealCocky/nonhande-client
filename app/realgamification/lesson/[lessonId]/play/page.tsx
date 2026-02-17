'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { gamificationService, progressionService, Lesson, Activity } from '@/services/api';
import { useUser } from '@/contexts/UserContext';

import { Header } from '@/components/gamification/play/UI/Header';
import { Footer } from '@/components/gamification/play/UI/Footer';
import { ChallengeFactory } from '@/components/gamification/play/ChallengeFactory';
import { ChallengeResponse } from '@/components/gamification/play/types';

import NoHeartsModal from '@/components/gamification/NoHeartsModal';
import CelebrationModal from '@/components/gamification/CelebrationModal';

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

    const loadLesson = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await gamificationService.getLesson(lessonId);
            const alreadyCompleted = data.userHistory?.[0]?.completed;
            setIsRevision(!!alreadyCompleted);

            if (data?.activities) {
                // Tipagem corrigida para evitar 'any' no sort
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
        if (statusJogo !== 'idle' || hearts <= 0 || !currentActivity) return;

        let isCorrect = false;
        const type = currentActivity.type;

        // Lógica de verificação com tipagem segura
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
            try {
                await progressionService.loseHeart();
            } catch (err) {
                console.error('Erro ao reduzir vida no servidor:', err);
            }
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
                setIsSubmitting(false);
                setShowCelebration(true);
            } catch (err) {
                console.error('Erro ao finalizar lição:', err);
                setIsSubmitting(false);
                router.push('/realgamification/map');
            }
        }
    };

    if (loading) return (
        <div className="h-screen w-full bg-background flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-gold" size={40} />
        </div>
    );

    if (!currentActivity) return null;

    return (
        <div className="fixed inset-0 bg-background text-foreground transition-colors duration-300 flex flex-col select-none overflow-hidden font-sans">

            <Header
                progress={((currentIndex + 1) / (totalActivities || 1)) * 100}
                hearts={hearts}
                onClose={() => router.push('/realgamification/map')}
            />

            <main className="flex-1 overflow-y-auto px-6 py-10 max-w-4xl mx-auto w-full">
                <ChallengeFactory
                    activity={currentActivity}
                    isAnswered={statusJogo !== 'idle'}
                    onSetAnswer={(res: ChallengeResponse) => {
                        setUserAnswer(res.userAnswer);
                        setIsValid(res.isValid);
                    }}
                />
            </main>

            <Footer
                status={statusJogo}
                correctAnswer={currentActivity.content?.correct}
                disabled={!isValid || isSubmitting}
                onCheck={handleCheck}
                onNext={handleNext}
                isLoading={isSubmitting}
            />

            <NoHeartsModal isOpen={showNoHearts} onClose={() => router.push('/realgamification/map')} />
            <CelebrationModal isOpen={showCelebration} isRevision={isRevision} />
        </div>
    );
}
