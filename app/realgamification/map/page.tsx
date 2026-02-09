'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    Trophy, Star, Loader2, Lock,
    Heart, Zap, ShoppingBag, ShieldCheck, ArrowLeft, Play, BookOpen,
    Trees, Sun
} from 'lucide-react';
import { gamificationService, progressionService, UserStatus, Level } from '@/services/api';

import AuthWallModal from '@/components/modals/AuthWallModal';
import MobileNav from "@/components/shared/MobileNav";

export default function StudentMap() {
    const [trail, setTrail] = useState<Level[]>([]);
    const [status, setStatus] = useState<UserStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const loadData = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const [trailRes, statusRes] = await Promise.all([
                gamificationService.getTrail('nhaneca'),
                progressionService.getStatus()
            ]);
            setTrail(Array.isArray(trailRes.data) ? trailRes.data : []);
            setStatus(statusRes.data);
        } catch (error: any) {
            if (error.response?.status === 401) setShowAuthModal(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('nonhande_token');
        setUserRole(localStorage.getItem('user_role'));
        if (!storedToken) {
            setLoading(false);
            setShowAuthModal(true);
            return;
        }
        loadData();
        const handleFocus = () => loadData(true);
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [loadData]);

    const getCurveStyle = (index: number) => {
        const curveOffsets = [0, 40, 70, 40, 0, -40, -70, -40];
        const xOffset = curveOffsets[index % curveOffsets.length];
        return { transform: `translateX(${xOffset}px)` };
    };

    const isAdmin = userRole === 'ADMIN' || userRole === 'TEACHER';

    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-background italic font-black text-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            MAPEANDO O TERRITÓRIO...
        </div>
    );

    return (
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">
            {showAuthModal && <AuthWallModal />}

            {/* NAV - Agora usa cores dinâmicas bg-background e border-muted */}
            <nav className="flex-none z-50 bg-background/80 backdrop-blur-xl border-b border-muted px-4 py-4 shadow-sm">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-gold transition-colors p-1">
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 text-red-500 font-black text-xs">
                            <Heart size={16} fill="currentColor" /> {status?.hearts}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 text-gold font-black text-xs">
                            <Zap size={16} fill="currentColor" /> {status?.xp}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/realgamification/shop" className="text-muted-foreground hover:text-gold p-1">
                            <ShoppingBag size={22} />
                        </Link>
                        {isAdmin && (
                            <Link href="/realgamification/admin" className="p-2 rounded-xl text-gold border border-gold/30 hover:bg-gold hover:text-white transition-all shadow-sm">
                                <ShieldCheck size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* MAIN - Agora usa gradientes que respeitam o modo dark */}
            <main className={`flex-1 overflow-y-auto px-6 pb-40 pt-10 scrollbar-hide bg-gradient-to-b from-background via-background/95 to-gold/5 dark:to-gold/20 transition-all duration-700 ${showAuthModal ? 'blur-3xl opacity-0' : 'opacity-100'}`}>

                {/* Elementos decorativos com opacidade baixa para não atrapalhar no dark */}
                <div className="fixed top-20 left-10 opacity-[0.05] dark:opacity-[0.1] pointer-events-none"><Trees size={100} /></div>
                <div className="fixed bottom-40 right-10 opacity-[0.05] dark:opacity-[0.1] pointer-events-none"><Sun size={150} /></div>

                <div className="max-w-md mx-auto flex flex-col items-center relative z-10">

                    {/* UNIDADE ZERO */}
                    <div className="w-full flex flex-col items-center mb-20">
                        <div className="w-full bg-emerald-600 p-6 rounded-[32px] shadow-[0_10px_0_0_#064e3b] mb-12 relative overflow-hidden border-2 border-white/10">
                            <div className="relative z-10 text-white">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Jornada Inicial</span>
                                <h2 className="text-2xl font-black italic uppercase leading-tight">Nhaneca Zero</h2>
                            </div>
                            <BookOpen className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 -rotate-12" />
                        </div>
                        <Link href="/realgamification/intro/1">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-emerald-500 shadow-[0_8px_0_0_#065f46] hover:scale-105 active:translate-y-1 transition-all border-4 border-background">
                                <Play size={32} className="text-white fill-current ml-1" />
                            </div>
                        </Link>
                        <div className="w-3 h-20 bg-muted rounded-full mt-10" />
                    </div>

                    {/* TRAIL DINÂMICA */}
                    <div className="w-full flex flex-col items-center gap-16">
                        {trail.flatMap(level => level.units).sort((a, b) => a.order - b.order).map((unit, idx) => {
                            const isUnlocked = unit.isUnlocked ?? (idx === 0);

                            return (
                                <div key={unit.id} style={getCurveStyle(idx)} className={`w-full flex flex-col items-center transition-all ${!isUnlocked ? 'grayscale opacity-60' : ''}`}>

                                    {/* BANNER DA UNIDADE - Cores de Angola mas com borda que respeita o tema */}
                                    <div className="w-full bg-gradient-to-r from-gold to-orange-500 p-6 rounded-[32px] shadow-[0_10px_0_0_#9a3412] mb-10 relative overflow-hidden border-2 border-background/20">
                                        {!isUnlocked && <Lock className="absolute top-4 right-4 text-white/40" size={20} />}
                                        <div className="relative z-10 text-white">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Província {unit.order}</span>
                                            <h2 className="text-2xl font-black italic uppercase">{unit.title}</h2>
                                        </div>
                                        <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 text-black/10 -rotate-12" />
                                    </div>

                                    {/* BOTÃO JOGAR */}
                                    <Link href={isUnlocked ? `/realgamification/unit/${unit.id}` : '#'}>
                                        <div className={`
                                            group relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all border-4 border-background
                                            ${isUnlocked ? 'bg-orange-500 shadow-[0_10px_0_0_#9a3412] hover:scale-110 active:translate-y-2' : 'bg-muted shadow-[0_10px_0_0_#222] cursor-not-allowed'}
                                        `}>
                                            {isUnlocked ? (
                                                <>
                                                    <div className="absolute -top-12 bg-popover text-popover-foreground text-[10px] font-black px-4 py-2 rounded-full shadow-lg border border-border uppercase animate-bounce whitespace-nowrap">
                                                        JOGAR {unit.title.split(' ')[0]}
                                                    </div>
                                                    <Play size={32} className="text-white fill-current ml-1" />
                                                </>
                                            ) : (
                                                <Lock size={28} className="text-white/30" />
                                            )}
                                        </div>
                                    </Link>

                                    {/* LINHA DE CAMINHO */}
                                    {idx < (trail.flatMap(l => l.units).length - 1) && (
                                        <div className="w-4 h-24 bg-muted/30 rounded-full mt-12 border-dotted border-l-4 border-muted" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <MobileNav />
        </div>
    );
}