'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2, Trophy } from 'lucide-react';
import { gamificationService } from '@/services/api';

export default function CreateUnit() {
    const params = useParams();
    const router = useRouter();
    const { levelId } = params;

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await gamificationService.createUnit({
                title,
                order,
                levelId: levelId as string
            });

            router.push(`/realgamification/admin`);
            router.refresh();
        } catch (error) {
            console.error("Erro ao criar unidade:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-3xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* VOLTAR - Usa cores suaves que se adaptam */}
            <Link
                href="/realgamification/admin"
                className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold mb-8 tracking-widest transition-colors"
            >
                <ChevronLeft size={14} /> Voltar ao Painel
            </Link>

            <header className="mb-10">
                <h1 className="text-4xl font-black uppercase italic text-gold">Nova Unidade</h1>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-2">
                    Nível ID: <span className="text-foreground/60">{levelId}</span>
                </p>
            </header>

            {/* CARD DO FORMULÁRIO - Usa bg-card e border-border */}
            <form
                onSubmit={handleSubmit}
                className="bg-card p-8 rounded-[40px] border border-border shadow-xl space-y-8 transition-all"
            >
                {/* TÍTULO */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-wider">
                        Título da Unidade (Ex: Saudações)
                    </label>
                    <input
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Insira o nome da unidade..."
                        className="w-full p-4 rounded-2xl bg-background border-2 border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all font-bold text-foreground placeholder:opacity-30"
                    />
                </div>

                {/* ORDEM */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-wider">
                        Ordem na Trilha
                    </label>
                    <input
                        type="number"
                        required
                        value={order}
                        onChange={e => setOrder(Number(e.target.value))}
                        className="w-full p-4 rounded-2xl bg-background border-2 border-border focus:border-gold outline-none transition-all font-bold text-foreground"
                    />
                </div>

                {/* BOTÃO - Mantém o contraste alto ou usa cores primárias do tema */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground text-background font-black py-6 rounded-3xl hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] disabled:opacity-30 shadow-lg"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Trophy size={20} />
                            Estabelecer Unidade
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}