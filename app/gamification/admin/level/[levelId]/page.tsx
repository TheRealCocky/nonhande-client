'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Plus, Layout, ArrowRight, Settings } from 'lucide-react';
import { gamificationService } from '@/services/api';

// 1. INTERFACES PARA O BUILD (Adeus 'any')
interface Unit {
    id: string;
    title: string;
    order: number;
    lessons?: any[];
}

interface Level {
    id: string;
    title: string;
    units: Unit[];
}

export default function LevelManager() {
    const params = useParams();
    const levelId = params?.levelId as string;

    const [level, setLevel] = useState<Level | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (levelId) loadLevelData();
    }, [levelId]);

    const loadLevelData = async () => {
        try {
            const { data } = await gamificationService.getTrail('nhaneca');
            // Tipificamos o 'l' como Level
            const currentLevel = data.find((l: Level) => l.id === levelId);
            setLevel(currentLevel || null);
        } catch (error) {
            console.error("Erro ao carregar nível:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center bg-background">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen">
            {/* NAVEGAÇÃO SUPERIOR */}
            <div className="mb-12">
                <Link
                    href="/gamification/admin"
                    className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-gold transition-colors"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para a Trilha
                </Link>

                <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-gold opacity-80">
                            <Settings size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Painel de Configuração</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">
                            {level?.title || 'Nível'}
                        </h1>
                        <p className="text-text-secondary text-[10px] font-bold mt-2 uppercase tracking-widest opacity-50">
                            Módulo de Unidades • ID: {levelId.slice(0, 8)}...
                        </p>
                    </div>

                    <button className="bg-gold text-white font-black px-8 py-4 rounded-2xl shadow-[0_8px_0_0_#b8962e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 text-xs uppercase tracking-widest">
                        <Plus size={18} /> Nova Unidade
                    </button>
                </div>
            </div>

            {/* LISTA DE UNIDADES */}
            <div className="grid gap-4">
                <div className="flex items-center gap-2 mb-4">
                    <Layout size={18} className="text-gold" />
                    <h2 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Estrutura de Ensino</h2>
                </div>

                {level?.units && level.units.length > 0 ? (
                    level.units.map((unit: Unit) => (
                        <div
                            key={unit.id}
                            className="group flex items-center justify-between rounded-[32px] border border-platinum/50 bg-card-custom p-8 hover:border-gold/40 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-6">
                                <div className="text-3xl font-black text-platinum group-hover:text-gold transition-colors italic">
                                    U{unit.order || '1'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">
                                        {unit.title}
                                    </h3>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mt-1 opacity-60">
                                        {unit.lessons?.length || 0} Lições configuradas para este bloco
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={`/gamification/admin/level/${levelId}/unit/${unit.id}`}
                                className="flex items-center gap-2 bg-foreground text-background px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-lg"
                            >
                                Gerir Conteúdo
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="rounded-[40px] border-2 border-dashed border-platinum/30 p-20 text-center bg-platinum/5">
                        <p className="text-text-secondary font-black uppercase tracking-widest text-xs">Vazio</p>
                        <p className="text-text-secondary/60 text-[10px] mt-2 italic">Não foram encontradas unidades neste nível.</p>
                    </div>
                )}
            </div>
        </div>
    );
}