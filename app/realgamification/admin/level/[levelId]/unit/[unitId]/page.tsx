'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Plus,
    ArrowRight,
    Loader2,
    PlayCircle,
    LayoutGrid,
    Pencil,
    Trash2
} from 'lucide-react';
import { gamificationService } from '@/services/api';

export default function UnitManager() {
    const params = useParams();
    const router = useRouter();

    // IDs extraídos da URL de forma segura
    const levelId = params?.levelId as string;
    const unitId = params?.unitId as string;

    const [unit, setUnit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (levelId && unitId) loadUnitData();
    }, [levelId, unitId]);

    const loadUnitData = async () => {
        try {
            setLoading(true);
            const { data } = await gamificationService.getTrail('nhaneca');

            // 1. Normaliza a trilha (garante que é um array)
            const trail = Array.isArray(data) ? data : (data?.data || []);

            // 2. BUSCA ROBUSTA: Convertemos tudo para String e removemos espaços (trim)
            const currentLevel = trail.find((l: any) =>
                String(l.id).trim() === String(levelId).trim()
            );

            if (currentLevel) {
                // 3. Busca a unidade dentro do nível encontrado
                const currentUnit = currentLevel.units?.find((u: any) =>
                    String(u.id).trim() === String(unitId).trim()
                );

                // LOG DE DEBUG: Se abrir o console (F12), verás se ele encontrou ou não
                if (!currentUnit) {
                    console.warn(`⚠️ Unidade ${unitId} não encontrada no Nível ${levelId}`);
                }

                setUnit(currentUnit || null);
            } else {
                console.warn(`⚠️ Nível ${levelId} não encontrado na Trilha.`);
                setUnit(null);
            }
        } catch (error) {
            console.error("❌ Erro fatal ao carregar unidade:", error);
            setUnit(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string, title: string) => {
        if (window.confirm(`Mestre, tens a certeza que desejas apagar a lição "${title}"?`)) {
            setDeletingId(lessonId);
            try {
                await gamificationService.deleteLesson(lessonId);
                // Atualiza a lista local
                setUnit((prev: any) => ({
                    ...prev,
                    lessons: prev.lessons.filter((l: any) => l.id !== lessonId)
                }));
            } catch (error) {
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
                {unit?.lessons?.sort((a:any, b:any) => a.order - b.order).map((lesson: any) => (
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
                            {/* EDITAR LIÇÃO */}
                            <Link
                                href={`/realgamification/admin/level/${levelId}/unit/${unitId}/lesson/${lesson.id}/edit`}
                                className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-gold transition-all"
                            >
                                <Pencil size={18} />
                            </Link>

                            {/* APAGAR LIÇÃO */}
                            <button
                                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                disabled={deletingId === lesson.id}
                                className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-red-500 transition-all"
                            >
                                {deletingId === lesson.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                            </button>

                            <div className="w-[1px] h-6 bg-border mx-2" />

                            {/* GERIR ATIVIDADES (DESAFIOS) */}
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