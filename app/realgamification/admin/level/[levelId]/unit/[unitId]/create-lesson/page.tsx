'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2, Sparkles, BookOpen, Star } from 'lucide-react';
import { gamificationService } from '@/services/api';

export default function CreateLessonPage() {
    const params = useParams();
    const router = useRouter();

    // IDs extraídos da URL de forma segura
    const levelId = params?.levelId as string;
    const unitId = params?.unitId as string;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        order: 1,
        xpReward: 100
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!unitId || unitId === 'undefined') {
            alert("Erro: ID da unidade não encontrado.");
            return;
        }

        setLoading(true);

        try {
            // Chamada exata para a tua API: title, order, unitId, xpReward
            await gamificationService.createLesson({
                title: formData.title,
                order: Number(formData.order),
                unitId: unitId,
                xpReward: Number(formData.xpReward)
            });

            // Após criar, volta para o gestor da unidade
            router.push(`/realgamification/admin/level/${levelId}/unit/${unitId}`);
            router.refresh();
        } catch (error: any) {
            console.error("Erro ao forjar lição:", error);
            alert(error.response?.data?.message || "Erro ao criar lição no Reino.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-500">
            <div className="max-w-2xl mx-auto">
                {/* BOTÃO VOLTAR */}
                <Link
                    href={`/realgamification/admin/level/${levelId}/unit/${unitId}`}
                    className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-gold mb-12 transition-all"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Regressar à Unidade
                </Link>

                {/* CABEÇALHO */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gold/10 rounded-lg text-gold shadow-sm">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Arquitetura de Ensino</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        Nova <span className="text-muted-foreground/30 not-italic font-medium">Lição</span>
                    </h1>
                </div>

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className="space-y-8 bg-card p-10 rounded-[40px] border border-border shadow-2xl">
                    {/* TÍTULO */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Título da Lição</label>
                        <input
                            required
                            type="text"
                            placeholder="Ex: Introdução ao Alfabeto"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-background border border-border rounded-2xl p-5 font-bold focus:outline-none focus:border-gold/50 transition-all text-foreground text-xl placeholder:text-muted-foreground/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ORDEM */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Posição na Sequência</label>
                            <input
                                required
                                type="number"
                                min="1"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                className="w-full bg-background border border-border rounded-2xl p-5 font-bold focus:outline-none focus:border-gold/50 transition-all text-foreground"
                            />
                        </div>

                        {/* XP REWARD */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-emerald-500">Recompensa (XP)</label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    step="50"
                                    value={formData.xpReward}
                                    onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-background border border-border rounded-2xl p-5 font-bold focus:outline-none focus:border-emerald-500/50 transition-all text-foreground pl-14"
                                />
                                <Star className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* SUBMETER */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background py-7 rounded-[28px] font-black uppercase text-[11px] tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Consolidar Lição
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 italic">
                    Após consolidar, poderás adicionar os desafios no Gestor de Unidade.
                </p>
            </div>
        </div>
    );
}