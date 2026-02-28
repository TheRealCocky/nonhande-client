'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Sparkles, LogIn } from 'lucide-react';

export default function AuthWallModal() {
    const router = useRouter();

    // Lazy initialization: verifica o storage IMEDIATAMENTE na criação do estado
    // Isso evita o uso de useEffect e resolve o erro de cascading renders
    const [isAuthenticated] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem("user_id");
        }
        return true; // Assume true no server para evitar flash de modal
    });

    // Se estiver autenticado, não renderiza absolutamente nada
    if (isAuthenticated) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl animate-in fade-in duration-700" />

            <div className="relative bg-card border border-gold/20 w-full max-w-md rounded-[48px] p-10 md:p-14 shadow-[0_0_100px_rgba(212,175,55,0.15)] animate-in zoom-in-95 fade-in duration-500">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 rounded-full border border-gold/10 animate-ping" />
                        <ShieldCheck className="text-gold" size={40} />
                        <div className="absolute -top-1 -right-1">
                            <Sparkles className="text-gold animate-pulse" size={22} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-4 leading-tight">
                        Círculo de <br/> <span className="text-gold">Identidade</span>
                    </h2>

                    <p className="text-muted-foreground text-xs font-medium leading-relaxed italic mb-10">
                        O saber ancestral é um tesouro guardado. <br/>
                        Para avançar, deves identificar-te no círculo.
                    </p>

                    <button
                        onClick={() => router.push('/auth/signin')}
                        className="w-full bg-gold hover:bg-gold/90 text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
                    >
                        <LogIn size={16} />
                        Entrar no Círculo
                    </button>

                    <div className="mt-10 pt-6 border-t border-border/50 w-full">
                        <p className="text-[8px] text-gold/50 font-black uppercase tracking-[0.4em]">
                            Nonhande • Angola
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}