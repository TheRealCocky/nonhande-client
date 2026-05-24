'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    Trophy, Loader2, Lock, Heart, Zap, ShoppingBag,
    ShieldCheck, ArrowLeft, Trees, Sun
} from 'lucide-react';
import { gamificationService } from '@/services/api';
import {Level, Lesson} from '@/types/gamification'
import { useUser } from '@/contexts/UserContext';
import AuthWallModal from '@/components/modals/AuthWallModal';
import PaywallModal from '@/components/modals/PaywallModal';
import MobileNav from "@/components/shared/MobileNav";


interface UserStatus {
    accessLevel?: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
    hearts?: number;
    xp?: number;
}

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
    const [showPaywall, setShowPaywall] = useState(false);

    const loadTrailData = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const [trailRes] = await Promise.all([
                gamificationService.getTrail('nhaneca'),
                refreshStatus()
            ]);
            setTrail(Array.isArray(trailRes.data) ? trailRes.data : []);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const errorResponse = err as { response: { status: number } };
                if (errorResponse.response.status === 401) setShowAuthModal(true);
            }
        } finally {
            setLoading(false);
        }
    }, [refreshStatus]);

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        loadTrailData();
    }, [loadTrailData]);

    const isAdmin = userRole === 'ADMIN' || userRole === 'TEACHER';

    // CORREÇÃO AQUI: Tipagem correta em vez de 'any'
    const userStatus = status as UserStatus;
    const isPremium = userStatus?.accessLevel === 'PREMIUM' || userStatus?.accessLevel === 'ENTERPRISE';

    if (loading && !status) return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-gold">
            {/* Animação dos 3 pontos centralizados */}
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-gold rounded-full animate-bounce"></div>
            </div>
        </div>
    );

    return (
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">
            {showAuthModal && <AuthWallModal />}
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            <div className="fixed top-24 left-6 opacity-[0.1] dark:opacity-[0.15] pointer-events-none text-emerald-600 rotate-12">
                <Trees size={120} />
            </div>
            <div className="fixed bottom-32 right-[-20px] opacity-[0.1] dark:opacity-[0.15] pointer-events-none text-gold">
                <Sun size={200} />
            </div>

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
                        let canAccessNext = true;
                        let globalStepIdx = -1;

                        return trail
                            .sort((a, b) => a.order - b.order)
                            .map((level, levelIdx) => {
                                const theme = levelColors[levelIdx % levelColors.length];
                                const isPaywallLocked = level.order >= 3 && !isAdmin && !isPremium;

                                return (
                                    <div key={level.id} className="w-full mb-24 flex flex-col items-center">
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
                                                        .map((lesson: Lesson) => {
                                                            globalStepIdx++;

                                                            const isCompleted = lesson.userHistory?.[0]?.completed === true;
                                                            const isUnlocked = canAccessNext && !isPaywallLocked;

                                                            canAccessNext = isUnlocked && isCompleted;

                                                            const radius = 36;
                                                            const circumference = 2 * Math.PI * radius;
                                                            const segments = 8;
                                                            const gapSize = 8;
                                                            const dashSize = (circumference / segments) - gapSize;
                                                            const finalDashSize = Math.max(dashSize, 2);

                                                            const xPos = [0, 45, 80, 45, 0, -45, -80, -45][globalStepIdx % 8];

                                                            return (
                                                                <div
                                                                    key={lesson.id}
                                                                    style={{ transform: `translateX(${xPos}px)` }}
                                                                    className="relative flex flex-col items-center"
                                                                >
                                                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                                                        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.25]">
                                                                            <circle
                                                                                cx="48" cy="48" r={radius}
                                                                                fill="transparent"
                                                                                stroke="currentColor"
                                                                                strokeWidth="8"
                                                                                strokeDasharray={`${finalDashSize} ${gapSize}`}
                                                                                strokeLinecap="butt"
                                                                                className="text-slate-200 dark:text-white/10"
                                                                            />

                                                                            {isCompleted && (
                                                                                <circle
                                                                                    cx="48" cy="48" r={radius}
                                                                                    fill="transparent"
                                                                                    stroke="#22c55e"
                                                                                    strokeWidth="8"
                                                                                    strokeDasharray={`${finalDashSize} ${gapSize}`}
                                                                                    strokeDashoffset={0}
                                                                                    strokeLinecap="butt"
                                                                                    className="transition-all duration-700 ease-in-out"
                                                                                />
                                                                            )}
                                                                        </svg>

                                                                        <Link
                                                                            href={isUnlocked && !isPaywallLocked ? `/realgamification/lesson/${lesson.id}/play` : '#'}
                                                                            onClick={(e) => {
                                                                                if (isPaywallLocked) {
                                                                                    e.preventDefault();
                                                                                    setShowPaywall(true);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div className={`
                                                                                w-16 h-16 rounded-full flex items-center justify-center transition-all relative z-10 border-b-4
                                                                                ${isCompleted
                                                                                ? 'bg-gradient-to-b from-white to-slate-100 border-slate-300 shadow-sm'
                                                                                : isUnlocked
                                                                                    ? 'bg-gold border-[#b8860b] text-white hover:scale-105 active:border-b-0 active:translate-y-1 shadow-lg shadow-gold/20'
                                                                                    : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'}
                                                                            `}>
                                                                                {isCompleted ? (
                                                                                    <Trophy size={28} className="text-gold fill-gold" />
                                                                                ) : isUnlocked ? (
                                                                                    <span className="text-xl font-black">{globalStepIdx + 1}</span>
                                                                                ) : isPaywallLocked ? (
                                                                                    <div className="flex flex-col items-center scale-75">
                                                                                        <Lock size={18} />
                                                                                        <span className="text-[7px] font-black">PREMIUM</span>
                                                                                    </div>
                                                                                ) : (
                                                                                    <Lock size={22} />
                                                                                )}
                                                                            </div>
                                                                        </Link>
                                                                    </div>

                                                                    <span className={`mt-6 text-[11px] font-black uppercase text-center max-w-[120px] tracking-tighter leading-tight transition-colors
                                                                        ${isCompleted ? 'text-emerald-600 font-bold' : isUnlocked ? 'text-foreground/80' : 'text-muted-foreground/40'}`}>
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