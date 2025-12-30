"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center transition-colors duration-500">
            <div className="relative mb-8">
                <h1 className="text-[120px] md:text-[180px] font-black text-platinum/20 leading-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search size={80} className="text-gold animate-bounce" />
                </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                Página <span className="text-gold">Perdida</span> no Matuto
            </h2>

            <p className="text-text-secondary max-w-md mb-10 text-sm md:text-base leading-relaxed">
                Não conseguimos encontrar o que procuravas. Talvez este caminho ainda esteja a ser desbravado pela nossa equipa.
            </p>

            <Link href="/" className="flex items-center gap-2 bg-gold text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl shadow-gold/20">
                <Home size={20} /> VOLTAR AO INÍCIO
            </Link>
        </div>
    );
}