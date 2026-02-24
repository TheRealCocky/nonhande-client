'use client';

import { Crown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaywallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // 1. O Hook DEVE vir antes de qualquer retorno condicional
    const router = useRouter();

    // 2. O retorno condicional vem depois dos Hooks
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
            {/* BG White para Light e zinc-900 para Dark */}
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-gold/50">

                {/* Header com Gold */}
                <div className="bg-gold p-8 flex justify-center">
                    <div className="bg-white/20 p-4 rounded-3xl">
                        <Crown size={48} className="text-white" />
                    </div>
                </div>

                <div className="p-8 text-center">
                    {/* Texto que obedece ao modo Dark/Light */}
                    <h2 className="text-2xl font-black uppercase italic text-zinc-900 dark:text-white">
                        Conteúdo Premium
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm leading-relaxed">
                        Esta lição faz parte do território avançado. Torna-te um Soba para desbloquear toda a história de Angola.
                    </p>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                            <Check size={18} className="text-emerald-500 shrink-0" />
                            <span>Lições de História sem limites</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                            <Check size={18} className="text-emerald-500 shrink-0" />
                            <span>Vidas infinitas para aprender</span>
                        </div>
                    </div>

                    <button
                        className="w-full bg-gold hover:scale-105 active:scale-95 transition-all text-white font-black py-4 rounded-2xl mt-8 shadow-[0_4px_0_0_#b8860b] uppercase tracking-widest text-xs"
                        onClick={() => {
                            onClose();
                            router.push('/pricing');
                        }}
                    >
                        Quero ser Premium
                    </button>

                    <button
                        className="mt-4 text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        onClick={onClose}
                    >
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    );
}