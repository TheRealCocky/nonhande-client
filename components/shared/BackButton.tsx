'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    label?: string;
    destiny?: string;
}

export function BackButton({ label = "Voltar", destiny = "/" }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(destiny)}
            className="group flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 active:scale-95 bg-secondary/20 hover:bg-secondary/40 border border-transparent hover:border-gold/30"
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-10 group-hover:scale-150 rounded-full blur-md transition-all duration-500" />
                <ArrowLeft
                    size={18}
                    className="text-muted-foreground group-hover:text-gold group-hover:-translate-x-1 transition-all duration-300"
                />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
            </span>
        </button>
    );
}