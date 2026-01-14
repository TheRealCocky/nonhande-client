'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Trash2,
    Layers,
    ShieldCheck,
    Sparkles,
    BookOpen,
    ArrowUpRight
} from 'lucide-react';
import { gamificationService } from '@/services/api';

// 1. DEFINIÇÃO DA INTERFACE (Mata o erro L18)
interface Level {
    id: string;
    title: string;
    order: number;
    language: string;
    units?: any[]; // Podemos manter any aqui se não usarmos propriedades internas da unidade neste ecrã
}

export default function AdminDashboard() {
    // Tipagem do Estado
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLevels();
    }, []);

    const loadLevels = async () => {
        try {
            const { data } = await gamificationService.getTrail('nhaneca');
            setLevels(data);
        } catch (error) {
            console.error("Erro ao carregar níveis:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-[70vh] items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold animate-pulse">Acedendo aos Arquivos Nonhande...</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen bg-background text-foreground transition-all">

            {/* CABEÇALHO ESTRUTURAL */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gold/10 rounded-lg">
                            <ShieldCheck size={16} className="text-gold" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Painel do Mestre</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                        Gestão da <span className="text-gold">Trilha</span>
                    </h1>
                    <p className="text-text-secondary text-sm font-bold opacity-70 mt-3 max-w-md">
                        Arquitetura de ensino e curadoria da língua Nhaneca-Humbe. Configure a jornada dos seus alunos.
                    </p>
                </div>

                <button
                    onClick={() => alert('Abrir modal de criação de Nível')}
                    className="group bg-gold text-white font-black px-8 py-5 rounded-[24px] shadow-[0_12px_24px_-8px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase text-xs tracking-[0.2em]"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Novo Nível
                </button>
            </header>

            {/* LISTAGEM DE NÍVEIS */}
            <div className="grid gap-6">
                {levels.length === 0 ? (
                    <div className="bg-platinum/5 border-2 border-dashed border-platinum/30 rounded-[48px] p-24 text-center">
                        <Layers size={48} className="text-platinum/40 mx-auto mb-4" />
                        <p className="text-text-secondary font-black uppercase tracking-widest text-xs">O mapa está virgem, Mestre.</p>
                        <p className="text-[10px] text-text-secondary/60 mt-2 italic font-medium">Inicie a construção da sabedoria ancestral agora.</p>
                    </div>
                ) : (
                    levels.map((level: Level) => (
                        <div
                            key={level.id}
                            className="group relative bg-card-custom border border-platinum/40 rounded-[35px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center hover:border-gold/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden"
                        >
                            {/* LINHA DE STATUS LATERAL */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 rounded-l-full" />

                            <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                                <div className="w-16 h-16 bg-background border-2 border-platinum rounded-[22px] flex items-center justify-center font-black text-2xl text-gold shadow-inner group-hover:border-gold group-hover:rotate-6 transition-all duration-500">
                                    {level.order}
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter group-hover:text-gold transition-colors">
                                        {level.title}
                                    </h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-text-secondary tracking-widest bg-platinum/10 px-3 py-1 rounded-full border border-platinum/20">
                                            <BookOpen size={12} className="text-gold" />
                                            {level.units?.length || 0} Unidades
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-text-secondary tracking-widest bg-platinum/10 px-3 py-1 rounded-full border border-platinum/20">
                                            <Sparkles size={12} className="text-gold" />
                                            Idioma: {level.language}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-8 md:mt-0 w-full md:w-auto border-t md:border-t-0 border-platinum/10 pt-8 md:pt-0">
                                <Link
                                    href={`/gamification/admin/level/${level.id}`}
                                    className="flex-1 md:flex-none h-14 bg-platinum/20 hover:bg-gold hover:text-white text-foreground font-black px-8 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-platinum/50 group/btn shadow-sm active:translate-y-1"
                                >
                                    Gerir Conteúdo
                                    <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </Link>

                                <button
                                    title="Eliminar Nível"
                                    className="w-14 h-14 flex items-center justify-center text-text-secondary hover:text-red-500 bg-background border border-platinum/50 hover:border-red-500/30 hover:bg-red-500/5 rounded-2xl transition-all shadow-sm active:scale-90"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="mt-20 pt-10 border-t border-platinum/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <QuickStat label="Trilhas Ativas" value="04" />
                    <QuickStat label="Total Alunos" value="1.2k" />
                    <QuickStat label="Taxa Conclusão" value="82%" />
                    <QuickStat label="Status Sistema" value="ONLINE" color="text-emerald-500" />
                </div>
            </footer>
        </div>
    );
}

function QuickStat({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) {
    return (
        <div className="bg-platinum/5 border border-platinum/30 p-6 rounded-[28px] hover:bg-platinum/10 transition-colors">
            <p className="text-[9px] font-black text-gold uppercase tracking-[0.3em] mb-2">{label}</p>
            <p className={`text-2xl font-black tracking-tighter italic ${color}`}>{value}</p>
        </div>
    );
}