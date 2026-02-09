'use client';

import { useEffect, useState, use } from 'react'; // 1. Importar 'use'
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Lock, Trophy, Loader2 } from 'lucide-react';
import { gamificationService, Lesson } from '@/services/api';

export default function UnitLevelsGrid({ params }: { params: Promise<{ unitId: string }> }) {
    // 2. Desembrulhar a Promise dos params
    const unwrappedParams = use(params);
    const unitId = unwrappedParams.unitId;

    const router = useRouter();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [unitTitle, setUnitTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUnitData = async () => {
            try {
                const res = await gamificationService.getTrail('nhaneca');
                const allLevels = res.data;

                let foundUnit: any = null;
                for (const level of allLevels) {
                    const unit = level.units.find(u => u.id === unitId);
                    if (unit) {
                        foundUnit = unit;
                        break;
                    }
                }

                if (foundUnit) {
                    setLessons(foundUnit.lessons.sort((a: any, b: any) => a.order - b.order));
                    setUnitTitle(foundUnit.title);
                }
            } catch (error) {
                console.error("Erro ao carregar níveis da unidade:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUnitData();
    }, [unitId]); // 3. Usar o unitId desembrulhado como dependência

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background text-gold font-black italic">
            <Loader2 className="animate-spin mr-2" /> CARREGANDO NÍVEIS...
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* O restante do JSX continua exatamente igual ao que enviei anteriormente */}
            <header className="p-4 flex items-center gap-4 border-b border-muted/20 bg-background/95 sticky top-0 z-50">
                <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-foreground" />
                </button>
                <div>
                    <h1 className="font-black uppercase text-sm text-gold tracking-widest">Unidade</h1>
                    <p className="font-bold text-foreground leading-tight">{unitTitle}</p>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-md mx-auto w-full">
                <div className="bg-muted/30 rounded-[32px] p-8 border border-muted/50 shadow-inner">
                    <div className="grid grid-cols-3 gap-8 justify-items-center">
                        {lessons.map((lesson, index) => {
                            const isCompleted = lesson.userHistory?.[0]?.completed || false;
                            const isUnlocked = index === 0 || lessons[index - 1].userHistory?.[0]?.completed;
                            const isCurrent = isUnlocked && !isCompleted;

                            return (
                                <div key={lesson.id} className="flex flex-col items-center gap-2">
                                    <button
                                        disabled={!isUnlocked}
                                        onClick={() => router.push(`/realgamification/lesson/${lesson.id}/play`)}
                                        className={`
                                            relative w-20 h-20 rounded-[28%] flex items-center justify-center transition-all duration-300
                                            ${isCompleted
                                            ? 'bg-emerald-500 shadow-[0_6px_0_0_#059669] text-white'
                                            : isCurrent
                                                ? 'bg-gold shadow-[0_6px_0_0_#b8962e] text-white scale-110'
                                                : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'}
                                            active:translate-y-1 active:shadow-none
                                        `}
                                    >
                                        {isCompleted ? <Trophy size={28} /> : !isUnlocked ? <Lock size={24} /> : <span className="text-2xl font-black">{index + 1}</span>}
                                        {isCurrent && (
                                            <div className="absolute -top-3 -right-2 bg-red-500 text-[10px] text-white font-black px-2 py-1 rounded-full border-2 border-background animate-pulse">
                                                +{lesson.xpReward} XP
                                            </div>
                                        )}
                                    </button>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter text-center max-w-[80px] leading-tight ${isCurrent ? 'text-gold' : 'text-muted-foreground'}`}>
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