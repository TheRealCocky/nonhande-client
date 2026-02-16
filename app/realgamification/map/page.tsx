'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    Trophy, Loader2, Lock, Heart, Zap, ShoppingBag,
    ShieldCheck, ArrowLeft, Star, BookOpen, Crown, Trees, Sun
} from 'lucide-react';
import { gamificationService, Level } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import AuthWallModal from '@/components/modals/AuthWallModal';
import MobileNav from "@/components/shared/MobileNav";

// Helper para ícones variados nas unidades
const getUnitIcon = (index: number) => {
    const icons = [
        <Star key="s" size={34} fill="currentColor" />,
        <BookOpen key="b" size={34} fill="currentColor" />,
        <Crown key="c" size={34} fill="currentColor" />
    ];
    return icons[index % icons.length];
};

// Cores vibrantes por Nível
const levelColors = [
    { bg: 'bg-emerald-600', shadow: 'shadow-[0_8px_0_0_#065f46]', stroke: 'text-emerald-500' },
    { bg: 'bg-orange-500', shadow: 'shadow-[0_8px_0_0_#9a3412]', stroke: 'text-orange-500' },
    { bg: 'bg-blue-600', shadow: 'shadow-[0_8px_0_0_#1e3a8a]', stroke: 'text-blue-500' },
    { bg: 'bg-purple-600', shadow: 'shadow-[0_8px_0_0_#581c87]', stroke: 'text-purple-500' },
];

