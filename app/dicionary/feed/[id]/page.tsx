'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import { ArrowLeft, Volume2, Info } from 'lucide-react';
import DetailSkeleton from '@/components/dictionary/DetailSkeleton';
import MobileNav from "@/components/shared/MobileNav";

interface DictionaryItem extends WordResponse {
    _id?: string;
}

export default function WordDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [word, setWord] = useState<WordResponse | null>(null);
    const [allWords, setAllWords] = useState<WordResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await dictionaryService.getAll(1, 1000);
                const items = (response.data?.items || response.data || []) as DictionaryItem[];
                setAllWords(items);
                const found = items.find((w) => (w._id === id || w.id === id));
                setWord(found || null);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) loadData();
    }, [id]);

    const renderLinkableText = (text: string) => {
        if (!text) return '';
        const parts = text.split(/(\s+)/);

        return parts.map((part, index) => {
            const cleanWord = part.toLowerCase().trim().replace(/[.,!?;()]/g, '');
            if (!cleanWord || cleanWord.length < 2) return <span key={index}>{part}</span>;

            const targetWord = allWords.find(w =>
                w.term?.toLowerCase() === cleanWord ||
                w.infinitive?.toLowerCase() === cleanWord ||
                w.searchTags?.some(tag => tag.toLowerCase() === cleanWord)
            );

            if (targetWord && targetWord.id !== word?.id) {
                return (
                    <span
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dicionary/feed/${targetWord.id}`);
                        }}
                        className="text-gold font-bold cursor-pointer hover:text-white transition-colors duration-200"
                    >
                        {part}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    if (loading) return <DetailSkeleton />;
    if (!word) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-gold/30 scroll-smooth">

            {/* BOTÃO FLUTUANTE FIXO - SEM BARRA DE FUNDO */}
            <div className="fixed top-6 left-6 z-[100] pointer-events-none">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto p-3 bg-background/40 backdrop-blur-md border border-border-custom/50 rounded-full text-silver-dark hover:text-gold active:scale-90 transition-all shadow-xl"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <main className="flex-1 px-6 max-w-3xl mx-auto w-full pt-28 pb-40">

                <section className="mb-12 border-b border-border-custom pb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] font-black tracking-[0.2em] text-gold uppercase bg-gold/5 px-3 py-1 rounded">
                            {word.grammaticalType}
                        </span>
                        {word.infinitive && (
                            <span className="text-[10px] font-bold text-silver-dark uppercase tracking-widest">
                                • {word.infinitive}
                            </span>
                        )}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-medium mb-6 tracking-tight leading-none">
                        {word.term}
                    </h1>
                    <p className="text-2xl md:text-4xl text-silver-dark italic font-light leading-tight">
                        {word.meaning}
                    </p>

                    <button
                        onClick={() => {
                            if (word.audioUrl) {
                                new Audio(word.audioUrl).play().catch(() => {});
                            }
                        }}
                        className="mt-12 flex items-center gap-4 text-gold hover:opacity-70 transition-opacity"
                    >
                        <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5">
                            <Volume2 size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Ouvir pronúncia</span>
                    </button>
                </section>

                <section className="mb-20">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-silver-dark/40 mb-6 flex items-center gap-2">
                        <Info size={14} /> Contexto Cultural
                    </h3>
                    <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light italic">
                        {word.culturalNote || "Este termo preserva a sabedoria ancestral do povo Nhaneca-Humbe."}
                    </p>
                </section>

                {word.examples && word.examples.length > 0 && (
                    <section className="space-y-16">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-silver-dark/40 mb-10">
                            Exemplos de uso
                        </h3>

                        <div className="space-y-20">
                            {word.examples.map((ex, i) => (
                                <div key={i} className="group transition-all">
                                    <div className="text-3xl md:text-5xl text-foreground leading-tight mb-4 font-medium tracking-tight">
                                        “{renderLinkableText(ex.text)}”
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] w-8 bg-gold/30"></div>
                                        <p className="text-gold/70 italic text-xl md:text-2xl font-light">
                                            {ex.translation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <MobileNav />
        </div>
    );
}