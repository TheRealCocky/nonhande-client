'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Gamepad2, Radio, User, LucideIcon } from 'lucide-react';

interface MobileNavItemProps {
    href: string;
    // Mudamos de ReactNode para LucideIcon para o TS saber que aceita 'size'
    icon: LucideIcon;
    label: string;
    active?: boolean;
}

const MobileNavItem = ({ href, icon: Icon, label, active }: MobileNavItemProps) => (
    <Link
        href={href}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
            active ? "text-gold scale-110" : "text-muted-foreground hover:text-foreground"
        }`}
    >
        <div className={`p-1 rounded-xl transition-all ${
            active ? "bg-gold/10 shadow-sm" : ""
        }`}>
            {/* Agora renderizamos o componente diretamente com as props corretas */}
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

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full h-[72px] bg-background/95 backdrop-blur-xl border-t border-border z-[9999] flex justify-around items-center px-2 pb-[safe-area-inset-bottom] transform-gpu">
            <MobileNavItem
                href="/"
                icon={Home} // Passamos apenas a referência do componente
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
                href="/dicionary/live"
                icon={Radio}
                label="Live"
                active={pathname.includes('/live')}
            />
            <MobileNavItem
                href="/profile"
                icon={User}
                label="Eu"
                active={pathname === '/profile'}
            />
        </nav>
    );
}