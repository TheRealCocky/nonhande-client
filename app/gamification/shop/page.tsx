'use client';

import { useState } from 'react';
import { Heart, Snowflake, Crown, Gem, Sparkles, ChevronRight } from 'lucide-react';

export default function ShopPage() {
    const [balance, setBalance] = useState({ gems: 1240, hearts: 3 });

    const items = [
        {
            id: 'refill-hearts',
            name: 'Recarga de Vida',
            description: 'Recupera a tua energia vital para não parares de aprender.',
            price: 100,
            icon: <Heart size={32} className="fill-red-500 text-red-500" />,
            color: 'from-red-500/10 to-transparent',
            borderColor: 'border-red-500/20',
        },
        {
            id: 'streak-freeze',
            name: 'Escudo de Gelo',
            description: 'Protege a tua ofensiva mesmo nos dias em que o tempo falha.',
            price: 200,
            icon: <Snowflake size={32} className="text-blue-400" />,
            color: 'from-blue-400/10 to-transparent',
            borderColor: 'border-blue-400/20',
        },
        {
            id: 'premium-access',
            name: 'Acesso Platinado',
            description: 'Desbloqueia a sabedoria ancestral sem quaisquer limites.',
            price: 1500,
            icon: <Crown size={32} className="text-gold fill-gold" />,
            color: 'from-gold/20 to-transparent',
            borderColor: 'border-gold/30',
            isPremium: true
        }
    ];

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">

            {/* CABEÇALHO DA LOJA */}
            <header className="relative overflow-hidden bg-platinum/10 border border-platinum/30 p-8 rounded-[40px] mb-12 backdrop-blur-md">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Gem size={100} className="text-gold rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-3 border border-gold/20">
                            <Sparkles size={12} className="text-gold" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold">Mercado Nonhande</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">A Loja</h1>
                        <p className="text-text-secondary text-sm font-bold opacity-80 mt-1">Troca as tuas gemas por sabedoria e poder.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-background border border-platinum px-6 py-3 rounded-2xl shadow-xl self-start md:self-center">
                        <Gem size={20} className="text-gold fill-gold" />
                        <span className="text-xl font-black text-foreground">{balance.gems}</span>
                    </div>
                </div>
            </header>

            {/* LISTA DE ITENS */}
            <div className="grid gap-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`
                            group relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 
                            bg-card-custom border ${item.borderColor} rounded-[32px] 
                            hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                        `}
                    >
                        {/* Efeito de Gradiente de Fundo no Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-20 h-20 rounded-3xl bg-background border border-platinum flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                {item.icon}
                            </div>

                            <div>
                                <h3 className={`text-xl font-black uppercase italic tracking-tighter ${item.isPremium ? 'text-gold' : 'text-foreground'}`}>
                                    {item.name}
                                </h3>
                                <p className="text-sm text-text-secondary max-w-xs mt-1 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <button
                            className={`
                                relative z-10 mt-6 md:mt-0 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all
                                active:scale-95 disabled:opacity-30 disabled:grayscale
                                ${item.isPremium
                                ? 'bg-gold text-white shadow-[0_8px_0_0_#b8962e] hover:bg-gold-dark'
                                : 'bg-foreground text-background shadow-[0_8px_0_0_#333] hover:brightness-125'}
                            `}
                            disabled={balance.gems < item.price}
                        >
                            <div className="flex items-center gap-2">
                                <span>{item.price}</span>
                                <Gem size={14} fill="currentColor" />
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {/* FOOTER DA LOJA */}
            <div className="mt-16 text-center">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Estoque atualizado diariamente</p>
                <div className="mt-6 flex justify-center gap-4">
                    <div className="h-1 w-12 bg-platinum rounded-full" />
                    <div className="h-1 w-4 bg-gold rounded-full" />
                    <div className="h-1 w-12 bg-platinum rounded-full" />
                </div>
            </div>
        </div>
    );
}