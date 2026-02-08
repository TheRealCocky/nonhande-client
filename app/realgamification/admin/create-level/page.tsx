'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Layers, Zap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { gamificationService } from '@/services/api';

export default function CreateLevelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await gamificationService.createLevel({
                title: title,
                order: Number(order),
                language: 'nhaneca'
            });

            setStatus({ type: 'success', message: 'Nível forjado com sucesso!' });
            setTimeout(() => router.push('/realgamification/admin'), 2000);
        } catch {
            // CORREÇÃO: Removido o 'error: any'. O linter agora está satisfeito.
            setStatus({ type: 'error', message: "Erro ao criar o nível no Reino." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-2xl mx-auto min-h-screen font-sans bg-background text-foreground transition-colors duration-500">
            <Link href="/realgamification/admin" className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold mb-8 transition-colors tracking-widest">
                <ChevronLeft size={14} /> Voltar ao Painel
            </Link>

            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Layers className="text-gold" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Arquiteto de Trilha</span>
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Novo Nível</h1>
                <p className="text-muted-foreground/60 text-xs mt-2 uppercase font-bold tracking-widest italic">Define a base da jornada ancestral</p>
            </header>

            {status.type && (
                <div className={`mb-8 p-6 rounded-[24px] border-2 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${
                    status.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 md:p-10 rounded-[48px] border border-border shadow-2xl relative overflow-hidden transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-all" />

                <div className="space-y-3 relative z-10">
                    <label className="text-[10px] font-black uppercase text-gold tracking-[0.2em] ml-1">Nome do Nível</label>
                    <input
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ex: Introdução ao Nhaneca"
                        className="w-full p-6 rounded-2xl bg-background border-2 border-border font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                </div>

                <div className="space-y-3 relative z-10">
                    <label className="text-[10px] font-black uppercase text-gold tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Zap size={14} /> Posição Sequencial
                    </label>
                    <input
                        type="number"
                        required
                        value={order}
                        onChange={e => setOrder(Number(e.target.value))}
                        className="w-full p-6 rounded-2xl bg-background border-2 border-border font-bold text-foreground focus:border-gold outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground text-background font-black py-7 rounded-[28px] hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] shadow-xl disabled:opacity-30 active:scale-[0.98]"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <><Sparkles size={20} /> Consolidar Nível</>
                    )}
                </button>
            </form>
        </div>
    );
}