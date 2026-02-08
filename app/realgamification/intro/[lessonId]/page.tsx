'use client';

import { useParams, useRouter } from 'next/navigation';
import { INTRO_LESSONS } from '../data/intro_lessons';
import { X, Volume2, BookOpen, Sparkles, ChevronLeft } from 'lucide-react';

export default function IntroPage() {
    const params = useParams();
    const router = useRouter();

    const currentId = Number(params.lessonId);
    const currentLesson = INTRO_LESSONS.find(l => l.id === currentId);

    if (!currentLesson) {
        return <div className="p-20 text-center font-black text-gold uppercase tracking-widest">Lição não encontrada</div>;
    }

    const handleNext = () => {
        if (currentId < INTRO_LESSONS.length) {
            router.push(`/realgamification/intro/${currentId + 1}`);
        } else {
            router.push('/realgamification/map');
        }
    };

    const handleBack = () => {
        if (currentId > 1) {
            router.push(`/realgamification/intro/${currentId - 1}`);
        } else {
            router.push('/realgamification/map');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-gold/30">

            {/* 🔝 CABEÇALHO COM PROGRESSO */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md p-4 w-full border-b border-muted/20">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button onClick={() => router.push('/realgamification/map')} className="text-muted-foreground hover:text-gold transition-colors p-1">
                        <X size={26} strokeWidth={3} />
                    </button>

                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden border border-muted/30">
                        <div
                            className="h-full bg-gold transition-all duration-700 ease-out shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                            style={{ width: `${(currentId / INTRO_LESSONS.length) * 100}%` }}
                        />
                    </div>

                    <span className="font-black text-[10px] md:text-xs text-gold whitespace-nowrap italic">
                        {currentId} <span className="text-muted-foreground/50">/</span> 20
                    </span>
                </div>
            </header>

            {/* 📖 CONTEÚDO PRINCIPAL */}
            <main className="flex-1 w-full max-w-2xl mx-auto px-5 py-6 flex flex-col items-center">

                {/* ÁREA DA IMAGEM / ÍCONE */}
                <div className="w-full mb-6">
                    {currentLesson.image ? (
                        <div className="w-full aspect-video rounded-[32px] overflow-hidden border-2 border-muted/50 shadow-xl">
                            <img src={currentLesson.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-full py-10 flex flex-col items-center justify-center bg-muted/20 rounded-[32px] border-2 border-dashed border-muted/40">
                            <BookOpen size={50} className="text-gold/30 mb-2" />
                            <Sparkles size={16} className="text-gold/20 animate-pulse" />
                        </div>
                    )}
                </div>

                {/* TEXTOS INFORMATIVOS */}
                <div className="text-center space-y-3 mb-8">
                    <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-foreground leading-tight px-2">
                        {currentLesson.title}
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic max-w-[90%] mx-auto font-medium">
                        {currentLesson.description}
                    </p>
                </div>

                {/* 🛡️ CARD DA FRASE (ANTI-ROUPTURA) */}
                <div className="w-full bg-card border-2 border-muted border-b-[8px] rounded-[32px] p-6 md:p-10 flex flex-col items-center gap-6 shadow-md mb-32 transition-colors">
                    <h2 className="text-3xl md:text-5xl font-black text-gold tracking-tight text-center leading-tight break-words overflow-wrap-anywhere w-full">
                        {currentLesson.phrase}
                    </h2>

                    {currentLesson.audio && (
                        <button
                            onClick={() => new Audio(currentLesson.audio!).play()}
                            className="flex items-center gap-3 bg-gold text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg active:shadow-none"
                        >
                            <Volume2 size={20} /> Ouvir Pronúncia
                        </button>
                    )}
                </div>
            </main>

            {/* 🎮 RODAPÉ COM NAVEGAÇÃO COMPLETA */}
            <footer className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-md border-t-2 border-muted z-50">
                <div className="max-w-2xl mx-auto flex items-center gap-3 md:gap-4">

                    {/* BOTÃO VOLTAR (Sempre Visível se não for a primeira lição) */}
                    <button
                        onClick={handleBack}
                        className={`
                            flex items-center justify-center p-4 rounded-2xl border-2 border-muted border-b-4 
                            text-muted-foreground active:border-b-0 active:translate-y-1 transition-all
                            ${currentId === 1 ? 'hidden' : 'flex'}
                        `}
                        title="Anterior"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>

                    {/* BOTÃO CONTINUAR (Dourado Estilo Nonhande) */}
                    <button
                        onClick={handleNext}
                        className="flex-1 bg-gold text-white font-black uppercase text-xs md:text-sm tracking-[0.15em] py-5 rounded-2xl shadow-[0_5px_0_0_#b8962e] active:shadow-none active:translate-y-1 transition-all"
                    >
                        {currentId === 20 ? "FINALIZAR INICIAÇÃO" : "CONTINUAR"}
                    </button>
                </div>
            </footer>

            {/* CSS Global para garantir que o texto longo não quebre o layout */}
            <style jsx>{`
                h2 {
                    word-wrap: break-word;
                    word-break: break-word;
                    overflow-wrap: break-word;
                }
            `}</style>
        </div>
    );
}