'use client';

import React, { useEffect, useState } from 'react';
import { dictionaryService, WordResponse } from '@/services/api';
import Link from 'next/link';
import { Volume2, ArrowLeft, Plus, Bookmark, Search, BookOpen, Loader2 } from 'lucide-react';

export default function DicionarioFeedPage() {
    const [words, setWords] = useState<WordResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        setUserRole(role);
        loadWords();
    }, []);

    async function loadWords() {
        setLoading(true);
        try {
            const response = await dictionaryService.getAll(1, 100);
            // Ajuste para lidar com diferentes formatos de resposta da API
            const items = response.data?.items || response.data || [];
            setWords(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Erro ao carregar dicionário:", error);
        } finally {
            setLoading(false);
        }
    }

    // Função para reproduzir a pronúncia
    const playAudio = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation(); // Impede que o clique abra a página de detalhes
        const audio = new Audio(url);
        audio.play().catch(err => console.error("Erro ao tocar áudio:", err));
    };

    const filteredWords = words.filter(word =>
        word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* HEADER FIXO */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-platinum/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-gold/10 rounded-full transition-all text-foreground/70 hover:text-gold"
                        >
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase italic leading-none">
                                Nonhande
                            </h1>
                            <span className="text-[9px] text-silver-dark font-bold tracking-[0.2em] uppercase mt-1">
                                Legado Nhaneca-Humbe
                            </span>
                        </div>
                    </div>

                    {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                        <Link
                            href="/dicionary/upload"
                            className="bg-gold hover:bg-gold-dark text-white px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Novo Termo</span>
                        </Link>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* BARRA DE PESQUISA */}
                <div className="max-w-2xl mx-auto mb-16 px-2">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Procurar termo..."
                            className="w-full bg-card-custom border border-platinum/30 rounded-[24px] p-5 md:p-7 text-lg md:text-2xl font-semibold outline-none focus:border-gold transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-silver-dark/30 group-focus-within:text-gold transition-colors">
                            <Search size={22} />
                        </div>
                    </div>
                </div>

                {/* LISTAGEM EM GRID */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-silver-dark animate-pulse">
                            Acedendo ao Acervo
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {filteredWords.map((word) => (
                            <div key={word.id} className="relative group">
                                {/* CARD PRINCIPAL (LINK DINÂMICO) */}
                                <Link
                                    href={`/dicionary/feed/${word.id}`}
                                    className="block h-full bg-card-custom border border-platinum/20 rounded-[32px] p-8 hover:border-gold/50 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-2 bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
                                                <Bookmark size={12} className="text-gold" />
                                                <span className="text-[9px] font-black text-gold uppercase tracking-widest">
                                                    {word.grammaticalType || 'Vocábulo'}
                                                </span>
                                            </div>

                                            {/* BOTÃO DE ÁUDIO (INDIVIDUAL) */}
                                            {word.audioUrl && (
                                                <button
                                                    onClick={(e) => playAudio(e, word.audioUrl!)}
                                                    className="relative z-20 w-10 h-10 rounded-full bg-foreground/5 text-foreground/70 flex items-center justify-center hover:bg-gold hover:text-white transition-all active:scale-90"
                                                    title="Ouvir pronúncia"
                                                >
                                                    <Volume2 size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <h2 className="text-3xl font-black group-hover:text-gold transition-colors tracking-tighter italic">
                                                {word.term}
                                            </h2>
                                            <p className="text-text-secondary text-lg font-medium leading-relaxed italic">
                                                "{word.meaning}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-platinum/10 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                            <BookOpen size={14} /> Detalhes
                                        </span>
                                        <span className="text-[8px] font-bold text-silver-dark tracking-tighter uppercase">
                                            ID: {word.id.slice(-6)}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* FEEDBACK CASO NÃO HAJA RESULTADOS */}
                {!loading && filteredWords.length === 0 && (
                    <div className="text-center py-32 rounded-[40px] border-2 border-dashed border-platinum/20 bg-card-custom/30">
                        <p className="text-silver-dark font-medium italic">Nenhum termo encontrado para "{searchTerm}".</p>
                    </div>
                )}
            </main>
        </div>
    );
}