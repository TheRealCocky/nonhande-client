'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import { ArrowLeft, Volume2, Info } from 'lucide-react';
import DetailSkeleton from '@/components/dictionary/DetailSkeleton';
import MobileNav from "@/components/shared/MobileNav";

// Definimos uma interface estendida para lidar com o _id do MongoDB se necessário
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

                // Tipagem correta para evitar o erro de 'any'
                const items = (response.data?.items || response.data || []) as DictionaryItem[];

                setAllWords(items);

                // Busca o item garantindo compatibilidade com id ou _id
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
        <div className="min-h-screen bg-background text-foreground flex flex-col">

            <div className="p-6 flex items-center">
                <button
                    onClick={() => router.back()}
                    className="p-3 hover:bg-card-custom rounded-full transition-all text-silver-dark hover:text-gold"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <main className="flex-1 px-6 max-w-3xl mx-auto w-full pb-32">

                <section className="mt-8 mb-12 border-b border-border-custom pb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] font-black tracking-[0.2em] text-gold uppercase bg-gold/5 px-3 py-1 rounded">
                            {word.grammaticalType}
                        </span>
                        {word.infinitive && (
                            <span className="text-[10px] font-bold text-silver-dark uppercase tracking-widest">
                                • {word.infinitive}
                            </span>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-medium mb-4 tracking-tight">
                        {word.term}
                    </h1>
                    <p className="text-2xl md:text-3xl text-silver-dark italic font-light">
                        {word.meaning}
                    </p>

                    <button
                        onClick={() => {
                            if (word.audioUrl) {
                                new Audio(word.audioUrl).play().catch(() => console.error("Erro ao tocar áudio"));
                            }
                        }}
                        className="mt-8 flex items-center gap-3 text-gold hover:opacity-70 transition-opacity"
                    >
                        <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center">
                            <Volume2 size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Ouvir pronúncia</span>
                    </button>
                </section>

                <section className="mb-16">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-silver-dark/50 mb-4 flex items-center gap-2">
                        <Info size={14} /> Contexto Cultural
                    </h3>
                    <p className="text-lg text-foreground/80 leading-relaxed font-light italic">
                        {word.culturalNote || "Sem nota cultural disponível."}
                    </p>
                </section>

                {word.examples && word.examples.length > 0 && (
                    <section className="space-y-12">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-silver-dark/50 mb-8">
                            Exemplos de uso
                        </h3>

                        <div className="space-y-10">
                            {word.examples.map((ex, i) => (
                                <div key={i} className="group">
                                    <div className="text-2xl md:text-3xl text-foreground leading-snug mb-2 font-medium">
                                        “{renderLinkableText(ex.text)}”
                                    </div>
                                    <p className="text-gold/60 italic text-lg">
                                        — {ex.translation}
                                    </p>
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