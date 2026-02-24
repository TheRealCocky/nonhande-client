'use client';

import { useState } from 'react';
import { Check, Crown, Mic, Zap, Map, MessageSquare, Plane, FileText, Users } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: 0,
        description: 'Para quem está a começar a descobrir Angola.',
        features: [
            'Mapa: Apenas Níveis 1 e 2',
            '5 Corações (Recuperação lenta)',
            'Chat: 5 perguntas a cada 12h',
            'Live: 2 sessões por mês',
            'Sem acesso a Agentes Especializados'
        ],
        buttonText: 'Plano Atual',
        highlight: false,
    },
    {
        name: 'Premium',
        monthlyPrice: 5000,
        description: 'A experiência completa do Soba.',
        features: [
            'Mapa: Acesso a todos os Níveis',
            'Corações: Infinitos (Joga sem parar)',
            'Chat: Ilimitado e Respostas Longas',
            'Live: Acesso Ilimitado',
            'Agente de Turismo e Documentos',
            'Certificado de Especialista'
        ],
        buttonText: 'Subir para Premium',
        highlight: true,
    },
    {
        name: 'Enterprise',
        monthlyPrice: 80000,
        description: 'Para escolas e instituições angolanas.',
        features: [
            'Tudo do Plano Premium',
            'Live: Acesso Ilimitado',
            'Painel do Professor (Teacher Dashboard)',
            'Até 50 Contas de Estudantes',
            'Suporte Prioritário por WhatsApp/Email',
            'Relatórios de Aproveitamento Escolar'
        ],
        buttonText: 'Contactar Equipa',
        highlight: false,
    }
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'semestral' | 'yearly'>('monthly');

    const getPrice = (basePrice: number) => {
        if (billingCycle === 'semestral') return Math.floor(basePrice * 6 * 0.85).toLocaleString('pt-AO');
        if (billingCycle === 'yearly') return Math.floor(basePrice * 12 * 0.70).toLocaleString('pt-AO');
        return basePrice.toLocaleString('pt-AO');
    };

    const getPeriodText = () => {
        if (billingCycle === 'semestral') return '/6 meses';
        if (billingCycle === 'yearly') return '/ano';
        return '/mês';
    };

    return (
        <div className="min-h-screen bg-background py-20 px-6 font-sans">
            <div className="max-w-5xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black italic text-gold uppercase mb-6 tracking-tighter">
                    Eleva o teu Conhecimento
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                    Escolhe o plano ideal para dominar a história, geografia e os segredos de Angola.
                </p>

                {/* Switch de Ciclo de Pagamento */}
                <div className="mt-10 inline-flex p-1.5 bg-muted/50 rounded-2xl border border-muted-foreground/10 backdrop-blur-sm">
                    {[
                        { id: 'monthly', label: 'Mensal' },
                        { id: 'semestral', label: 'Semestral (-15%)' },
                        { id: 'yearly', label: 'Anual (-30%)' }
                    ].map((cycle) => (
                        <button
                            key={cycle.id}
                            onClick={() => setBillingCycle(cycle.id as any)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                billingCycle === cycle.id
                                    ? 'bg-gold text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {cycle.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                {plans.map((plan) => (
                    <div key={plan.name} className={`
                        relative p-8 rounded-[40px] border-2 flex flex-col transition-all duration-300
                        ${plan.highlight
                        ? 'border-gold bg-gold/5 scale-105 shadow-[0_20px_50px_rgba(212,175,55,0.1)]'
                        : 'border-muted bg-card hover:border-muted-foreground/30'}
                    `}>
                        {plan.highlight && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                Recomendado
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black italic">
                                    {plan.name === 'Free' ? 'Grátis' : `${getPrice(plan.monthlyPrice!)} Kz`}
                                </span>
                                {plan.name !== 'Free' && (
                                    <span className="text-muted-foreground text-sm font-bold uppercase">{getPeriodText()}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-gold/20' : 'bg-emerald-500/10'}`}>
                                        <Check size={14} className={plan.highlight ? 'text-gold' : 'text-emerald-500'} />
                                    </div>
                                    <span className="text-[13px] font-bold leading-tight group-hover:translate-x-1 transition-transform">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`
                            w-full py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all
                            ${plan.highlight
                            ? 'bg-gold text-white shadow-[0_6px_0_0_#b8860b] active:shadow-none active:translate-y-1'
                            : 'bg-muted text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800'}
                        `}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center text-muted-foreground text-xs font-medium uppercase tracking-widest">
                Pagamento seguro via Multicaixa Express ou Transferência Bancária
            </div>
        </div>
    );
}