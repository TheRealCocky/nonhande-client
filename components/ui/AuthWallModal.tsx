'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, X, ShieldCheck } from 'lucide-react';

interface AuthWallModalProps {
    onClose: () => void;
}

export default function AuthWallModal({ onClose }: AuthWallModalProps) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            {/* Overlay com desfoque profundo */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl" />

            <div className="relative bg-card-custom border border-gold/30 w-full max-w-lg rounded-[40px] p-8 md:p-12 shadow-[0_0_80px_rgba(212,175,55,0.1)] animate-in fade-in zoom-in-95 duration-500">

                {/* Botão de Fechar Subtil */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-silver-dark hover:text-gold transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    {/* Ícone Épico */}
                    <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mb-8 relative">
                        <ShieldCheck className="text-gold" size={40} />
                        <Sparkles className="absolute -top-2 -right-2 text-gold animate-pulse" size={24} />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-6 leading-tight">
                        Acesso ao <br/> <span className="text-gold">Saber Ancestral</span>
                    </h2>

                    <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed italic mb-10">
                        Estás prestes a entrar no acervo sagrado do povo Nhaneca-Humbe. Para preservar este legado, pedimos que te identifiques.
                    </p>

                    <div className="flex flex-col w-full gap-4">
                        <button
                            onClick={() => router.push('/auth/signin')}
                            className="bg-gold hover:bg-gold-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-gold/20 active:scale-95"
                        >
                            Entrar no Círculo
                        </button>

                        <p className="text-[9px] text-silver-dark font-bold uppercase tracking-widest mt-4">
                            Ao entrar, aceitas proteger a nossa cultura.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}