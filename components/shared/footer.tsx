'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, ArrowUpRight, ShieldCheck } from 'lucide-react';

// Ícone do X (antigo Twitter)
const XIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const logoUrl = "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png";

    return (
        <footer className="w-full bg-platinum/30 dark:bg-background border-t border-border-custom py-16 md:py-20 px-6 mt-20 transition-colors duration-500 pb-32 md:pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20">

                    {/* Branding */}
                    <div className="col-span-1 md:col-span-5 space-y-8 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <Image
                                src={logoUrl}
                                alt="Logo Nonhande"
                                height={40}
                                width={160}
                                priority
                                className="dark:brightness-110"
                                style={{ height: '40px', width: 'auto' }}
                            />
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                                    Nonhande
                                </span>
                                <span className="text-[9px] text-gold font-bold tracking-[0.4em] uppercase mt-1">
                                    Angolan Luxury
                                </span>
                            </div>
                        </div>

                        <p className="text-base text-foreground/70 dark:text-foreground/50 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                            A elevar o Nhaneca-Humbe ao topo da tecnologia mundial.
                            Onde o rigor acadêmico encontra a sofisticação da platina.
                        </p>

                        <div className="flex justify-center md:justify-start gap-4">
                            <SocialButton icon={<Instagram size={20} />} />
                            <SocialButton icon={<XIcon size={18} />} />
                            <SocialButton icon={<Facebook size={20} />} />
                        </div>
                    </div>

                    {/* Links - Sincronizados com HomePage */}
                    <div className="col-span-1 md:col-span-2 space-y-6 text-center md:text-left">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Plataforma</h4>
                        <ul className="space-y-4 text-sm font-semibold text-foreground/80">
                            <li><FooterLink href="/dicionary/feed">Dicionário</FooterLink></li>
                            <li><FooterLink href="/realgamification/map">Trilha de Jogos</FooterLink></li>
                            <li><FooterLink href="/chat">Nonhande IA</FooterLink></li>
                            <li><FooterLink href="/ranking">Ranking Global</FooterLink></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-6 text-center md:text-left">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Suporte</h4>
                        <ul className="space-y-4 text-sm font-semibold text-foreground/80">
                            <li><FooterLink href="/live">Aulas Live</FooterLink></li>
                            <li><FooterLink href="/privacy">Privacidade</FooterLink></li>
                            <li><FooterLink href="/terms">Termos de Uso</FooterLink></li>
                            <li><FooterLink href="/about">Sobre Nós</FooterLink></li>
                            <li><FooterLink href="/faq">FAQ</FooterLink></li>
                        </ul>
                    </div>

                    {/* Selo de Credibilidade */}
                    <div className="col-span-1 md:col-span-3">
                        <div className="p-6 rounded-[32px] bg-card-custom border border-border-custom shadow-xl shadow-black/5 space-y-4 text-center md:text-left transition-transform hover:scale-[1.02]">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto md:mx-0">
                                <ShieldCheck size={22} />
                            </div>
                            <h5 className="font-black text-[10px] uppercase tracking-widest text-foreground">Conteúdo Verificado</h5>
                            <p className="text-[10px] text-foreground/50 leading-relaxed font-bold italic">
                                &quot;Otyipuka tyo tyili&quot; — A autenticidade da nossa terra validada por especialistas do Lubango e Chibia.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 text-center">
                        © {currentYear} Nonhande Platform — Huíla, Angola.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em] text-center">
                            Gambos • Lubango • Chibia • Humpata
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center justify-center md:justify-start gap-1 hover:text-gold transition-all group">
            <span className="group-hover:translate-x-1 transition-transform">{children}</span>
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gold" />
        </Link>
    );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="w-12 h-12 rounded-2xl bg-card-custom border border-border-custom flex items-center justify-center text-foreground/60 hover:bg-gold hover:text-white transition-all shadow-sm group">
            <div className="group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </button>
    );
}