'use client';

import React, { useEffect, useState } from 'react';
import { dictionaryService, WordResponse } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Volume2, ArrowLeft, Plus, Bookmark, Search, BookOpen, Loader2, Lock, Sparkles, X } from 'lucide-react';

export default function DicionarioFeedPage() {
    const router = useRouter();
    const [words, setWords] = useState<WordResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('nonhande_token');
        const role = localStorage.getItem('user_role');
        setToken(storedToken);
        setUserRole(role);
        loadWords();
    }, []);

    async function loadWords() {
        setLoading(true);
        try {
            const response = await dictionaryService.getAll(1, 100);
            const items = response.data?.items || response.data || [];
            setWords(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Erro ao carregar dicionário:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCardClick = (e: React.MouseEvent, wordId: string) => {
        if (!token) {
            e.preventDefault();
            setShowAuthModal(true);
        } else {
            router.push(`/dicionary/feed/${wordId}`);
        }
    };

    const playAudio = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            setShowAuthModal(true);
            return;
        }
        const audio = new Audio(url);
        audio.play().catch(err => console.error("Erro ao tocar áudio:", err));
    };

    const filteredWords = words.filter(word =>
        word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative">

            {/* MODAL DE CONVITE IRRECUSÁVEL */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowAuthModal(false)} />

                    <div className="relative bg-card-custom border border-gold/30 w-full max-w-lg rounded-[40px] p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-6 right-6 text-silver-dark hover:text-gold transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-8 relative">
                                <Lock className="text-gold" size={32} />
                                <Sparkles className="absolute -top-2 -right-2 text-gold animate-pulse" size={24} />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-4">
                                O Saber <span className="text-gold">Aguarda</span> por Ti
                            </h2>

                            <p className="text-text-secondary text-lg font-medium leading-relaxed italic mb-10">
                                &quot;O conhecimento é a única riqueza que cresce quando é partilhada.&quot; <br/>
                                <span className="text-xs uppercase tracking-widest font-black text-silver-dark mt-4 block">
                                    Crie sua conta para aceder ao acervo completo.
                                </span>
                            </p>

                            <div className="grid grid-cols-1 w-full gap-4">
                                <button
                                    onClick={() => router.push('/auth/signin')}
                                    className="bg-gold hover:bg-gold-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-gold/20 active:scale-95"
                                >
                                    Entrar no Círculo de Saber
                                </button>
                                <button
                                    onClick={() => setShowAuthModal(false)}
                                    className="py-4 text-silver-dark font-bold text-[10px] uppercase tracking-widest hover:text-foreground transition-colors"
                                >
                                    Continuar como observador
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-platinum/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gold/10 rounded-full transition-all text-foreground/70 hover:text-gold">
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase italic leading-none">Nonhande</h1>
                            <span className="text-[9px] text-silver-dark font-bold tracking-[0.2em] uppercase mt-1">Legado Nhaneca-Humbe</span>
                        </div>
                    </div>

                    {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                        <Link href="/dicionary/upload" className="bg-gold hover:bg-gold-dark text-white px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest">
                            <Plus size={16} />
                            <span className="hidden sm:inline">Novo Termo</span>
                        </Link>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
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

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-silver-dark animate-pulse">Acedendo ao Acervo</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {filteredWords.map((word) => (
                            <div key={word.id} className="relative group cursor-pointer" onClick={(e) => handleCardClick(e, word.id)}>
                                <div className="block h-full bg-card-custom border border-platinum/20 rounded-[32px] p-8 hover:border-gold/50 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col justify-between relative overflow-hidden">

                                    {!token && (
                                        <div className="absolute top-4 right-4 text-gold/20 group-hover:text-gold transition-colors">
                                            <Lock size={14} />
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-2 bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
                                                <Bookmark size={12} className="text-gold" />
                                                <span className="text-[9px] font-black text-gold uppercase tracking-widest">{word.grammaticalType || 'Vocábulo'}</span>
                                            </div>

                                            {word.audioUrl && (
                                                <button
                                                    onClick={(e) => playAudio(e, word.audioUrl!)}
                                                    className="relative z-20 w-10 h-10 rounded-full bg-foreground/5 text-foreground/70 flex items-center justify-center hover:bg-gold hover:text-white transition-all active:scale-90"
                                                >
                                                    <Volume2 size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <h2 className="text-3xl font-black group-hover:text-gold transition-colors tracking-tighter italic">{word.term}</h2>
                                            <p className="text-text-secondary text-lg font-medium leading-relaxed italic">
                                                &quot;{word.meaning}&quot;
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-platinum/10 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                            <BookOpen size={14} /> Detalhes
                                        </span>
                                        {!token && <Sparkles size={12} className="text-gold" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}