"use client";

import Link from "next/link";
import { Home, Search, Map } from "lucide-react"; // Map faz mais sentido para a Quiçama

export default function NotFound() {
    return (
        /* Transição de 0.4s conforme definido no teu body do CSS */
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center transition-all duration-400 ease-in-out">

            <div className="relative mb-8">
                {/* 404 em Platinum (Luxo discreto) */}
                <h1 className="text-[120px] md:text-[180px] font-black text-platinum opacity-20 leading-none tracking-tighter">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <Search size={80} className="text-gold animate-pulse" />
                        <Map size={30} className="text-gold/40 absolute -top-2 -right-4" />
                    </div>
                </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                Página Perdida na <span className="text-gold">Quiçama</span>
            </h2>

            <p className="text-text-secondary max-w-md mb-10 text-sm md:text-base leading-relaxed font-medium">
                Parece que este trilho ainda não foi mapeado. Na imensidão do nosso território, por vezes é preciso recomeçar a jornada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20"
                >
                    <Home size={20} /> VOLTAR AO INÍCIO
                </Link>

            </div>

            {/* Rodapé Angolano */}
            <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
                <div className="h-px w-8 bg-gold" />
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold italic">
                    Angola • De Cabinda ao Cunene
                </p>
            </div>
        </div>
    );
}