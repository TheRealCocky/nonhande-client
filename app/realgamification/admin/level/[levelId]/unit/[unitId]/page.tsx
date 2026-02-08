'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ChevronLeft,
    Plus,
    Loader2,
    LayoutGrid,
    Pencil,
    Trash2
} from 'lucide-react';
import { gamificationService, Level, Unit } from '@/services/api';

export default function UnitManager() {
    const params = useParams();

    const levelId = params?.levelId as string;
    const unitId = params?.unitId as string;

    const [unit, setUnit] = useState<Unit | null>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadUnitData = useCallback(async () => {
        try {
            setLoading(true);
            // CORREÇÃO: A resposta agora vem tipada diretamente como Level[]
            const response = await gamificationService.getTrail('nhaneca');

            // O axios coloca o retorno em response.data.
            // Como tipamos a API com <Level[]>, o data aqui já é o array de níveis.
            const trail: Level[] = response.data || [];

            const currentLevel = trail.find((l) =>
                String(l.id).trim() === String(levelId).trim()
            );

            if (currentLevel) {
                // CORREÇÃO: Tipagem implícita através do find no array de units do Level
                const currentUnit = currentLevel.units?.find((u) =>
                    String(u.id).trim() === String(unitId).trim()
                );

                setUnit(currentUnit || null);
            } else {
                setUnit(null);
            }
        } catch (error) {
            console.error("❌ Erro fatal ao carregar unidade:", error);
            setUnit(null);
        } finally {
            setLoading(false);
        }
    }, [levelId, unitId]);

    useEffect(() => {
        if (levelId && unitId) {
            loadUnitData();
        }
    }, [levelId, unitId, loadUnitData]);

    const handleDeleteLesson = async (lessonId: string, title: string) => {
        if (window.confirm(`Mestre, tens a certeza que desejas apagar a lição "${title}"?`)) {
            setDeletingId(lessonId);
            try {
                await gamificationService.deleteLesson(lessonId);
                setUnit((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        lessons: prev.lessons.filter((l) => l.id !== lessonId)
                    };
                });
            } catch {
                alert("Erro ao apagar lição.");
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background italic font-black text-gold">
            <Loader2 className="animate-spin mr-3" /> ACESSANDO ARQUIVOS...
        </div>
    );

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen bg-background text-foreground">
            <header className="mb-12">
                <Link href="/realgamification/admin" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-gold flex items-center gap-2">
                    <ChevronLeft size={14} /> Voltar ao Painel
                </Link>

                <div className="mt-8 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-gold mb-2">
                            <LayoutGrid size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Unidade Atual</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                            {unit?.title || 'Sem Título'}
                        </h1>
                    </div>

                    <Link
                        href={`/realgamification/admin/level/${levelId}/unit/${unitId}/create-lesson`}
                        className="bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gold transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Nova Lição
                    </Link>
                </div>
            </header>

            <div className="grid gap-4">
                {unit?.lessons?.sort((a, b) => a.order - b.order).map((lesson) => (
                    <div key={lesson.id} className="bg-card border border-border p-6 rounded-[32px] flex items-center justify-between group hover:border-gold/50 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-black italic text-gold border border-border">
                                {lesson.order}
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase italic">{lesson.title}</h3>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {lesson.activities?.length || 0} Atividades • {lesson.xpReward || 0} XP
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/realgamification/admin/level/${levelId}/unit/${unitId}/lesson/${lesson.id}/edit`}
                                className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-gold transition-all"
                            >
                                <Pencil size={18} />
                            </Link>

                            <button
                                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                disabled={deletingId === lesson.id}
                                className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-red-500 transition-all"
                            >
                                {deletingId === lesson.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                            </button>

                            <div className="w-[1px] h-6 bg-border mx-2" />

                            <Link
                                href={`/realgamification/admin/level/${levelId}/unit/${unitId}/lesson/${lesson.id}/create-activity`}
                                className="bg-foreground text-background px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center gap-2 hover:bg-gold transition-all"
                            >
                                Gerir Desafios <Plus size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}