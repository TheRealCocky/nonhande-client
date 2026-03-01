"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    { q: "O Nonhande é uma ferramenta oficial?", a: "Sim, somos uma plataforma privada focada na valorização das línguas nacionais, com parcerias técnicas e linguísticas locais." },
    { q: "Como funciona a IA de Documentos?", a: "O nosso motor analisa ficheiros e traduz contextos complexos preservando as expressões idiomáticas do Nhaneca-Humbe." },
    { q: "Os dados de voz são seguros?", a: "Totalmente. Utilizamos encriptação de ponta e os dados servem apenas para melhorar a precisão do seu tutor personalizado." }
];

export default function FAQPage() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-center md:text-left">F<span className="text-gold">AQ.</span></h1>
                <div className="space-y-4">
                    {faqs.map((f, i) => (
                        <div key={i} className="rounded-[24px] border border-border-custom bg-card-custom/20 overflow-hidden">
                            <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center group">
                                <span className="font-bold group-hover:text-gold transition-colors">{f.q}</span>
                                <ChevronDown className={`text-gold transition-transform ${open === i ? 'rotate-180' : ''}`} />
                            </button>
                            {open === i && <div className="px-6 pb-6 text-foreground/60 text-sm leading-relaxed border-t border-border-custom pt-4">{f.a}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}