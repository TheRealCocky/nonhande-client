import { FileText, Scale, BookOpen, Cpu, CreditCard, AlertTriangle } from "lucide-react";
import {BackButton} from "@/components/shared/BackButton";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <BackButton></BackButton>
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                        <FileText size={32} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Termos e Condições</h1>
                </div>

                <div className="space-y-10 text-foreground/80 leading-relaxed">
                    <p className="p-6 bg-surface/30 rounded-2xl border border-gold/20 text-lg italic text-foreground/90">
                        Ao aceder e utilizar a plataforma Nonhande, o utilizador concorda expressamente em respeitar a integridade cultural, o património linguístico e as leis de propriedade intelectual vigentes na República de Angola.
                    </p>

                    <div className="grid gap-6">
                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Scale className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">1. Conduta e Integridade Cultural</h3>
                            </div>
                            <p className="text-sm">
                                A Nonhande é um espaço dedicado à preservação e ensino da língua Nhaneka-Humbe. É estritamente proibido utilizar a plataforma para gerar, partilhar ou promover conteúdos difamatórios, discriminatórios ou que desvirtuem as tradições e a história dos povos originários do sul de Angola.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Cpu className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">2. Interação com a Inteligência Artificial</h3>
                            </div>
                            <p className="text-sm">
                                Os nossos agentes pedagógicos de IA são programados para auxiliar na imersão linguística. O utilizador compromete-se a não tentar contornar os filtros de segurança, realizar injeção de prompts maliciosos ou utilizar a capacidade de processamento da plataforma para fins alheios à aprendizagem de idiomas.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <BookOpen className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">3. Propriedade Intelectual</h3>
                            </div>
                            <p className="text-sm">
                                Todo o conteúdo pedagógico, incluindo o dicionário multimodal, áudios, estrutura de gamificação, código-fonte e design de interface, são propriedade exclusiva da Nonhande. A reprodução, cópia ou extração de dados (scraping) não autorizada resultará na suspensão imediata da conta e possíveis ações legais.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">4. Subscrições e Transações</h3>
                            </div>
                            <p className="text-sm">
                                O acesso a funcionalidades avançadas pode exigir a adesão a planos Premium ou Enterprise. Os pagamentos efetuados são processados de forma segura e estão sujeitos aos termos dos provedores de pagamento. Reembolsos são aplicáveis apenas em casos de falha técnica comprovada no fornecimento do serviço dentro dos primeiros 7 dias após a transação.
                            </p>
                        </section>

                        <section className="bg-surface/30 p-8 rounded-2xl border border-outline-variant hover:border-gold/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-gold" size={24} />
                                <h3 className="text-foreground font-bold uppercase text-sm tracking-widest m-0">5. Limitação de Responsabilidade</h3>
                            </div>
                            <p className="text-sm">
                                A Nonhande envida todos os esforços para garantir a precisão das traduções e disponibilidade do sistema. Contudo, a plataforma é fornecida &quot;tal como está&quot;. Não nos responsabilizamos por perdas de dados decorrentes de falhas de conectividade do utilizador ou interrupções temporárias para manutenção programada dos servidores.
                            </p>
                        </section>
                    </div>

                    <p className="text-xs text-foreground/50 mt-12 text-center uppercase tracking-widest">
                        Documento em vigor a partir de {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}