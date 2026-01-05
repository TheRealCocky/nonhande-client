'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Gamepad2, Radio, User } from 'lucide-react';

interface MobileNavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const MobileNavItem = ({ href, icon, label, active }: MobileNavItemProps) => (
    <Link
        href={href}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
            active ? "text-gold scale-110" : "text-text-secondary hover:text-foreground"
        }`}
    >
        <div className={`p-1 rounded-xl transition-all ${
            active ? "bg-gold/10 shadow-sm" : ""
        }`}>
            {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {active && <div className="w-1 h-1 bg-gold rounded-full" />}
    </Link>
);

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-platinum/20 z-50 flex justify-around items-center py-4 px-2 safe-area-inset-bottom transform-gpu">
            <MobileNavItem
                href="/"
                icon={<Home size={22} />}
                label="Home"
                active={pathname === '/'}
            />
            <MobileNavItem
                href="/dicionary/feed"
                icon={<BookOpen size={22} />}
                label="Dicionário"
                active={pathname.includes('/dicionary/feed')}
            />
            <MobileNavItem
                href="/dicionary/games"
                icon={<Gamepad2 size={22} />}
                label="Jogos"
                active={pathname.includes('/games')}
            />
            <MobileNavItem
                href="/dicionary/live"
                icon={<Radio size={22} className={pathname.includes('/live') ? "text-red-500" : "text-red-500/70 animate-pulse"} />}
                label="Live"
                active={pathname.includes('/live')}
            />
            <MobileNavItem
                href="/profile"
                icon={<User size={22} />}
                label="Eu"
                active={pathname === '/profile'}
            />
        </nav>
    );
}