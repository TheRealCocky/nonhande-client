'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { gamificationService } from '@/services/api';

export default function LevelManager() {
    const { levelId } = useParams(); // Captura o ID da URL dinâmica
    const [level, setLevel] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLevelData();
    }, [levelId]);

    const loadLevelData = async () => {
        try {
            const { data } = await gamificationService.getTrail('nhaneca');
            // Encontramos o nível específico dentro da trilha
            const currentLevel = data.find((l: any) => l.id === levelId);
            setLevel(currentLevel);
        } catch (error) {
            console.error("Erro ao carregar nível:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-orange-600">A carregar unidades...</div>;

    return (
        <div className="p-8">
            {/* NAVEGAÇÃO / BREADCRUMB */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/gamification/admin" className="text-sm font-bold text-orange-600 hover:underline">
                        ← VOLTAR PARA NÍVEIS
                    </Link>
                    <h1 className="mt-2 text-3xl font-black text-slate-900">
                        {level?.title || 'Nível'}
                    </h1>
                    <p className="text-slate-500 text-sm">Gerencie as unidades deste nível (ID: {levelId})</p>
                </div>

                <button className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800 transition-all">
                    + Nova Unidade
                </button>
            </div>

            {/* LISTA DE UNIDADES */}
            <div className="grid gap-6">
                {level?.units?.length > 0 ? (
                    level.units.map((unit: any) => (
                        <div
                            key={unit.id}
                            className="group flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-blue-400 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <span className="font-black">U{unit.order || '1'}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{unit.title}</h3>
                                    <p className="text-sm text-slate-500">{unit.lessons?.length || 0} lições configuradas</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* SEGUINDO A HIERARQUIA: admin/level/[levelId]/unit/[unitId] */}
                                <Link
                                    href={`/gamification/admin/level/${levelId}/unit/${unit.id}`}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                                >
                                    Gerir Lições
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-3xl border-4 border-dashed border-slate-100 p-16 text-center">
                        <p className="font-medium text-slate-400">Este nível ainda não tem unidades.</p>
                    </div>
                )}
            </div>
        </div>
    );
}