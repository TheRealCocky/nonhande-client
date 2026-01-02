'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Sparkles, LogIn } from 'lucide-react';

export default function AuthWallModal() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            {/* Overlay com desfoque máximo - Impede qualquer visualização clara */}
            <div className="absolute inset-0 bg-background/90 backdrop-blur-3xl transition-opacity animate-in fade-in duration-700" />

            <div className="relative bg-card-custom border border-gold/20 w-full max-w-md rounded-[48px] p-10 md:p-14 shadow-[0_0_100px_rgba(212,175,55,0.15)] animate-in zoom-in-95 fade-in duration-500">

                <div className="flex flex-col items-center text-center">
                    {/* Ícone de Proteção com Aura Gold */}
                    <div className="w-28 h-28 bg-gold/5 rounded-full flex items-center justify-center mb-10 relative">
                        <div className="absolute inset-0 rounded-full border border-gold/10 animate-ping" />
                        <ShieldCheck className="text-gold" size={48} />
                        <div className="absolute -top-1 -right-1">
                            <Sparkles className="text-gold animate-pulse" size={26} />
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-6 leading-tight text-foreground">
                        Círculo de <br/> <span className="text-gold">Identidade</span>
                    </h2>

                    <p className="text-text-secondary text-sm md:text-base font-medium leading-relaxed italic mb-12">
                        O saber ancestral é um tesouro guardado. <br/>
                        Para avançar, deves identificar-te no círculo.
                    </p>

                    <div className="flex flex-col w-full gap-6">
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="group bg-gold hover:bg-gold-dark text-white py-6 rounded-[24px] font-black uppercase tracking-[0.25em] text-[10px] transition-all shadow-2xl shadow-gold/40 active:scale-95 flex items-center justify-center gap-4"
                        >
                            <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                            Entrar no Círculo
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-platinum/10 w-full">
                        <p className="text-[8px] text-gold/50 font-black uppercase tracking-[0.4em]">
                            Nonhande • Angola
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}