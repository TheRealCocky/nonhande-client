'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { dictionaryService, WordResponse } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, X } from 'lucide-react';

import WordCard from '@/components/dictionary/WordCard';
import WordSkeleton from '@/components/dictionary/WordSkeleton';
import AuthWallModal from '@/components/modals/AuthWallModal';
import MobileNav from "@/components/shared/MobileNav";

// Custom hook para não disparar o servidor a cada tecla (Debounce)
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function DicionarioFeedPage() {
    const router = useRouter();
    const [words, setWords] = useState<WordResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 500); // Espera 500ms após o user parar de digitar

    useEffect(() => {
        const storedToken = localStorage.getItem('nonhande_token');
        const role = localStorage.getItem('user_role');
        setToken(storedToken);
        setUserRole(role);

        if (!storedToken) {
            const timer = setTimeout(() => setShowAuthModal(true), 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    // Função de carregar palavras atualizada para suportar busca no Backend
    const loadWords = useCallback(async (search?: string) => {
        setLoading(true);
        try {
            // Chamamos o getAll com 100 itens e o termo de busca
            const response = await dictionaryService.getAll(1, 100, search);
            const items = response.data?.items || response.data || [];
            setWords(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Erro ao carregar palavras:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Dispara a busca sempre que o debouncedSearch mudar
    useEffect(() => {
        loadWords(debouncedSearch);
    }, [debouncedSearch, loadWords]);

    const playAudio = (e: React.MouseEvent, url: string) => {
        e.preventDefault(); e.stopPropagation();
        if (!token) { setShowAuthModal(true); return; }
        new Audio(url).play().catch(() => {});
    };

    return (
        <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-background text-foreground relative">
            {showAuthModal && <AuthWallModal />}

            {/* HEADER FIXO */}
            <div className="flex-none z-50 bg-background pt-4 border-b border-border-custom/10">
                <header className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gold/10 rounded-full text-foreground/70"><ArrowLeft size={22} /></Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-gold uppercase italic leading-none">Nonhande</h1>
                            <span className="text-[9px] text-text-secondary font-bold uppercase tracking-[0.2em] mt-1">Legado Nhaneca-Humbe</span>
                        </div>
                    </div>
                    {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                        <Link href="/dicionary/upload" className="bg-gold text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
                            <Plus size={16} /> <span className="hidden sm:inline">Novo Termo</span>
                        </Link>
                    )}
                </header>

                <div className="max-w-2xl mx-auto px-6 py-6">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Procurar termo..."
                            className="w-full bg-card-custom border border-border-custom/40 rounded-[28px] p-5 text-base md:text-lg outline-none focus:border-gold shadow-2xl transition-all pr-14"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="text-gold/40 hover:text-gold p-1">
                                    <X size={20} />
                                </button>
                            )}
                            <Search className="text-gold/40" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO SCROLLÁVEL */}
            <main className="flex-1 overflow-y-auto px-6 pb-32 pt-4 scrollbar-hide bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${showAuthModal && !loading ? 'blur-2xl opacity-20' : ''}`}>
                        {loading ? (
                            Array.from({ length: 9 }).map((_, i) => (
                                <WordSkeleton key={i} index={i} />
                            ))
                        ) : (
                            words.map((word) => (
                                <WordCard
                                    key={word.id}
                                    word={word}
                                    isLocked={!token}
                                    onAction={() => token ? router.push(`/dicionary/feed/${word.id}`) : setShowAuthModal(true)}
                                    onPlayAudio={playAudio}
                                />
                            ))
                        )}
                    </div>

                    {!loading && words.length === 0 && (
                        <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center">
                                <Search size={40} className="text-gold/20" />
                            </div>
                            <div className="space-y-1">
                                <p className="italic font-bold text-lg text-gold/60">
                                    Nenhum saber encontrado
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-silver-dark font-black">
                                    Tenta procurar por outra variação
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* NAV MOBILE FIXA */}
            <div className="flex-none">
                <MobileNav />
            </div>
        </div>
    );
}