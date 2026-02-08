'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    Plus, Layers, ChevronRight, Settings,
    Database, Loader2, ArrowLeft, Pencil, Trash2
} from 'lucide-react';
import { gamificationService, Level } from '@/services/api';

export default function AdminDashboard() {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await gamificationService.getTrail('nhaneca');

            // CORREÇÃO: Como o Axios está tipado na api.ts, response.data já é Level[]
            // Removemos a verificação complexa que causava o erro 'never'
            const data = response.data;
            setLevels(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("❌ Erro ao carregar estrutura:", error);
            setLevels([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDeleteLevel = async (levelId: string, title: string) => {
        if (typeof window !== 'undefined' && window.confirm(`Mestre, tens a certeza que desejas destruir o nível "${title}"?\n\nCuidado: Todas as Unidades e Lições deste nível serão apagadas para sempre!`)) {
            setDeletingId(levelId);
            try {
                await gamificationService.deleteLevel(levelId);
                setLevels(prev => prev.filter(l => l.id !== levelId));
            } catch {
                alert("Erro ao apagar o nível do servidor.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-background italic font-black text-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            <span className="tracking-[0.3em]">SINCRONIZANDO COM A MONHANDE...</span>
        </div>
    );

    const totalUnits = levels.reduce((acc, lvl) => acc + (lvl.units?.length || 0), 0);
    const totalLessons = levels.reduce((acc, lvl) => {
        const lessonsInLevel = lvl.units?.reduce((uAcc, unit) => uAcc + (unit.lessons?.length || 0), 0) || 0;
        return acc + lessonsInLevel;
    }, 0);

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans transition-colors duration-500">

            <div className="max-w-6xl mx-auto mb-8">
                <Link
                    href="/realgamification/map"
                    className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-muted/50 hover:bg-gold/10 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-all duration-300 border border-border hover:border-gold/20"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Sair do Painel Mestre
                </Link>
            </div>

            <header className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="text-gold" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold">Controle Mestre</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">
                        Arquitetura <span className="text-muted-foreground/30 text-4xl block md:inline font-normal not-italic tracking-normal">Nhaneca</span>
                    </h1>
                </div>

                <Link
                    href="/realgamification/admin/create-level"
                    className="group bg-foreground text-background px-8 py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95"
                >
                    <Plus size={18} />
                    Forjar Novo Nível
                </Link>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card p-8 rounded-[40px] border border-border shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Estado da Trilha</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                <span className="text-sm font-bold opacity-60">Níveis Ativos</span>
                                <span className="text-2xl font-black italic text-gold">{levels.length}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                <span className="text-sm font-bold opacity-60">Unidades</span>
                                <span className="text-2xl font-black italic text-gold">{totalUnits}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold opacity-60">Total de Lições</span>
                                <span className="text-2xl font-black italic text-gold">{totalLessons}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4 mb-4 flex items-center gap-2">
                        <Layers size={14} /> Hierarquia Ancestral
                    </h3>

                    {levels.length === 0 ? (
                        <div className="p-20 border-2 border-dashed border-border rounded-[40px] flex flex-col items-center justify-center opacity-40 text-center bg-card/50">
                            <Database size={48} className="mb-4 text-muted-foreground" />
                            <p className="font-black uppercase text-xs tracking-widest text-muted-foreground">O Arquivo está Vazio</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {[...levels].sort((a, b) => a.order - b.order).map((level) => (
                                <div key={level.id} className="group relative bg-card border border-border rounded-[32px] p-6 hover:border-gold/50 transition-all overflow-hidden shadow-sm">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border group-hover:border-gold/50 transition-colors">
                                                <span className="text-gold font-black italic text-xl">{level.order}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black uppercase italic tracking-tighter text-foreground">{level.title}</h4>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {level.units?.length || 0} Unidades • ID: {level.id.slice(-5)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/realgamification/admin/level/${level.id}/edit`}
                                                className="p-3 rounded-xl bg-muted/50 text-muted-foreground hover:text-gold transition-all"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                            <button
                                                onClick={() => handleDeleteLevel(level.id, level.title)}
                                                disabled={deletingId === level.id}
                                                className="p-3 rounded-xl bg-muted/50 text-muted-foreground hover:text-red-500 transition-all disabled:opacity-50"
                                            >
                                                {deletingId === level.id ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>

                                            <div className="w-[1px] h-8 bg-border mx-2" />

                                            <Link
                                                href={level.units && level.units.length > 0
                                                    ? `/realgamification/admin/level/${level.id}/unit/${level.units[0].id}`
                                                    : `/realgamification/admin/level/${level.id}/create-unit`
                                                }
                                                className="p-4 rounded-xl bg-foreground text-background hover:bg-gold hover:text-white transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}