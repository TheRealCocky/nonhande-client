'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Trophy, Loader2, Heart, Zap } from 'lucide-react';
import { gamificationService, Lesson, Unit } from '@/services/api';
import { useUser } from '@/contexts/UserContext'; // ✅ Importamos o cérebro global

export default function UnitLevelsGrid({ params }: { params: Promise<{ unitId: string }> }) {
    const unwrappedParams = use(params);
    const unitId = unwrappedParams.unitId;

    const router = useRouter();

    // ✅ 1. Conectamos ao Contexto Global
    const { status, refreshStatus } = useUser();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [unitTitle, setUnitTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const loadUnitData = useCallback(async () => {
        try {
            setLoading(true);
            // ✅ 2. Sincronizamos a trilha e o status do usuário ao mesmo tempo
            const [res] = await Promise.all([
                gamificationService.getTrail('nhaneca'),
                refreshStatus() // Garante que o status (corações/xp) está fresco
            ]);

            const allLevels = res.data;
            let foundUnit: Unit | null = null;

            for (const level of allLevels) {
                const unit = level.units.find((u: Unit) => u.id === unitId);
                if (unit) {
                    foundUnit = unit;
                    break;
                }
            }

            if (foundUnit && foundUnit.lessons) {
                const sortedLessons = [...foundUnit.lessons].sort((a: Lesson, b: Lesson) =>
                    (a.order || 0) - (b.order || 0)
                );
                setLessons(sortedLessons);
                setUnitTitle(foundUnit.title);
            }
        } catch (error) {
            console.error("Erro ao carregar níveis da unidade:", error);
        } finally {
            setLoading(false);
        }
    }, [unitId, refreshStatus]);

    useEffect(() => {
        loadUnitData();
    }, [loadUnitData]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background text-gold font-black italic">
            <Loader2 className="animate-spin mr-2" /> CARREGANDO NÍVEIS...
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-white/5 bg-background/95 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/realgamification/map')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-foreground" />
                    </button>
                    <div>
                        <h1 className="font-black uppercase text-[10px] text-gold tracking-widest leading-none">Unidade</h1>
                        <p className="font-bold text-foreground leading-tight">{unitTitle}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 text-red-500 font-black text-xs">
                        <Heart size={14} fill="currentColor" /> {status?.hearts ?? 0}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1 rounded-full border border-gold/20 text-gold font-black text-xs">
                        <Zap size={14} fill="currentColor" /> {status?.xp ?? 0}
                    </div>
                </div>
            </header>

            {/* AQUI ESTÁ A MUDANÇA: max-w-5xl para abrir o ecrã */}
            <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
                <div className="bg-white/[0.02] dark:bg-white/[0.02] rounded-[32px] p-6 md:p-12 border border-white/5 shadow-inner">

                    {/* GRID RESPONSIVO: 3 colunas mobile, 4 em tablets, 6 em desktop */}
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-12 justify-items-center">
                        {lessons.map((lesson, index) => {
                            const isCompleted = lesson.userHistory?.[0]?.completed || false;
                            const isUnlocked = index === 0 || (lessons[index - 1].userHistory?.[0]?.completed);
                            const isCurrent = isUnlocked && !isCompleted;

                            return (
                                <div key={lesson.id} className="flex flex-col items-center gap-3 group">
                                    <button
                                        disabled={!isUnlocked}
                                        onClick={() => router.push(`/realgamification/lesson/${lesson.id}/play`)}
                                        className={`
                                    relative w-16 h-16 md:w-20 md:h-20 rounded-[28%] flex items-center justify-center transition-all duration-300
                                    ${isCompleted
                                            ? 'bg-emerald-500 shadow-[0_6px_0_0_#059669] text-white'
                                            : isCurrent
                                                ? 'bg-gold shadow-[0_6px_0_0_#b8962e] text-white scale-110'
                                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-40 cursor-not-allowed'}
                                    ${isUnlocked && 'hover:-translate-y-1 active:translate-y-1 active:shadow-none'}
                                `}
                                    >
                                        {isCompleted ? <Trophy size={28} /> : !isUnlocked ? <Lock size={24} /> : <span className="text-xl md:text-2xl font-black">{index + 1}</span>}

                                        {isCurrent && (
                                            <div className="absolute -top-3 -right-2 bg-red-500 text-[9px] md:text-[10px] text-white font-black px-2 py-1 rounded-full border-2 border-background animate-bounce">
                                                +{lesson.xpReward} XP
                                            </div>
                                        )}
                                    </button>
                                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-center max-w-[80px] leading-tight transition-colors ${isCurrent ? 'text-gold' : 'text-muted-foreground'}`}>
                                {lesson.title}
                            </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}