'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Star, Crown, Gift, Sparkles } from 'lucide-react';
import { gamificationService } from '@/services/api';

export default function StudentMap() {
    const [trail, setTrail] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrail();
    }, []);

    const loadTrail = async () => {
        try {
            const { data } = await gamificationService.getTrail('nhaneca');
            setTrail(data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    /**
     * 📐 CÁLCULO DA CURVA DINÂMICA
     * Esta função define o deslocamento horizontal (X) para criar o arco.
     * O Duolingo usa uma curva que se repete a cada ~8-10 lições.
     */
    const getCurveStyle = (index: number) => {
        // Valores de deslocamento para criar o efeito "S" fluido
        // 0 é o centro, valores positivos para a direita, negativos para a esquerda
        const curveOffsets = [0, 45, 80, 95, 80, 45, 0, -45, -80, -95, -80, -45];
        const xOffset = curveOffsets[index % curveOffsets.length];

        return {
            transform: `translateX(${xOffset}px)`,
        };
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background italic font-black text-gold animate-pulse">
            CARREGANDO O TEU DESTINO...
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-40 select-none">

            {trail.map((level) => (
                <div key={level.id} className="w-full">
                    {level.units?.map((unit: any, uIdx: number) => (
                        <div key={unit.id} className="flex flex-col items-center w-full">

                            {/* HEADER DA UNIDADE - ESTILO DUO PLATINADO */}
                            <div className="w-full bg-gold p-6 md:rounded-b-[48px] shadow-2xl mb-20 relative overflow-hidden border-b-4 border-gold-dark">
                                <div className="max-w-md mx-auto flex justify-between items-center text-white relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Unidade {unit.order || uIdx + 1}</span>
                                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">{unit.title}</h2>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
                                        <Trophy size={24} className="drop-shadow-md" />
                                    </div>
                                </div>
                            </div>

                            {/* O CAMINHO CURVADO */}
                            <div className="relative flex flex-col items-center w-full max-w-[400px] gap-12">

                                {unit.lessons?.map((lesson: any, index: number) => {
                                    const isCurrent = index === 0; // Exemplo: primeira lição ativa
                                    const isPremium = lesson.access === 'PREMIUM';

                                    return (
                                        <div
                                            key={lesson.id}
                                            style={getCurveStyle(index)}
                                            className="relative transition-all duration-700 ease-in-out"
                                        >
                                            {/* BALÃO DE "COMEÇAR" */}
                                            {isCurrent && (
                                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                                                    <div className="bg-white text-gold text-[10px] font-black px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-platinum uppercase tracking-widest animate-bounce">
                                                        COMEÇAR
                                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r-2 border-b-2 border-platinum" />
                                                    </div>
                                                </div>
                                            )}

                                            <Link href={`/gamification/lesson/${lesson.id}/play`}>
                                                <div className="relative group cursor-pointer">

                                                    {/* ANEL DE PROGRESSO (SVG) */}
                                                    <div className="absolute -inset-4 w-[140%] h-[140%] -rotate-90 pointer-events-none">
                                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                                            <circle
                                                                cx="50" cy="50" r="40"
                                                                fill="none"
                                                                stroke="var(--platinum)"
                                                                strokeWidth="8"
                                                                strokeOpacity="0.1"
                                                            />
                                                            {isCurrent && (
                                                                <circle
                                                                    cx="50" cy="50" r="40"
                                                                    fill="none"
                                                                    stroke="var(--gold)"
                                                                    strokeWidth="8"
                                                                    strokeDasharray="251"
                                                                    strokeDashoffset="180"
                                                                    strokeLinecap="round"
                                                                />
                                                            )}
                                                        </svg>
                                                    </div>

                                                    {/* O BOTÃO 3D (TOKEN) */}
                                                    <div className={`
                                                        w-20 h-20 rounded-full flex items-center justify-center transition-all relative z-10
                                                        ${isCurrent
                                                        ? 'bg-gold shadow-[0_10px_0_0_#b8962e] hover:brightness-110'
                                                        : 'bg-platinum/50 shadow-[0_10px_0_0_#c0c0c0] opacity-40 grayscale'}
                                                        active:translate-y-2 active:shadow-none
                                                    `}>
                                                        {isPremium ? (
                                                            <Crown className="text-white drop-shadow-md" size={32} />
                                                        ) : (
                                                            <Star className={`${isCurrent ? 'text-white' : 'text-silver-dark'} fill-current`} size={32} />
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}

                                {/* BAÚ DE TESOURO (FIM DA CURVA) */}
                                <div className="mt-20 opacity-30 flex flex-col items-center">
                                    <div className="w-24 h-20 bg-platinum/20 rounded-[35%] border-b-8 border-silver flex items-center justify-center">
                                        <Gift size={44} className="text-silver-dark" />
                                    </div>
                                    <span className="mt-4 text-[10px] font-black text-platinum uppercase tracking-widest">Recompensa</span>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* EFEITO DE PARTICULAS NO FUNDO (OPCIONAL) */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                <Sparkles size={100} className="absolute top-1/4 left-10 text-gold/10" />
                <Sparkles size={80} className="absolute bottom-1/4 right-10 text-gold/10" />
            </div>
        </div>
    );
}