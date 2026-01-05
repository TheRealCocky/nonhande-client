'use client';

import React from 'react';

export default function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-background flex flex-col animate-pulse">

            {/* BARRA SUPERIOR - MAIS DEFINIDA */}
            <div className="p-6">
                <div className="w-10 h-10 bg-card-custom border border-border-custom rounded-full" />
            </div>

            <main className="flex-1 px-6 max-w-3xl mx-auto w-full pb-32">

                {/* SEÇÃO PRINCIPAL - COM CONTRASTE */}
                <section className="mt-8 mb-10 border-b border-border-custom pb-10">
                    <div className="flex items-center gap-3 mb-6">
                        {/* Badge do tipo gramatical com cor visível */}
                        <div className="h-5 w-20 bg-gold/20 rounded-md border border-gold/10" />
                        <div className="h-3 w-24 bg-card-custom rounded" />
                    </div>

                    {/* Termo Principal - Bloco bem visível */}
                    <div className="h-12 md:h-16 w-3/4 bg-card-custom rounded-xl mb-4 shadow-sm" />

                    {/* Significado - Mais escuro para ler a hierarquia */}
                    <div className="h-8 w-1/2 bg-card-custom/80 rounded-lg mb-10" />

                    {/* Áudio Section */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <div className="w-5 h-5 bg-gold/20 rounded-full" />
                        </div>
                        <div className="h-3 w-32 bg-card-custom rounded" />
                    </div>
                </section>

                {/* CONTEXTO CULTURAL - BLOCOS MAIS FORTES */}
                <section className="mb-12 p-6 bg-card-custom/30 rounded-2xl border border-border-custom/50">
                    <div className="h-3 w-40 bg-card-custom rounded mb-6" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-card-custom/60 rounded" />
                        <div className="h-4 w-5/6 bg-card-custom/60 rounded" />
                    </div>
                </section>

                {/* EXEMPLOS - DEFINIÇÃO CLARA */}
                <section className="space-y-12">
                    <div className="h-3 w-32 bg-card-custom rounded mb-8" />

                    {[1, 2].map((i) => (
                        <div key={i} className="group space-y-4">
                            {/* Frase em Nhaneca - Bloco de peso médio */}
                            <div className="h-12 w-full bg-card-custom rounded-2xl border border-border-custom/30" />
                            {/* Tradução - Tom de ouro visível */}
                            <div className="h-5 w-1/2 bg-gold/10 rounded-lg" />
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}