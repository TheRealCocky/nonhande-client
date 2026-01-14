'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { gamificationService } from '@/services/api';

export default function LessonPlay() {
    const { id } = useParams(); // Ajustado para 'id' conforme a nova pasta
    const router = useRouter();

    const [challenges, setChallenges] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [lives, setLives] = useState(5);

    useEffect(() => {
        if (id) {
            gamificationService.getLesson(id as string).then(res => {
                setChallenges(res.data.challenges || []);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [id]);

    const currentChallenge = challenges[currentIndex];
    const progress = challenges.length > 0 ? (currentIndex / challenges.length) * 100 : 0;

    const handleCheck = () => {
        if (!selectedOption) return;

        const correct = currentChallenge.content.correct;
        if (selectedOption === correct) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
            setLives(prev => Math.max(0, prev - 1));
        }
    };

    const handleNext = () => {
        if (currentIndex < challenges.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            router.push('/gamification/map'); // Sucesso!
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!currentChallenge) return <div className="p-20 text-center font-black text-gold">SEM DESAFIOS DISPONÍVEIS</div>;

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">

            {/* HEADER: PROGRESSO E VIDAS */}
            <header className="max-w-4xl mx-auto w-full p-6 flex items-center gap-6">
                <button onClick={() => router.push('/gamification/map')} className="text-platinum hover:text-foreground transition-colors">
                    <X size={28} strokeWidth={3} />
                </button>

                <div className="flex-1 h-4 bg-platinum/20 rounded-full border border-platinum/10 overflow-hidden">
                    <div
                        className="h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center gap-2 text-red-500 font-black text-xl">
                    <Heart size={24} fill="currentColor" className={isCorrect === false ? 'animate-bounce' : ''} />
                    <span>{lives}</span>
                </div>
            </header>

            {/* ÁREA DA PERGUNTA */}
            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 overflow-y-auto">
                <h2 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Traduza esta frase</h2>
                <div className="mb-12">
                    <p className="text-3xl font-black text-foreground tracking-tight leading-tight italic uppercase">
                        {currentChallenge.question}
                    </p>
                </div>

                <div className="grid gap-4">
                    {currentChallenge.content.options?.map((opt: string) => {
                        const isSelected = selectedOption === opt;
                        return (
                            <button
                                key={opt}
                                disabled={isCorrect !== null}
                                onClick={() => setSelectedOption(opt)}
                                className={`
                                    p-5 rounded-2xl border-2 font-bold text-lg transition-all text-left relative overflow-hidden
                                    active:translate-y-1 active:shadow-none
                                    ${isSelected
                                    ? 'border-gold bg-gold/10 text-gold shadow-[0_5px_0_0_#b8962e]'
                                    : 'border-platinum/50 text-foreground hover:bg-platinum/10 shadow-[0_5px_0_0_rgba(0,0,0,0.1)]'}
                                    ${isCorrect !== null && isSelected && !isCorrect ? 'border-red-500 bg-red-50 text-red-600 shadow-[0_5px_0_0_#ef4444]' : ''}
                                    ${isCorrect !== null && opt === currentChallenge.content.correct ? 'border-green-500 bg-green-50 text-green-600 shadow-[0_5px_0_0_#22c55e]' : ''}
                                    disabled:cursor-default
                                `}
                            >
                                <span className="relative z-10">{opt}</span>
                            </button>
                        );
                    })}
                </div>
            </main>

            {/* FOOTER DE FEEDBACK DINÂMICO */}
            <footer className={`
                p-8 md:p-12 transition-all duration-500
                ${isCorrect === true ? 'bg-green-500/10 border-t-4 border-green-500' :
                isCorrect === false ? 'bg-red-500/10 border-t-4 border-red-500' :
                    'bg-background border-t border-platinum/20'}
            `}>
                <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        {isCorrect === true && (
                            <>
                                <div className="p-3 bg-green-500 rounded-full text-white shadow-lg animate-bounce">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <p className="text-green-600 font-black text-2xl tracking-tighter italic uppercase">Excelente! ✨</p>
                                    <p className="text-green-600/70 text-xs font-bold uppercase tracking-widest">Sabedoria ancestral confirmada.</p>
                                </div>
                            </>
                        )}
                        {isCorrect === false && (
                            <>
                                <div className="p-3 bg-red-500 rounded-full text-white shadow-lg animate-shake">
                                    <AlertCircle size={32} />
                                </div>
                                <div>
                                    <p className="text-red-600 font-black text-2xl tracking-tighter italic uppercase">Quase lá... 💡</p>
                                    <p className="text-red-600/70 text-xs font-bold uppercase tracking-widest">Resposta: {currentChallenge.content.correct}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={isCorrect === null ? handleCheck : handleNext}
                        disabled={!selectedOption && isCorrect === null}
                        className={`
                            w-full md:w-auto px-16 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all
                            ${isCorrect === true ? 'bg-green-500 text-white shadow-[0_8px_0_0_#16a34a]' :
                            isCorrect === false ? 'bg-red-500 text-white shadow-[0_8px_0_0_#dc2626]' :
                                'bg-gold text-white shadow-[0_8px_0_0_#b8962e] disabled:bg-platinum disabled:shadow-none disabled:translate-y-1'}
                            active:translate-y-2 active:shadow-none
                        `}
                    >
                        {isCorrect === null ? 'Verificar' : 'Continuar'}
                    </button>
                </div>
            </footer>
        </div>
    );
}