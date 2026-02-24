'use client';

import { Lock, Crown, Check } from 'lucide-react';
import {router} from "next/client";
import { useRouter } from 'next/navigation';
export default function PaywallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    const router = useRouter();
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-gold/50">
                <div className="bg-gold p-8 flex justify-center">
                    <div className="bg-white/20 p-4 rounded-3xl">
                        <Crown size={48} className="text-white" />
                    </div>
                </div>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-black uppercase italic text-zinc-900 dark:text-white">Conteúdo Premium</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
                        Esta lição faz parte do território avançado. Assina o plano Premium para desbloquear toda a história de Angola.
                    </p>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Check size={18} className="text-emerald-500" /> Lições de História sem limites
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Check size={18} className="text-emerald-500" /> Vidas infinitas para aprender
                        </div>
                    </div>

                    <button
                        className="w-full bg-gold hover:scale-105 transition-transform text-white font-black py-4 rounded-2xl mt-8 shadow-[0_4px_0_0_#b8860b] uppercase tracking-widest"
                        onClick={() => router.push('/pricing')}// Altera para tua rota de pagamento
                    >
                        Quero ser Premium
                    </button>

                    <button
                        className="mt-4 text-zinc-400 text-xs font-bold uppercase hover:text-zinc-600"
                        onClick={onClose}
                    >
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    );
}