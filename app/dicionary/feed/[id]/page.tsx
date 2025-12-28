'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import { ArrowLeft, Volume2, Info } from 'lucide-react';
import DetailSkeleton from '@/components/dictionary/DetailSkeleton';
import MobileNav from "@/components/shared/MobileNav";

// Resolve TS2430: Interseção em vez de extensão para evitar conflito de 'id'
type DictionaryItem = WordResponse & {
    _id?: string;
};

export default function WordDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [word, setWord] = useState<WordResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWord() {
            try {
                const response = await dictionaryService.getAll(1, 1000);
                const rawData = response.data?.items || response.data || [];

                // Tipagem segura para a busca
                const items = rawData as DictionaryItem[];
                const found = items.find((w) => (w._id === id || w.id === id));

                // Fazemos o cast para WordResponse ao salvar no estado
                setWord((found as WordResponse) || null);
            } catch (error) {
                console.error("Erro ao carregar palavra:", error);
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

    if (loading) return <DetailSkeleton />;
    if (!word) return null;

    return (
        <div className="min-h-screen bg-background text-foreground py-10 px-6 pb-24 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="w-12 h-12 flex items-center justify-center bg-card-custom border border-border-custom rounded-full text-foreground hover:text-gold transition-all mb-10 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="space-y-6">
                    <header className="bg-card-custom border border-border-custom rounded-[40px] p-10 md:p-16 flex flex-col items-center text-center shadow-sm">
                        <span className="bg-gold/10 text-gold text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-gold/20 mb-6">
                            {word.grammaticalType || 'Vocábulo'}
                        </span>
                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none text-foreground mb-6">
                            {word.term}
                        </h1>
                        <p className="text-2xl md:text-3xl text-gold font-bold italic">
                            &mdash; {word.meaning}
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={handlePlayAudio} className="md:col-span-1 bg-card-custom border border-border-custom rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:border-gold/30 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
                                <Volume2 size={28} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Pronúncia</span>
                        </div>

                        <div className="md:col-span-2 bg-card-custom border border-border-custom rounded-[32px] p-8 md:p-10 flex gap-6 items-start">
                            <div className="mt-1 p-3 bg-gold/5 rounded-2xl text-gold">
                                <Info size={24} />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Contexto Ancestral</span>
                                <p className="text-xl text-foreground font-medium italic leading-relaxed">
                                    {word.culturalNote || "Este termo preserva a sabedoria do nosso povo."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {word.examples && word.examples.length > 0 && (
                        <section className="bg-card-custom border border-border-custom rounded-[40px] p-8 md:p-12">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-secondary mb-10 pl-4 border-l-2 border-gold/40">
                                Exemplos
                            </h3>
                            <div className="grid gap-6">
                                {word.examples.map((ex, i) => (
                                    <div key={i} className="bg-background/50 dark:bg-background/40 border border-border-custom p-8 rounded-[32px] group">
                                        <p className="text-2xl md:text-3xl font-black italic text-foreground mb-2 group-hover:text-gold transition-colors">
                                            &quot;{ex.text}&quot;
                                        </p>
                                        <p className="text-sm md:text-base text-text-secondary font-bold italic">
                                            — {ex.translation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <MobileNav />
        </div>
    );
}