'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import { ArrowLeft, Volume2, Info, BookOpen, Loader2 } from 'lucide-react';

export default function WordDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [word, setWord] = useState<WordResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWord() {
            try {
                const response = await dictionaryService.getAll(1, 1000);
                const items = response.data?.items || response.data || [];

                // Correção do erro de 'any': Definimos o tipo na busca
                const found = items.find((w: WordResponse) => {
                    const wordId = (w as any)._id || w.id;
                    return wordId === id;
                });

                setWord(found || null);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) loadWord();
    }, [id]);

    const handlePlayAudio = () => {
        if (word?.audioUrl) {
            new Audio(word.audioUrl).play().catch(console.error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-silver-dark">Carregando Saber...</p>
            </div>
        );
    }

    if (!word) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
                <h2 className="text-xl font-black text-gold uppercase mb-4">Vocábulo não encontrado</h2>
                <button onClick={() => router.push('/dicionary/feed')} className="text-silver-dark underline text-xs font-bold">
                    Voltar ao Acervo
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-10 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.push('/dicionary/feed')}
                    className="flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] mb-10 hover:gap-4 transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar ao Acervo
                </button>

                <div className="bg-card-custom border border-platinum/20 rounded-[48px] p-8 md:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <BookOpen size={200} />
                    </div>

                    <header className="relative z-10">
                        <span className="bg-gold/10 text-gold text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border border-gold/20">
                            {word.grammaticalType || 'Vocábulo'}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mt-6 mb-2 uppercase leading-none">
                            {word.term}
                        </h1>
                        <p className="text-2xl md:text-3xl text-text-secondary font-medium italic">
                            &mdash; &quot;{word.meaning}&quot;
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 relative z-10">
                        <section className="space-y-6">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-silver-dark border-b border-platinum/20 pb-2">
                                <Info size={14} /> Nota Cultural
                            </h3>
                            <p className="text-lg leading-relaxed text-foreground/80 font-medium">
                                {word.culturalNote || "Este termo carrega a essência da tradição oral Nhaneca-Humbe."}
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold border-b border-gold/20 pb-2">
                                <Volume2 size={14} /> Pronúncia Original
                            </h3>
                            {word.audioUrl ? (
                                <button
                                    onClick={handlePlayAudio}
                                    className="w-full bg-gold hover:bg-gold-dark text-white p-6 rounded-3xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-gold/20 group"
                                >
                                    <Volume2 size={24} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-black uppercase tracking-[0.2em] text-xs">Ouvir agora</span>
                                </button>
                            ) : (
                                <p className="text-sm italic text-silver-dark bg-platinum/5 p-4 rounded-2xl text-center border border-dashed border-platinum/20">
                                    Registo sonoro não disponível.
                                </p>
                            )}
                        </section>
                    </div>

                    {word.examples && word.examples.length > 0 && (
                        <section className="mt-16 relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-silver-dark border-b border-platinum/20 pb-2 mb-8">
                                Exemplos de Aplicação
                            </h3>
                            <div className="space-y-4">
                                {word.examples.map((ex, i) => (
                                    <div key={i} className="bg-background/50 p-6 rounded-3xl border border-platinum/10 hover:border-gold/30 transition-colors">
                                        <p className="text-xl font-bold italic mb-2 text-gold">
                                            &quot;{ex.text}&quot;
                                        </p>
                                        <p className="text-sm text-text-secondary font-medium italic">
                                            &mdash; {ex.translation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}