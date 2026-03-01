'use client';

import React from 'react';
import { useRanking } from '@/hooks/useRanking';
import { Trophy, Flame, Target } from 'lucide-react';
import { BackButton } from '@/components/shared/BackButton';
import AuthWallModal from '@/components/modals/AuthWallModal';
export default function RankingPage() {
    const { leaders, myPos, loading } = useRanking();

    if (loading) return <div className="p-10 text-center animate-pulse font-black uppercase tracking-widest">A carregar a elite...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <AuthWallModal />
            {/* ✨ Botão de Voltar no topo */}
            <div className="flex justify-start">
                <BackButton destiny="/" />
            </div>

            <header className="text-center space-y-2">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                    Mestres da <span className="text-gold">Língua</span>
                </h1>
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-[0.3em]">Top 10 Angola</p>
            </header>

            {/* Card de Posição do Usuário */}
            {myPos && (
                <div className="bg-gold/10 border border-gold/20 p-6 rounded-[32px] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gold text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl">
                            #{myPos.position}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-60">Tua Posição</p>
                            <p className="font-bold">{myPos.currentXp} XP Acumulado</p>
                        </div>
                    </div>
                    {myPos.nextTarget && (
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black uppercase text-gold">Próximo Alvo</p>
                            <p className="text-xs font-bold italic">+{myPos.nextTarget.xpDiff} XP para superar {myPos.nextTarget.name}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Lista do Ranking */}
            <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl">
                {leaders.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center justify-between p-5 border-b border-border/50 last:border-0 ${index < 3 ? 'bg-gold/5' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`w-6 text-center font-black ${index === 0 ? 'text-gold' : 'opacity-30'}`}>
                                {index + 1}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border">
                                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <Trophy size={16} className="opacity-20" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm uppercase tracking-tight">{user.name}</p>
                                <div className="flex items-center gap-2 opacity-60">
                                    <Flame size={10} className="text-orange-500" />
                                    <span className="text-[10px] font-bold">{user.streak} dias</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-gold tracking-tighter">{user.xp}</p>
                            <p className="text-[8px] font-bold uppercase opacity-40">XP Total</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botão de voltar também no fim da lista para UX */}
            <footer className="flex justify-center pt-6">
                <BackButton label="Voltar ao Mapa" destiny="/trail" />
            </footer>
        </div>
    );
}