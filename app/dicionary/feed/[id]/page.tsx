'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import { ArrowLeft, Volume2, Info, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function WordDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [word, setWord] = useState<WordResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWord() {
            try {
                // Aqui podes precisar de um método no dictionaryService que busque por ID
                // Se não tiveres, podes buscar todos e filtrar (temporário)
                const response = await dictionaryService.getAll(1, 1000);
                const found = response.data.items.find((w: any) => w.id === id);
                setWord(found);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadWord();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">...</div>;
    if (!word) return <div className="min-h-screen flex items-center justify-center bg-background">Palavra não encontrada.</div>;

    return (
        <div className="min-h-screen bg-background text-foreground py-10 px-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] mb-10 hover:gap-4 transition-all">
                    <ArrowLeft size={16} /> Voltar ao Acervo
                </button>

                <div className="bg-card-custom border border-platinum/20 rounded-[48px] p-8 md:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <BookOpen size={200} />
                    </div>

                    <header className="relative z-10">
                        <span className="bg-gold/10 text-gold text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                            {word.grammaticalType}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mt-6 mb-2 uppercase">
                            {word.term}
                        </h1>
                        <p className="text-2xl md:text-3xl text-text-secondary font-medium italic">
                            — {word.meaning}
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 relative z-10">
                        <section className="space-y-6">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-silver-dark border-b border-platinum/20 pb-2">
                                <Info size={14} /> Nota Cultural
                            </h3>
                            <p className="text-lg leading-relaxed text-foreground/80 font-medium">
                                {word.culturalNote || "Esta palavra faz parte do tecido linguístico Nhaneca-Humbe."}
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold border-b border-gold/20 pb-2">
                                <Volume2 size={14} /> Pronúncia Original
                            </h3>
                            {word.audioUrl ? (
                                <button
                                    onClick={() => new Audio(word.audioUrl).play()}
                                    className="w-full bg-gold hover:bg-gold-dark text-white p-6 rounded-3xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-gold/20"
                                >
                                    <Volume2 size={24} />
                                    <span className="font-black uppercase tracking-[0.2em] text-xs">Ouvir agora</span>
                                </button>
                            ) : <p className="text-sm italic text-silver-dark">Áudio não disponível.</p>}
                        </section>
                    </div>

                    <section className="mt-16 relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-silver-dark border-b border-platinum/20 pb-2 mb-8">
                            Exemplos de Aplicação
                        </h3>
                        <div className="space-y-4">
                            {word.examples?.map((ex, i) => (
                                <div key={i} className="bg-background/50 p-6 rounded-3xl border border-platinum/10">
                                    <p className="text-xl font-bold italic mb-2 text-gold">"{ex.text}"</p>
                                    <p className="text-sm text-text-secondary font-medium">— {ex.translation}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}