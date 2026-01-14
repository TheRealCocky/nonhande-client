'use client';

import React from 'react';

export default function UnitCard({ unit }: { unit: any }) {
    // 1. Se o unit for nulo ou indefinido, paramos aqui
    if (!unit) return null;

    // 2. Criamos as lições fake apenas se o unit.lessons não existir ou for vazio
    // Usamos o operador ?. para garantir que não quebra se unit for {}
    const lessonsData = unit?.lessons;
    const hasRealLessons = Array.isArray(lessonsData) && lessonsData.length > 0;

    const lessons = hasRealLessons
        ? lessonsData
        : [
            { id: 'm1', order: 1, title: 'Introdução' },
            { id: 'm2', order: 2, title: 'Saudações' },
            { id: 'm3', order: 3, title: 'Cores' }
        ];

    return (
        <section className="border border-border-custom rounded-2xl p-8 bg-background/40 backdrop-blur-md mb-12">
            {/* Cabeçalho da Unidade */}
            <div className="mb-10">
                <h2 className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-1">
                    Unidade {unit?.order || 1}
                </h2>
                <h3 className="text-3xl font-serif text-foreground leading-tight">
                    {unit?.title || "Módulo Nhaneca"}
                </h3>
            </div>

            {/* Trilha em Ziguezague */}
            <div className="flex flex-col items-center gap-12 py-6">
                {lessons.map((lesson: any, index: number) => (
                    <div
                        key={lesson.id}
                        className="relative group"
                        style={{
                            transform: `translateX(${(index % 2 === 0 ? 40 : -40)}px)`
                        }}
                    >
                        <div className="w-20 h-20 rounded-full border-2 border-gold/30 bg-background flex items-center justify-center shadow-lg group-hover:border-gold transition-all duration-300 cursor-pointer">
                            <span className="font-serif text-2xl text-gold/80 group-hover:text-gold">
                                {index + 1}
                            </span>
                        </div>

                        {/* Nome da Lição */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                            <span className="text-[10px] uppercase tracking-widest text-gold font-bold whitespace-nowrap bg-background px-3 py-1 border border-gold/20 rounded-full">
                                {lesson.title || `Lição ${index + 1}`}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}