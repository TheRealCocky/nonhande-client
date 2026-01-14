'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { gamificationService } from '@/services/api';

export default function UnitManager() {
    const { levelId, unitId } = useParams();
    const [unit, setUnit] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUnitData();
    }, [unitId]);

    const loadUnitData = async () => {
        try {
            const { data } = await gamificationService.getTrail('nhaneca');
            // Encontramos o Nível e depois a Unidade específica
            const currentLevel = data.find((l: any) => l.id === levelId);
            const currentUnit = currentLevel?.units?.find((u: any) => u.id === unitId);
            setUnit(currentUnit);
        } catch (error) {
            console.error("Erro ao carregar unidade:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-600">A carregar lições...</div>;

    return (
        <div className="p-8">
            {/* NAVEGAÇÃO / BREADCRUMB */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href={`/gamification/admin/level/${levelId}`} className="text-sm font-bold text-blue-600 hover:underline">
                        ← VOLTAR PARA UNIDADES
                    </Link>
                    <h1 className="mt-2 text-3xl font-black text-slate-900">
                        {unit?.title || 'Unidade'}
                    </h1>
                    <p className="text-slate-500 text-sm italic">Gestão de Lições da Unidade (ID: {unitId})</p>
                </div>

                <button className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 transition-all shadow-md">
                    + Nova Lição
                </button>
            </div>

            {/* LISTA DE LIÇÕES */}
            <div className="grid gap-4">
                {unit?.lessons?.length > 0 ? (
                    unit.lessons.map((lesson: any) => (
                        <div
                            key={lesson.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-700 font-bold border">
                                    {lesson.order}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{lesson.title}</h3>
                                    <div className="flex gap-3 mt-1">
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      {lesson.xpReward} XP
                    </span>
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">
                      {lesson.access}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* ROTA FINAL: admin/level/[levelId]/unit/[unitId]/lesson/[lessonId] */}
                                <Link
                                    href={`/gamification/admin/level/${levelId}/unit/${unitId}/lesson/${lesson.id}`}
                                    className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-black transition-colors"
                                >
                                    Ver Desafios
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <p className="text-slate-400">Esta unidade ainda não possui lições. Clique no botão acima para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}