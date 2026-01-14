'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ChevronLeft, Plus, Layers,
    ArrowRight, Map as MapIcon
} from 'lucide-react';
import { gamificationService } from '@/services/api';

// 1. INTERFACES PARA MATAR O ERRO 'ANY'
interface Lesson {
    id: string;
}

interface Unit {
    id: string;
    title: string;
    order: number;
    description?: string;
    lessons: Lesson[];
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
            // Tipamos a busca para o TypeScript não reclamar
            const currentLevel = data.find((l: Level) => l.id === levelId);
            setLevel(currentLevel || null);
        } catch (error) {
            console.error("Erro ao carregar nível:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen">
            {/* CABEÇALHO */}
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
                        <div className="flex items-center gap-2 mb-2 text-gold">
                            <MapIcon size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Nível Selecionado</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">
                            {level?.title || 'Carregando...'}
                        </h1>
                    </div>

                    <button className="bg-gold text-white font-black px-8 py-4 rounded-2xl shadow-[0_8px_0_0_#b8962e] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 text-xs uppercase tracking-widest">
                        <Plus size={18} /> Nova Unidade
                    </button>
                </div>
            </div>

            {/* LISTAGEM DE UNIDADES */}
            <div className="grid gap-4">
                <div className="flex items-center gap-2 mb-4">
                    <Layers size={18} className="text-gold" />
                    <h2 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Unidades de Ensino</h2>
                </div>

                {level?.units && level.units.length > 0 ? (
                    level.units.map((unit: Unit) => (
                        <div
                            key={unit.id}
                            className="group flex items-center justify-between rounded-[32px] border border-platinum/50 bg-card-custom p-8 hover:border-gold/40 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-6">
                                <div className="text-3xl font-black text-platinum group-hover:text-gold/20 transition-colors italic">
                                    U{unit.order}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">
                                        {unit.title}
                                    </h3>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] mt-1 opacity-60">
                                        Contém {unit.lessons?.length || 0} lições estruturadas
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={`/gamification/admin/level/${levelId}/unit/${unit.id}`}
                                className="flex items-center gap-2 bg-foreground text-background px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all"
                            >
                                Entrar na Unidade
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="rounded-[40px] border-2 border-dashed border-platinum/30 p-20 text-center">
                        <p className="text-text-secondary font-black uppercase tracking-widest text-xs">Sem Unidades</p>
                    </div>
                )}
            </div>
        </div>
    );
}