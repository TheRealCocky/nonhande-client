'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, BookOpen, Gamepad2, Radio, User,
    LucideIcon, Bot, MessageSquareQuote, LayoutGrid, Trophy
} from 'lucide-react';

interface MobileNavItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const MobileNavItem = ({ href, icon: Icon, label, active, onClick }: MobileNavItemProps) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
            active ? "text-gold scale-110" : "text-muted-foreground hover:text-foreground"
        }`}
    >
        <div className={`p-1 rounded-xl transition-all ${
            active ? "bg-gold/10 shadow-sm" : ""
        }`}>
            <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={label === "Live" ? (active ? "text-red-500" : "text-red-500/70 animate-pulse") : ""}
            />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {active && <div className="w-1 h-1 bg-gold rounded-full" />}
    </Link>
);

export default function MobileNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* Pop-up de Ações (Aparece ao clicar em 'Mais') */}
            {isMenuOpen && (
                <div className="md:hidden fixed bottom-[85px] right-4 w-52 bg-background/95 backdrop-blur-2xl border border-gold/30 rounded-[32px] shadow-2xl z-[10000] p-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col gap-2">
                        {/* AGENTES IA */}
                        <Link
                            href="/chat"
                            className="flex items-center gap-3 p-3 hover:bg-gold/10 rounded-2xl text-foreground transition-colors group"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="bg-gold/10 p-2 rounded-lg group-hover:bg-gold/20">
                                <Bot size={20} className="text-gold" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-tighter">Agentes IA</span>
                        </Link>

                        {/* FRASES DO DIA (A BOCA) */}
                        <Link
                            href="/ranking"
                            className="flex items-center gap-3 p-3 hover:bg-emerald-500/10 rounded-2xl text-foreground transition-colors group"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20">
                                <Trophy size={20} className="text-gold" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-tighter">Ranking</span>
                        </Link>

                        <div className="h-[1px] bg-muted/50 my-1 mx-2" />

                        {/* PERFIL (AGORA SÓ APARECE AQUI) */}
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 p-3 hover:bg-zinc-500/10 rounded-2xl text-foreground transition-colors group"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="bg-zinc-500/10 p-2 rounded-lg group-hover:bg-zinc-500/20">
                                <User size={20} className="text-zinc-500" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-tighter">Meu Perfil</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Overlay invisível para fechar ao clicar fora */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <nav className="md:hidden fixed bottom-0 left-0 w-full h-[72px] bg-background/95 backdrop-blur-xl border-t border-border z-[9999] flex justify-around items-center px-2 pb-[safe-area-inset-bottom] transform-gpu">
                <MobileNavItem
                    href="/"
                    icon={Home}
                    label="Home"
                    active={pathname === '/'}
                />
                <MobileNavItem
                    href="/dicionary/feed"
                    icon={BookOpen}
                    label="Dicionário"
                    active={pathname.includes('/dicionary') && !pathname.includes('/live')}
                />
                <MobileNavItem
                    href="/realgamification/map"
                    icon={Gamepad2}
                    label="Jogos"
                    active={pathname.includes('/realgamification')}
                />
                <MobileNavItem
                    href="/live"
                    icon={Radio}
                    label="Live"
                    active={pathname.includes('/live')}
                />

                {/* BOTÃO MAIS (GATILHO DO POP-UP) */}
                <button
                    onClick={toggleMenu}
                    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 outline-none ${
                        isMenuOpen ? "text-gold scale-110" : "text-muted-foreground"
                    }`}
                >
                    <div className={`p-1 rounded-xl transition-all ${
                        isMenuOpen ? "bg-gold/20 shadow-lg rotate-180" : ""
                    }`}>
                        <LayoutGrid size={22} strokeWidth={isMenuOpen ? 2.5 : 2} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">
                        {isMenuOpen ? "Fechar" : "Mais"}
                    </span>
                </button>
            </nav>
        </>
    );
}