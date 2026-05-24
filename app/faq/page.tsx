"use client";
import { useState } from "react";
import { ChevronDown, MessageCircle, Sparkles, ShieldCheck, CreditCard } from "lucide-react";
import {BackButton} from "@/components/shared/BackButton";

type FAQCategory = {
    title: string;
    icon: React.ReactNode;
    questions: { q: string; a: string }[];
};

const faqData: FAQCategory[] = [
    {
        title: "A Plataforma e Metodologia",
        icon: <MessageCircle className="text-gold" size={24} />,
        questions: [
            {
                q: "O que é a Nonhande?",
                a: "A Nonhande é uma plataforma digital que cruza gamificação e Inteligência Artificial para facilitar a aprendizagem autónoma da língua Nhaneka-Humbe. O nosso foco é reverter o declínio da transmissão intergeracional através de tecnologia de ponta."
            },
            {
                q: "Como funciona o sistema de Vidas (Corações) e XP?",
                a: "A aprendizagem é gamificada. Ganhas Pontos de Experiência (XP) ao concluir lições e unidades. Se errares uma atividade, perdes um coração. Os corações regeneram com o tempo, garantindo que manténs um ritmo de estudo saudável e contínuo."
            },
            {
                q: "A plataforma emite certificados?",
                a: "Através da monitorização contínua do teu progresso e XP acumulado, o sistema gera relatórios de proficiência que podem ser validados por docentes na nossa plataforma de administração."
            }
        ]
    },
    {
        title: "Inteligência Artificial",
        icon: <Sparkles className="text-gold" size={24} />,
        questions: [
            {
                q: "Como funcionam os Agentes de IA?",
                a: "Temos diferentes agentes especializados (ex: Turismo, Documentos, Geral) com os quais podes interagir. Eles possuem memória de longo prazo, adaptando as conversas ao teu nível de vocabulário atual."
            },
            {
                q: "O sistema corrige a minha pronúncia?",
                a: "Sim. A nossa IA de processamento de voz analisa o teu áudio em tempo real e fornece feedback imediato sobre a tua pronúncia face aos padrões fonéticos do Nhaneka-Humbe."
            },
            {
                q: "O que é a IA de Documentos?",
                a: "É uma funcionalidade onde podes submeter textos ou ficheiros, e o nosso motor analisa o contexto para te ajudar a traduzir e interpretar expressões complexas mantendo o rigor idiomático."
            }
        ]
    },
    {
        title: "Planos e Acesso",
        icon: <CreditCard className="text-gold" size={24} />,
        questions: [
            {
                q: "A Nonhande é gratuita?",
                a: "Temos um plano Free que permite o acesso ao currículo base. Oferecemos também planos Premium e Enterprise que desbloqueiam interações ilimitadas com a IA, recuperação rápida de vidas e acesso a funcionalidades live."
            },
            {
                q: "Como funciona o consumo de Tokens na IA?",
                a: "Cada interação com os nossos tutores artificiais consome tokens virtuais. O teu limite de tokens varia consoante o teu plano de subscrição e pode ser monitorizado diretamente no teu perfil."
            }
        ]
    },
    {
        title: "Segurança e Privacidade",
        icon: <ShieldCheck className="text-gold" size={24} />,
        questions: [
            {
                q: "Os meus áudios ficam guardados?",
                a: "Os áudios são processados para fins pedagógicos imediatos. O teu histórico de conversação é mantido estritamente no teu perfil para personalizar as lições, e pode ser apagado por ti a qualquer momento."
            },
            {
                q: "Os meus dados são partilhados com terceiros?",
                a: "Não. A Nonhande não vende, aluga ou partilha os teus dados pessoais, documentos ou metadados de progressão com entidades terceiras para fins publicitários."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
        const id = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
            <BackButton></BackButton>
            <div className="max-w-4xl mx-auto space-y-16">
                <header className="space-y-4 text-center md:text-left border-b border-outline-variant pb-8">
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
                        Perguntas <span className="text-gold italic">Frequentes.</span>
                    </h1>
                    <p className="text-xl text-foreground/60 font-medium">
                        Tudo o que precisas de saber sobre a arquitetura e funcionamento da Nonhande.
                    </p>
                </header>

                <div className="space-y-12">
                    {faqData.map((category, catIdx) => (
                        <section key={catIdx} className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-2">
                                <div className="p-2 bg-gold/10 rounded-xl">
                                    {category.icon}
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-widest text-foreground/90">
                                    {category.title}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {category.questions.map((faq, qIdx) => {
                                    const id = `${catIdx}-${qIdx}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div
                                            key={qIdx}
                                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                                isOpen
                                                    ? 'bg-surface/50 border-gold/40 shadow-[0_0_15px_-3px_rgba(255,215,0,0.1)]'
                                                    : 'bg-surface/20 border-outline-variant hover:border-gold/20'
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleFAQ(catIdx, qIdx)}
                                                className="w-full p-6 text-left flex justify-between items-center group focus:outline-none"
                                            >
                                                <span className={`font-bold text-[15px] transition-colors pr-8 ${isOpen ? 'text-gold' : 'text-foreground/80 group-hover:text-foreground'}`}>
                                                    {faq.q}
                                                </span>
                                                <ChevronDown
                                                    className={`shrink-0 transition-transform duration-300 ${
                                                        isOpen ? 'rotate-180 text-gold' : 'text-foreground/40 group-hover:text-gold/70'
                                                    }`}
                                                />
                                            </button>

                                            <div
                                                className={`grid transition-all duration-300 ease-in-out ${
                                                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="px-6 pb-6 pt-2 text-foreground/60 text-sm leading-relaxed border-t border-outline-variant/30">
                                                        {faq.a}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}