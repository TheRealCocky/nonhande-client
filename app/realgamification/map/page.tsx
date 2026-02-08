'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

import {
    Trophy, Star, Loader2, Lock,
    Heart, Zap, ShoppingBag, BookOpen,
    ShieldCheck, ArrowLeft
} from 'lucide-react';
import { gamificationService, progressionService, UserStatus } from '@/services/api';

// COMPONENTES DE SUPORTE
import AuthWallModal from '@/components/modals/AuthWallModal';
import MobileNav from "@/components/shared/MobileNav";

// --- INTERFACES PARA PURIFICAÇÃO ---
interface UserProgress {
    completed: boolean;
}

interface Lesson {
    id: string;
    title: string;
    order: number;
    userProgress?: UserProgress[];
}

interface Unit {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Level {
    id: string;
    units: Unit[];
}

export default function StudentMap() {
    const [trail, setTrail] = useState<Level[]>([]);
    const [status, setStatus] = useState<UserStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const [userRole, setUserRole] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // useCallback para estabilizar a função de carga
    const loadData = useCallback(async (userId: string | null) => {
        try {
            setLoading(true);
            const [trailRes, statusRes] = await Promise.all([
                gamificationService.getTrail('nhaneca'),
                userId ? progressionService.getStatus(userId) : Promise.resolve({ data: null })
            ]);

            const trailData = trailRes.data;
            setTrail(Array.isArray(trailData) ? trailData : (trailData?.data || []));
            setStatus(statusRes.data);
        } catch (error: unknown) {
            console.error("❌ Erro ao sincronizar jornada:", error);
            // Verificação segura de erro de autorização
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response: { status: number } };
                if (err.response?.status === 401) {
                    setShowAuthModal(true);
                }
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('nonhande_token');
        const role = localStorage.getItem('user_role');
        const userId = localStorage.getItem('userId');

        setUserRole(role);

        if (!storedToken) {
            const timer = setTimeout(() => setShowAuthModal(true), 1200);
            setLoading(false);
            return () => clearTimeout(timer);
        }

        setShowAuthModal(false);
        loadData(userId);
    }, [loadData]);

    const isAdmin = userRole === 'ADMIN' || userRole === 'TEACHER';

    const getCurveStyle = (index: number) => {
        const curveOffsets = [0, 40, 70, 40, 0, -40, -70, -40];
        const xOffset = curveOffsets[index % curveOffsets.length];
        return { transform: `translateX(${xOffset}px)` };
    };

    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-background italic font-black text-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            CONECTANDO AO REINO...
        </div>
    );

    return (
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">

            {showAuthModal && <AuthWallModal />}

            <nav className="flex-none z-50 bg-background/95 backdrop-blur-xl border-b border-muted/20 px-4 py-4">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-gold transition-colors p-1">
                            <ArrowLeft size={22} />
                        </Link>

                        <div className="text-gold border-b-2 border-gold pb-1">
                            <Star size={22} fill="currentColor" />
                        </div>

                        <Link href="/realgamification/shop" className="text-muted-foreground hover:text-gold transition-colors p-1">
                            <ShoppingBag size={22} />
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/realgamification/admin"
                                className="flex items-center justify-center bg-gold/10 p-2 rounded-xl text-gold border border-gold/30 hover:bg-gold hover:text-white transition-all"
                            >
                                <ShieldCheck size={20} />
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 text-red-500 font-black text-xs">
                            <Heart size={16} fill="currentColor" /> {status?.hearts ?? 5}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 text-gold font-black text-xs">
                            <Zap size={16} fill="currentColor" /> {status?.xp ?? 0}
                        </div>
                    </div>
                </div>
            </nav>

            <main className={`flex-1 overflow-y-auto px-6 pb-40 pt-10 scrollbar-hide bg-background transition-all duration-700 ${showAuthModal ? 'blur-3xl opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="max-w-md mx-auto flex flex-col items-center">

                    <div className="w-full flex flex-col items-center mb-20">
                        <div className="w-full bg-emerald-600 p-6 rounded-[32px] shadow-xl mb-12 relative overflow-hidden border-b-4 border-emerald-800">
                            <div className="relative z-10 text-white">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Introdução</span>
                                <h2 className="text-2xl font-black italic uppercase leading-tight">Nhaneca Zero</h2>
                            </div>
                            <BookOpen className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 -rotate-12" />
                        </div>

                        <Link href="/realgamification/intro/1">
                            <div className="w-20 h-20 rounded-[28%] flex items-center justify-center bg-emerald-500 shadow-[0_8px_0_0_#065f46] hover:scale-105 active:translate-y-1 transition-all">
                                <BookOpen size={28} className="text-white fill-current" />
                            </div>
                        </Link>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        {trail.map((level) => (
                            <div key={level.id} className="w-full flex flex-col items-center">
                                {[...(level.units || [])].sort((a, b) => a.order - b.order).map((unit) => (
                                    <div key={unit.id} className="w-full flex flex-col items-center">
                                        <div className="w-full bg-gold p-6 rounded-[32px] shadow-xl mb-16 relative overflow-hidden border-b-4 border-[#b8962e]">
                                            <div className="relative z-10 text-white">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Unidade {unit.order}</span>
                                                <h2 className="text-2xl font-black italic uppercase leading-tight">{unit.title}</h2>
                                            </div>
                                            <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 -rotate-12" />
                                        </div>

                                        <div className="relative flex flex-col items-center gap-16 mb-24 w-full">
                                            {[...(unit.lessons || [])].sort((a, b) => a.order - b.order).map((lesson, index) => {
                                                const isCompleted = lesson.userProgress?.[0]?.completed || false;
                                                const isUnlocked = index === 0 || (unit.lessons[index - 1]?.userProgress?.[0]?.completed);
                                                const isCurrent = isUnlocked && !isCompleted;

                                                return (
                                                    <div key={lesson.id} style={getCurveStyle(index)} className="relative">
                                                        {isCurrent && (
                                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                                                                <div className="bg-white text-gold text-[10px] font-black px-4 py-2 rounded-lg shadow-lg border border-platinum uppercase animate-bounce whitespace-nowrap">
                                                                    JOGAR
                                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Link href={isUnlocked ? `/realgamification/lesson/${lesson.id}/play` : '#'}>
                                                            <div className="relative flex items-center justify-center">
                                                                <div className="absolute -inset-4 w-[140%] h-[140%] -rotate-90">
                                                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                                                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                                                        {(isCompleted || isCurrent) && (
                                                                            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={isCompleted ? "0" : "200"} strokeLinecap="round" className={`${isCompleted ? 'text-emerald-500' : 'text-gold'} transition-all duration-1000`} />
                                                                        )}
                                                                    </svg>
                                                                </div>
                                                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[28%] flex items-center justify-center transition-all z-10 relative ${isCompleted ? 'bg-emerald-500 shadow-[0_8px_0_0_#059669]' : isCurrent ? 'bg-gold shadow-[0_8px_0_0_#b8962e] scale-110 active:translate-y-1' : 'bg-muted shadow-[0_8px_0_0_#222] opacity-40'}`}>
                                                                    {!isUnlocked ? <Lock size={20} className="text-white/20" /> : <Star size={24} className={`text-white ${isCompleted ? 'fill-white' : ''}`} />}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <div className="flex-none">
                <MobileNav />
            </div>
        </div>
    );
}