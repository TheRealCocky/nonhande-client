'use client';

import { useEffect, useState } from 'react';
import { Heart, Snowflake, Crown, Gem, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { progressionService } from '@/services/api';

export default function ShopPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState<string | null>(null);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            setLoading(true);
            const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
            if (userId) {
                const { data } = await progressionService.getStatus(userId);
                setStatus(data);
            }
        } catch (error) {
            console.error("❌ Erro ao abrir o mercado:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (itemId: string, price: number) => {
        if (!status || status.xp < price) return; // Usando XP como moeda ou Gemas se adicionares ao model

        try {
            setBuying(itemId);
            const userId = localStorage.getItem('userId');

            if (itemId === 'refill-hearts') {
                // Exemplo: Chamada para recuperar corações
                // await progressionService.updateStatus(userId!, { hearts: 5, xp: status.xp - price });
                alert("Energia Vital Restaurada!");
            }

            await loadStatus(); // Recarrega os dados
        } catch (error) {
            alert("Erro na transação ancestral.");
        } finally {
            setBuying(null);
        }
    };

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

    if (loading) return (
        <div className="h-screen bg-background flex flex-col items-center justify-center text-gold font-black uppercase tracking-widest">
            <Loader2 className="animate-spin mb-4" /> Entrando no Mercado...
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-12 px-6 pb-32">

            <Link
                href="/realgamification/map"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-all mb-8"
            >
                <ArrowLeft size={14} /> Voltar ao Mapa
            </Link>

            {/* CABEÇALHO DA LOJA */}
            <header className="relative overflow-hidden bg-card border border-border p-8 rounded-[40px] mb-12 shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Gem size={120} className="text-gold rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-3 border border-gold/20">
                            <Sparkles size={12} className="text-gold" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold">Mercado Nonhande</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">A Loja</h1>
                        <p className="text-muted-foreground text-sm font-bold mt-2">Troca o teu esforço por poder.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 bg-background border border-border px-6 py-3 rounded-2xl shadow-inner">
                            <Gem size={20} className="text-gold fill-gold" />
                            <span className="text-xl font-black text-foreground">{status?.xp || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 text-[10px] font-black text-red-500 uppercase tracking-widest justify-center">
                            <Heart size={12} fill="currentColor" /> {status?.hearts} Vidas
                        </div>
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
                            bg-card border ${item.borderColor} rounded-[32px] 
                            hover:shadow-xl transition-all duration-300
                        `}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-20 h-20 rounded-3xl bg-background border border-border flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-500">
                                {item.icon}
                            </div>

                            <div>
                                <h3 className={`text-xl font-black uppercase italic tracking-tighter ${item.isPremium ? 'text-gold' : 'text-foreground'}`}>
                                    {item.name}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs mt-1 leading-relaxed font-medium">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handlePurchase(item.id, item.price)}
                            disabled={buying !== null || (status?.xp || 0) < item.price}
                            className={`
                                relative z-10 mt-6 md:mt-0 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all
                                active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center gap-2
                                ${item.isPremium
                                ? 'bg-gold text-white shadow-[0_6px_0_0_#b8962e] hover:brightness-110'
                                : 'bg-foreground text-background shadow-[0_6px_0_0_#333] hover:bg-gold hover:text-white hover:shadow-[0_6px_0_0_#b8962e]'}
                            `}
                        >
                            {buying === item.id ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <span>{item.price}</span>
                                    <Gem size={14} fill="currentColor" />
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <footer className="mt-16 text-center opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Huíla • Angola</p>
            </footer>
        </div>
    );
}