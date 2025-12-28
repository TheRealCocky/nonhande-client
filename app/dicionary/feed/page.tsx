'use client';

import React, { useEffect, useState } from 'react';
import { dictionaryService, WordResponse } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search } from 'lucide-react';
// CORREÇÃO: Removido o import LucideIcon que não era utilizado

// IMPORTAÇÕES
import WordCard from '@/components/dictionary/WordCard';
import WordSkeleton from '@/components/dictionary/WordSkeleton';
import AuthWallModal from '@/components/modals/AuthWallModal';
import MobileNav from "@/components/shared/MobileNav";

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

        if (!storedToken) {
            const timer = setTimeout(() => {
                if (!localStorage.getItem('nonhande_token')) {
                    setShowAuthModal(true);
                }
            }, 1500);
            loadWords();
            return () => clearTimeout(timer);
        }

        loadWords();
    }, []);

    async function loadWords() {
        setLoading(true);
        try {
            const response = await dictionaryService.getAll(1, 100);
            const items = response.data?.items || response.data || [];
            setWords(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error("Erro ao carregar acervo:", error);
        } finally {
            setLoading(false);
        }
    }

    const playAudio = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();

        const currentToken = localStorage.getItem('nonhande_token');
        if (!currentToken) {
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
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative pb-32 md:pb-20">

            {/* MODAL DE PROTEÇÃO */}
            {showAuthModal && (
                <AuthWallModal onClose={() => setShowAuthModal(false)} />
            )}

            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-custom">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gold/10 rounded-full transition-all text-foreground/70 hover:text-gold">
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase italic leading-none">Nonhande</h1>
                            <span className="text-[9px] text-text-secondary font-bold tracking-[0.2em] uppercase mt-1">Legado Nhaneca-Humbe</span>
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
                {/* BARRA DE PESQUISA */}
                <div className="max-w-2xl mx-auto mb-16 px-2">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Procurar termo..."
                            className="w-full bg-card-custom border border-border-custom rounded-[24px] p-5 md:p-7 text-lg md:text-2xl font-semibold outline-none focus:border-gold transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-secondary/30 group-focus-within:text-gold transition-colors pr-6">
                            <Search size={22} />
                        </div>
                    </div>
                </div>

                {/* GRID DE RESULTADOS */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 transition-all duration-700 ${!token && !loading ? 'blur-sm pointer-events-none select-none opacity-50' : ''}`}>
                    {loading ? (
                        [...Array(6)].map((_, i) => <WordSkeleton key={i} />)
                    ) : (
                        filteredWords.map((word) => (
                            <WordCard
                                key={word.id}
                                word={word}
                                isLocked={!token}
                                onAction={(_e: React.MouseEvent) => { // CORREÇÃO: _e para evitar warning de unused
                                    const checkToken = localStorage.getItem('nonhande_token');
                                    if (!checkToken) {
                                        setShowAuthModal(true);
                                    } else {
                                        router.push(`/dicionary/feed/${word.id}`);
                                    }
                                }}
                                onPlayAudio={playAudio}
                            />
                        ))
                    )}
                </div>

                {/* FEEDBACK VAZIO */}
                {!loading && filteredWords.length === 0 && (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
                        <Search size={40} className="text-gold/30" />
                        <p className="italic font-medium text-lg">Nenhum termo ancestral encontrado para &quot;{searchTerm}&quot;</p>
                    </div>
                )}
            </main>

            <MobileNav />
        </div>
    );
}