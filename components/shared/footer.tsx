'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const logoUrl = "https://res.cloudinary.com/dwp3wuum6/image/upload/v1766505762/header_etzxkj.png";

    return (
        /* Usamos bg-platinum para o toque metálico no Light.
           No Dark, o Tailwind vai aplicar automaticamente a cor que definiste no CSS (--platinum: #2a2a2a).
        */
        <footer className="hidden md:block w-full bg-platinum/30 dark:bg-background border-t border-border-custom py-20 px-6 mt-20 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

                    {/* Branding */}
                    <div className="md:col-span-5 space-y-8">
                        <div className="flex items-center gap-3">
                            <Image
                                src={logoUrl}
                                alt="Logo Nonhande"
                                height={40}
                                width={160}
                                priority
                                className="dark:brightness-110"
                                style={{ height: '40px', width: 'auto' }}
                            />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                                    Nonhande
                                </span>
                                <span className="text-[9px] text-gold font-bold tracking-[0.4em] uppercase mt-1">
                                    Angolan Luxury
                                </span>
                            </div>
                        </div>

                        <p className="text-base text-foreground/70 dark:text-foreground/50 font-medium leading-relaxed max-w-sm">
                            Preservando a língua Nhaneca-Humbe através da excelência tecnológica.
                            Onde a tradição encontra o brilho da platina.
                        </p>

                        <div className="flex gap-4">
                            <SocialButton icon={<Instagram size={20} />} />
                            <SocialButton icon={<Twitter size={20} />} />
                            <SocialButton icon={<Facebook size={20} />} />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Explorar</h4>
                        <ul className="space-y-4 text-sm font-semibold text-foreground/80">
                            <li><FooterLink href="/dicionary/feed">Dicionário</FooterLink></li>
                            <li><FooterLink href="/dicionary/history">História</FooterLink></li>
                            <li><FooterLink href="/dicionary/games">Jogos</FooterLink></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Suporte</h4>
                        <ul className="space-y-4 text-sm font-semibold text-foreground/80">
                            <li><FooterLink href="#">Privacidade</FooterLink></li>
                            <li><FooterLink href="#">Termos</FooterLink></li>
                        </ul>
                    </div>

                    {/* Selo de Credibilidade - Usando o teu card-custom */}
                    <div className="md:col-span-3">
                        <div className="p-6 rounded-[24px] bg-card-custom border border-border-custom shadow-sm space-y-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                <ShieldCheck size={22} />
                            </div>
                            <h5 className="font-black text-xs uppercase tracking-widest text-foreground md:text-[10px]">Credibilidade</h5>
                            <p className="text-[10px] text-foreground/50 leading-relaxed font-medium">
                                Conteúdo verificado por especialistas locais. Orgulho da nossa terra.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">
                        © {currentYear} Nonhande — Desenvolvido em Angola.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em]">Gambos • Lubango • Chibia</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center gap-1 hover:text-gold transition-all group">
            <span className="group-hover:translate-x-1 transition-transform">{children}</span>
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-gold" />
        </Link>
    );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="w-12 h-12 rounded-2xl bg-card-custom border border-border-custom flex items-center justify-center text-foreground/60 hover:bg-gold hover:text-white transition-all shadow-sm">
            {icon}
        </button>
    );
}