'use client';

import React, { useEffect, useState } from 'react';
import { dictionaryService, WordResponse } from '@/services/api';
import { Search, Edit3, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManageWordsPage() {
    const [words, setWords] = useState<WordResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wordId: string; wordTerm: string }>({
        isOpen: false,
        wordId: '',
        wordTerm: '',
    });

    useEffect(() => {
        loadWords();
    }, []);

    async function loadWords() {
        setLoading(true);
        try {
            const res = await dictionaryService.getAll(1, 2000);
            setWords(res.data?.items || []);
        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredWords = words.filter(w =>
        w.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
        try {
            await dictionaryService.deleteWord(deleteModal.wordId);
            setWords(words.filter(w => w.id !== deleteModal.wordId));
            setDeleteModal({ ...deleteModal, isOpen: false });
        } catch (error) {
            alert("Erro ao eliminar termo.");
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
                            Gestão do <span className="text-gold">Acervo</span>
                        </h1>
                        <p className="text-[10px] font-bold text-silver-dark uppercase tracking-widest mt-1">Apenas para Educadores e Administradores</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-dark" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar termo ou tradução..."
                            className="w-full bg-card-custom border border-border-custom rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-gold outline-none transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredWords.map((word) => (
                            <div key={word.id} className="bg-card-custom border border-border-custom p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center hover:border-gold/30 transition-all group">
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-black text-foreground uppercase">{word.term}</h3>
                                    <p className="text-gold text-xs font-bold uppercase tracking-widest">{word.meaning}</p>
                                    <span className="text-[8px] bg-platinum/10 px-2 py-1 rounded-md text-silver-dark mt-2 inline-block uppercase font-black">
                                        {word.grammaticalType} • {word.category}
                                    </span>
                                </div>

                                <div className="flex gap-3 mt-6 md:mt-0">
                                    <Link
                                        href={`/dicionary/manage/edit/${word.id}`}
                                        className="p-4 bg-gold/10 text-gold rounded-2xl hover:bg-gold hover:text-white transition-all shadow-xl shadow-gold/5"
                                    >
                                        <Edit3 size={20} />
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: true, wordId: word.id, wordTerm: word.term })}
                                        className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE DELEÇÃO */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card-custom border-2 border-red-500/20 p-8 md:p-12 rounded-[40px] max-w-sm w-full text-center shadow-2xl relative">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-black text-foreground uppercase italic mb-2">Tens a certeza?</h2>
                        <p className="text-xs text-silver-dark font-medium mb-8 leading-relaxed">
                            Vais eliminar o termo <span className="text-foreground font-black">&quot;{deleteModal.wordTerm}&quot;</span>. Esta ação é irreversível.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all">Eliminar Agora</button>
                            <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="w-full py-4 bg-transparent text-silver-dark font-black uppercase text-[10px]">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}