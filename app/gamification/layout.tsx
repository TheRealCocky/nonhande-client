'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Gem, Map as MapIcon, ShieldCheck, ShoppingBag } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Precisarás de instalar: npm install jwt-decode

export default function GamificationLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | null>(null);

    // Efeito para ler o Role do Token guardado no localStorage
    useEffect(() => {
        const token = localStorage.getItem('nonhande_token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Assume que o teu backend envia 'role' no payload do JWT
                setUserRole(decoded.role || 'STUDENT');
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                setUserRole('STUDENT');
            }
        }
    }, []);

    const isActive = (path: string) => pathname?.includes(path);
    const canAccessAdmin = userRole === 'ADMIN' || userRole === 'TEACHER';

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <header className="sticky top-0 z-[120] w-full h-20 border-b border-platinum/20 bg-background/80 backdrop-blur-md px-4 md:px-8">
                <div className="max-w-7xl mx-auto h-full flex justify-between items-center">

                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl font-black text-gold tracking-tighter uppercase">Nonhande</span>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 font-black text-[11px] uppercase tracking-[0.2em]">
                            <Link
                                href="/gamification/map"
                                className={`flex items-center gap-2 transition-colors ${isActive('/map') ? 'text-gold' : 'text-text-secondary hover:text-gold'}`}
                            >
                                <MapIcon size={16} /> MAPA
                            </Link>
                            <Link
                                href="/gamification/shop"
                                className={`flex items-center gap-2 transition-colors ${isActive('/shop') ? 'text-gold' : 'text-text-secondary hover:text-gold'}`}
                            >
                                <ShoppingBag size={16} /> LOJA
                            </Link>

                            {/* 🔒 PROTEÇÃO DE ACESSO TEACHER/ADMIN */}
                            {canAccessAdmin && (
                                <Link
                                    href="/gamification/admin"
                                    className={`flex items-center gap-2 transition-colors ${isActive('/admin') ? 'text-gold' : 'text-text-secondary hover:text-gold'}`}
                                >
                                    <ShieldCheck size={16} className="text-gold" /> ADMIN
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* STATUS DO JOGADOR */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-platinum/30 border border-platinum/50 px-4 py-2 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-1.5 border-r border-platinum/50 pr-3">
                                <Heart size={18} className="text-red-500 fill-red-500" />
                                <span className="font-black text-sm">5</span>
                            </div>
                            <div className="flex items-center gap-1.5 pl-1">
                                <Gem size={18} className="text-gold fill-gold" />
                                <span className="font-black text-sm text-gold">1.240</span>
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