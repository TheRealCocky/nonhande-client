'use client';

import React, { useEffect, useState } from 'react';
import { dictionaryService, WordResponse } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search } from 'lucide-react';

// IMPORTAÇÕES DE COMPONENTES
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

        // Se não houver token, mostramos o modal após um breve delay para impacto visual
        if (!storedToken) {
            const timer = setTimeout(() => setShowAuthModal(true), 1200);
            loadWords(); // Carregamos na mesma para o efeito de desfoque (blur) atrás
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
        <div className="h-screen overflow-hidden flex flex-col bg-background text-foreground transition-colors duration-500 relative">

            {/* MODAL REFACTORADO - Aparece se showAuthModal for true */}
            {showAuthModal && (
                <AuthWallModal />
            )}

            {/* --- ZONA SUPERIOR FIXA --- */}
            <div className="flex-none z-50 bg-background pt-4">
                <header className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gold/10 rounded-full transition-all text-foreground/70 hover:text-gold">
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase italic leading-none">Nonhande</h1>
                            <span className="text-[9px] text-text-secondary font-bold tracking-[0.2em] uppercase mt-1">Legado Nhaneca-Humbe</span>
                        </div>
                    </div>

                    {/* Botão de Upload protegido por Role */}
                    {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                        <Link href="/dicionary/upload" className="bg-gold hover:bg-gold-dark text-white px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest">
                            <Plus size={16} />
                            <span className="hidden sm:inline">Novo Termo</span>
                        </Link>
                    )}
                </header>

                <div className="max-w-2xl mx-auto px-6 py-6 md:py-10">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Procurar termo ancestral..."
                            className="w-full bg-card-custom border border-border-custom rounded-[28px] p-5 md:p-7 text-lg md:text-2xl font-semibold outline-none focus:border-gold transition-all shadow-xl shadow-black/5"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors">
                            <Search size={24} />
                        </div>
                    </div>
                </div>

                <div className="h-8 bg-gradient-to-b from-background to-transparent w-full" />
            </div>

            {/* --- ZONA DE SCROLL (Com Blur se não houver Token) --- */}
            <main className="flex-1 overflow-y-auto px-6 pb-32 -mt-8 pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* A classe blur-sm e pointer-events-none garantem que sem token o conteúdo é apenas visual e inacessível */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 transition-all duration-700 ${(!token || showAuthModal) && !loading ? 'blur-md pointer-events-none select-none opacity-40 scale-[0.98]' : ''}`}>
                        {loading ? (
                            [...Array(18)].map((_, i) => <WordSkeleton key={i} />)
                        ) : (
                            filteredWords.map((word) => (
                                <WordCard
                                    key={word.id}
                                    word={word}
                                    isLocked={!token}
                                    onAction={(_e: React.MouseEvent) => {
                                        if (!token) {
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

                    {!loading && filteredWords.length === 0 && (
                        <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
                            <Search size={40} className="text-gold/30" />
                            <p className="italic font-medium text-lg text-gold/60">Nenhum termo encontrado para &quot;{searchTerm}&quot;</p>
                        </div>
                    )}
                </div>
            </main>

            <MobileNav />
        </div>
    );
}