export default function StudentMap() {
    const { status, refreshStatus } = useUser();
    const [trail, setTrail] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const loadTrailData = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const [trailRes] = await Promise.all([
                gamificationService.getTrail('nhaneca'),
                refreshStatus()
            ]);
            setTrail(Array.isArray(trailRes.data) ? trailRes.data : []);
        } catch (error: any) {
            if (error.response?.status === 401) setShowAuthModal(true);
        } finally {
            setLoading(false);
        }
    }, [refreshStatus]);

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        loadTrailData();
    }, [loadTrailData]);

    const flattenedUnits = useMemo(() => {
        return trail
            .sort((a, b) => a.order - b.order)
            .flatMap(level => level.units.sort((a, b) => a.order - b.order));
    }, [trail]);

    const isAdmin = userRole === 'ADMIN' || userRole === 'TEACHER';

    if (loading && !status) return (
        <div className="flex h-screen flex-col items-center justify-center bg-background italic font-black text-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            MAPEANDO O TERRITÓRIO...
        </div>
    );

    return (
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">
            {showAuthModal && <AuthWallModal />}

            {/* BACKGROUND VIVO (ELEMENTOS DE ANGOLA) */}
            <div className="fixed top-24 left-6 opacity-[0.1] dark:opacity-[0.15] pointer-events-none text-emerald-600 rotate-12">
                <Trees size={120} />
            </div>
            <div className="fixed bottom-32 right-[-20px] opacity-[0.1] dark:opacity-[0.15] pointer-events-none text-gold">
                <Sun size={200} />
            </div>

            {/* NAV SUPERIOR */}
            <nav className="flex-none z-50 bg-background/80 backdrop-blur-xl border-b border-muted px-4 py-4">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-gold p-1">
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 text-red-500 font-black text-xs">
                            <Heart size={16} fill="currentColor" /> {status?.hearts ?? 0}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 text-gold font-black text-xs">
                            <Zap size={16} fill="currentColor" /> {status?.xp ?? 0}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/realgamification/shop" className="text-muted-foreground hover:text-gold p-1">
                            <ShoppingBag size={22} />
                        </Link>
                        {isAdmin && (
                            <Link href="/realgamification/admin" className="p-2 rounded-xl text-gold border border-gold/30 hover:bg-gold hover:text-white transition-all">
                                <ShieldCheck size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <main className="flex-1 overflow-y-auto pb-40 pt-10 scrollbar-hide bg-background">
                <div className="max-w-md mx-auto flex flex-col items-center relative z-10 px-6">
                    {(() => {
                        // A chave do reino: esta variável controla o fluxo de desbloqueio em todo o mapa
                        let canAccessNext = true;
                        let globalStepIdx = -1;

                        return trail
                            .sort((a, b) => a.order - b.order)
                            .map((level, levelIdx) => {
                                const theme = levelColors[levelIdx % levelColors.length];

                                return (
                                    <div key={level.id} className="w-full mb-24 flex flex-col items-center">
                                        {/* CABEÇALHO DO NÍVEL */}
                                        <div className={`w-full p-6 rounded-[32px] mb-20 relative overflow-hidden border-2 border-white/10 ${theme.bg} ${theme.shadow}`}>
                                            <div className="relative z-10 text-white text-center">
                                                <span className="text-[10px] font-black uppercase opacity-80 tracking-widest">Nível {level.order}</span>
                                                <h2 className="text-2xl font-black uppercase italic leading-tight">{level.title}</h2>
                                            </div>
                                            <Trophy className="absolute -right-2 -bottom-2 w-20 h-20 text-black/10 -rotate-12" />
                                        </div>

                                        <div className="flex flex-col items-center gap-20 w-full">
                                            {level.units
                                                ?.sort((a, b) => a.order - b.order)
                                                .map((unit) => {
                                                    return unit.lessons
                                                        ?.sort((a, b) => a.order - b.order)
                                                        .map((lesson) => {
                                                            globalStepIdx++;

                                                            // Verifica o histórico do utilizador nesta lição específica
                                                            const isCompleted = (lesson as any).userHistory?.[0]?.completed === true;

                                                            // A lição atual só está aberta se a anterior foi completada (ou se for a primeira de todas)
                                                            const isUnlocked = canAccessNext;

                                                            // Atualiza canAccessNext para a lição seguinte no loop global
                                                            // Se esta lição está completa, a próxima pode ser aberta.
                                                            canAccessNext = isUnlocked && isCompleted;

                                                            // --- LÓGICA VISUAL DOS SEGMENTOS ---
                                                            const totalActivities = lesson.activities?.length || 4;
                                                            const radius = 36;
                                                            const circumference = 2 * Math.PI * radius;
                                                            const segments = isUnlocked ? totalActivities : 8;
                                                            const gapSize = 8;
                                                            const dashSize = (circumference / segments) - gapSize;
                                                            const finalDashSize = Math.max(dashSize, 2);

                                                            // Cálculo da posição em "serpente"
                                                            const xPos = [0, 45, 80, 45, 0, -45, -80, -45][globalStepIdx % 8];

                                                            return (
                                                                <div
                                                                    key={lesson.id}
                                                                    style={{ transform: `translateX(${xPos}px)` }}
                                                                    className="relative flex flex-col items-center"
                                                                >
                                                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                                                        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.25]">
                                                                            {/* Trilho de Fundo */}
                                                                            <circle
                                                                                cx="48" cy="48" r={radius}
                                                                                fill="transparent"
                                                                                stroke="currentColor"
                                                                                strokeWidth="8"
                                                                                strokeDasharray={`${finalDashSize} ${gapSize}`}
                                                                                strokeLinecap="butt"
                                                                                className="text-slate-200 dark:text-white/10"
                                                                            />

                                                                            {/* Trilho de Progresso (Ativo se desbloqueado) */}
                                                                            {isUnlocked && (
                                                                                <circle
                                                                                    cx="48" cy="48" r={radius}
                                                                                    fill="transparent"
                                                                                    stroke="#22c55e"
                                                                                    strokeWidth="8"
                                                                                    strokeDasharray={`${finalDashSize} ${gapSize}`}
                                                                                    strokeDashoffset={isCompleted ? 0 : circumference}
                                                                                    strokeLinecap="butt"
                                                                                    className="transition-all duration-1000 ease-in-out"
                                                                                />
                                                                            )}
                                                                        </svg>

                                                                        {/* BOTÃO DA LIÇÃO */}
                                                                        <Link href={isUnlocked ? `/realgamification/lesson/${lesson.id}/play` : '#'}>
                                                                            <div className={`
                                                                    w-16 h-16 rounded-full flex items-center justify-center transition-all relative z-10 border-b-4
                                                                    ${!isUnlocked
                                                                                ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'
                                                                                : isCompleted
                                                                                    ? 'bg-gradient-to-b from-white to-slate-100 border-slate-300 shadow-sm'
                                                                                    : 'bg-gold border-[#b8860b] text-white hover:scale-105 active:border-b-0 active:translate-y-1 shadow-lg shadow-gold/20'}
                                                                `}>
                                                                                {isCompleted ? (
                                                                                    <Trophy size={28} className="text-gold fill-gold" />
                                                                                ) : isUnlocked ? (
                                                                                    <span className="text-xl font-black">{globalStepIdx + 1}</span>
                                                                                ) : (
                                                                                    <Lock size={22} />
                                                                                )}
                                                                            </div>
                                                                        </Link>
                                                                    </div>

                                                                    <span className={`mt-6 text-[11px] font-black uppercase text-center max-w-[120px] tracking-tighter leading-tight transition-colors
                                                            ${isUnlocked ? 'text-foreground/80' : 'text-muted-foreground/40'}`}>
                                                            {lesson.title}
                                                        </span>
                                                                </div>
                                                            );
                                                        });
                                                })}
                                        </div>
                                    </div>
                                );
                            });
                    })()}
                </div>
            </main>
            <MobileNav />
        </div>
    );
}