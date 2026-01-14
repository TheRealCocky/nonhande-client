'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Gem, Map as MapIcon, ShieldCheck, ShoppingBag } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// 1. INTERFACE PARA O TOKEN (Adeus 'any' na linha 18)
interface DecodedToken {
    role?: string;
    sub?: string;
    exp?: number;
    // Adiciona outros campos que o teu backend envie no JWT
}

export default function GamificationLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('nonhande_token');
            if (token) {
                try {
                    // Tipificamos o decode para a interface criada acima
                    const decoded = jwtDecode<DecodedToken>(token);
                    setUserRole(decoded.role || 'STUDENT');
                } catch (error) {
                    console.error("Erro ao decodificar token:", error);
                    setUserRole('STUDENT');
                }
            }
        }
    }, []);

    const isActive = (path: string) => pathname?.includes(path);
    const canAccessAdmin = userRole === 'ADMIN' || userRole === 'TEACHER';

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* HEADER PLATINADO */}
            <header className="sticky top-0 z-[120] w-full h-20 border-b border-platinum/20 bg-background/80 backdrop-blur-md px-4 md:px-8">
                <div className="max-w-7xl mx-auto h-full flex justify-between items-center">

                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase italic group-hover:brightness-125 transition-all">
                                Nonhande
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 font-black text-[11px] uppercase tracking-[0.2em]">
                            <Link
                                href="/gamification/map"
                                className={`flex items-center gap-2 transition-all ${isActive('/map') ? 'text-gold' : 'text-text-secondary hover:text-gold hover:translate-y-[-1px]'}`}
                            >
                                <MapIcon size={16} /> MAPA
                            </Link>
                            <Link
                                href="/gamification/shop"
                                className={`flex items-center gap-2 transition-all ${isActive('/shop') ? 'text-gold' : 'text-text-secondary hover:text-gold hover:translate-y-[-1px]'}`}
                            >
                                <ShoppingBag size={16} /> LOJA
                            </Link>

                            {canAccessAdmin && (
                                <Link
                                    href="/gamification/admin"
                                    className={`flex items-center gap-2 transition-all p-2 rounded-lg ${isActive('/admin') ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-secondary hover:text-gold'}`}
                                >
                                    <ShieldCheck size={16} /> ADMIN
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* STATUS DO JOGADOR - ESTILO LUXO */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-platinum/5 border border-platinum/20 px-4 py-2.5 rounded-[20px] shadow-inner">
                            <div className="flex items-center gap-2 border-r border-platinum/20 pr-4">
                                <Heart size={18} className="text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                <span className="font-black text-sm tracking-tight tracking-tighter">5</span>
                            </div>
                            <div className="flex items-center gap-2 pl-2 group">
                                <Gem size={18} className="text-gold fill-gold group-hover:animate-pulse" />
                                <span className="font-black text-sm text-gold tracking-tighter">1.240</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}