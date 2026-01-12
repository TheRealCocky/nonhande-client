'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import { ArrowLeft, Volume2, Info } from 'lucide-react';
import DetailSkeleton from '@/components/dictionary/DetailSkeleton';
import MobileNav from "@/components/shared/MobileNav";

// Cache para os detalhes da palavra atual
const detailCache: Record<string, WordResponse> = {};
// Cache para a lista de verificação de links (allWords)
let globalAllWords: WordResponse[] = [];

export default function WordDetailPage() {
    const params = useParams();
    const termParam = params?.term as string;
    const router = useRouter();

    const [word, setWord] = useState<WordResponse | null>(detailCache[termParam] || null);
    const [allWords, setAllWords] = useState<WordResponse[]>(globalAllWords);
    const [loading, setLoading] = useState(!detailCache[termParam]);

    useEffect(() => {
        async function loadInitialData() {
            try {
                // 1. Carregar a lista para os links (se ainda não tivermos em cache)
                if (globalAllWords.length === 0) {
                    const listRes = await dictionaryService.getAll(1, 1000);
                    const items = listRes.data?.items || listRes.data || [];
                    globalAllWords = items;
                    setAllWords(items);
                }

                // 2. Carregar os detalhes da palavra específica
                const response = await dictionaryService.getByTerm(termParam);
                const foundWord = response.data || response;

                if (foundWord) {
                    detailCache[termParam] = foundWord;
                    setWord(foundWord);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }

        if (termParam) loadInitialData();
    }, [termParam]);

    // 🟢 O Teu renderLinkableText ORIGINAL (Corrigido para usar a nova rota de Termo)
    const renderLinkableText = (text: string) => {
        if (!text) return '';
        const parts = text.split(/(\s+)/);

        return parts.map((part, index) => {
            const cleanWord = part.toLowerCase().trim().replace(/[.,!?;()]/g, '');
            if (!cleanWord || cleanWord.length < 2) return <span key={index}>{part}</span>;

            // Busca na lista completa se a palavra existe
            const targetWord = allWords.find(w =>
                w.term?.toLowerCase() === cleanWord ||
                w.infinitive?.toLowerCase() === cleanWord ||
                w.searchTags?.some(tag => tag.toLowerCase() === cleanWord)
            );

            // Só cria link se existir e não for a própria palavra que estamos a ver
            if (targetWord && targetWord.term.toLowerCase() !== word?.term.toLowerCase()) {
                return (
                    <span
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            // 🟢 IMPORTANTE: Agora navegamos pelo TERM (amigável) e não pelo ID
                            const targetSlug = targetWord.term.split('/')[0].split('(')[0].trim().toLowerCase();
                            router.push(`/dicionary/feed/${targetSlug}`);
                        }}
                        className="text-gold font-bold cursor-pointer hover:text-white transition-colors duration-200"
                    >
                        {part}
                    </span>
                );
            }
            return <span key={index} className="text-foreground">{part}</span>;
        });
    };

    if (loading) return <DetailSkeleton />;
    if (!word) return <div className="h-screen flex items-center justify-center text-silver-dark text-xs tracking-widest uppercase">Termo não encontrado</div>;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-gold/30 isolation-isolate">

            {/* BOTÃO VOLTAR DESIGN ORIGINAL */}
            <div className="fixed top-6 left-6 z-[1000] pointer-events-none">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto p-3 bg-background border border-border-custom/80 rounded-full text-silver-dark hover:text-gold active:scale-95 transition-all shadow-2xl"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <main className="px-6 max-w-3xl mx-auto w-full pt-28 pb-40">
                {/* CABEÇALHO DESIGN ORIGINAL */}
                <section className="mb-12 border-b border-border-custom pb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] font-black tracking-[0.2em] text-gold uppercase bg-gold/5 px-3 py-1 rounded">
                            {word.grammaticalType}
                        </span>
                        {word.infinitive && (
                            <span className="text-[10px] font-bold text-silver-dark uppercase tracking-widest">• {word.infinitive}</span>
                        )}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-medium mb-6 tracking-tight leading-none text-foreground">
                        {word.term}
                    </h1>
                    <p className="text-2xl md:text-4xl text-silver-dark italic font-light leading-tight">
                        {word.meaning}
                    </p>

                    <button
                        onClick={() => { if (word.audioUrl) new Audio(word.audioUrl).play(); }}
                        className="mt-12 flex items-center gap-4 text-gold hover:opacity-70 transition-opacity"
                    >
                        <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center bg-gold/5">
                            <Volume2 size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Ouvir pronúncia</span>
                    </button>
                </section>

                {/* CONTEXTO CULTURAL */}
                <section className="mb-20">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-silver-dark/40 mb-6 flex items-center gap-2">
                        <Info size={14} /> Contexto Cultural
                    </h3>
                    <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light italic">
                        {word.culturalNote || "Este termo preserva a sabedoria ancestral do povo Nhaneca-Humbe."}
                    </p>
                </section>

                {/* EXEMPLOS COM CORES DIFERENCIADAS */}
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

            <div className="z-[9999]">
                <MobileNav />
            </div>
        </div>
    );
}