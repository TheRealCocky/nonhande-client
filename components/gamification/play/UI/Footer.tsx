// components/gamification/play/UI/Footer.tsx
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FooterProps {
    status: 'idle' | 'correct' | 'wrong';
    correctAnswer?: string;
    disabled: boolean;
    onCheck: () => void;
    onNext: () => void;
    isLoading?: boolean; // Adicionado para evitar o erro TS2322
}

export const Footer = ({
                           status,
                           correctAnswer,
                           disabled,
                           onCheck,
                           onNext,
                           isLoading
                       }: FooterProps) => {
    const isAnswered = status !== 'idle';
    const isCorrect = status === 'correct';

    return (
        <footer className={`p-6 md:p-10 border-t-2 transition-colors duration-500 ${
            isAnswered
                ? (isCorrect
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30'
                    : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30')
                : 'bg-background border-border'
        }`}>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                    {isAnswered && (
                        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className={`p-2 rounded-full ${isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {isCorrect ?
                                    <CheckCircle2 className="text-emerald-500" size={40} /> :
                                    <AlertCircle className="text-red-500" size={40} />
                                }
                            </div>
                            <div>
                                <p className={`font-black text-2xl uppercase italic tracking-tighter ${
                                    isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {isCorrect ? 'Muito bem!' : 'Solução Correcta:'}
                                </p>
                                {!isCorrect && (
                                    <p className="text-lg font-bold text-red-700 dark:text-red-300">
                                        {correctAnswer}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={isAnswered ? onNext : onCheck}
                    disabled={(disabled && !isAnswered) || isLoading}
                    className={`w-full md:w-auto min-w-[200px] px-12 py-5 rounded-2xl font-black uppercase tracking-widest border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 ${
                        !isAnswered
                            ? 'bg-gold text-white border-yellow-700 disabled:bg-muted disabled:border-muted-foreground/20 disabled:text-muted-foreground'
                            : 'bg-foreground text-background border-muted/50'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Guardando...</span>
                        </>
                    ) : (
                        isAnswered ? 'Continuar' : 'Verificar'
                    )}
                </button>
            </div>
        </footer>
    );
};