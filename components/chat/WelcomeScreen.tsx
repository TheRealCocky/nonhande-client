'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const WelcomeScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[45dvh] px-8 text-center animate-in fade-in duration-1000">

            {/* Ícone Minimalista */}
            <div className="mb-10 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-full group-hover:bg-gold/20 transition-all duration-700" />
                    <Sparkles size={42} className="relative text-gold/80 animate-glow-gold" />
                </div>
            </div>

            {/* A Frase Matadora */}
            <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.4em] text-foreground">
                    Nonhande
                </h1>

                <div className="h-[1px] w-12 bg-gold/30 mx-auto" />

                <p className="text-foreground/40 text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium leading-loose max-w-[250px] mx-auto">
                    A sabedoria ancestral <br/>
                    <span className="text-gold/60">encontra o amanhã.</span>
                </p>
            </div>

            {/* Provérbio sutil no fundo */}
            <p className="mt-16 text-foreground/20 text-[9px] uppercase tracking-widest italic font-light">
                "O conhecimento é como o azeite."
            </p>
        </div>
    );
};