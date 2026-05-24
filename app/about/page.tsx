import { Target, Cpu, ShieldCheck, MapPin, BookOpen, Layers } from "lucide-react";
import {BackButton} from "@/components/shared/BackButton";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
            <BackButton></BackButton>
            <div className="max-w-5xl mx-auto space-y-16">
                <header className="space-y-6 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant pb-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                            Sobre <span className="text-gold italic">Nós.</span>
                        </h1>
                        <p className="text-xl text-foreground/60 font-medium max-w-2xl leading-relaxed">
                            Do Lubango para o mundo digital: tecnologia de ponta ao serviço da preservação da língua Nhaneka-Humbe.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-gold bg-gold/10 px-5 py-2.5 rounded-full font-bold text-sm border border-gold/20">
                        <MapPin size={18} />
                        <span>Huíla, Angola</span>
                    </div>
                </header>

                <section className="space-y-12">
                    <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed text-lg bg-surface/10 p-8 rounded-3xl border border-outline-variant/50">
                        <p className="m-0">
                            A <span className="text-gold font-bold">Nonhande</span> nasceu da convergência entre a urgência de preservar o património cultural angolano e o poder transformador da Engenharia de Software. Não somos apenas uma aplicação de ensino; somos uma plataforma inteligente que mitiga o declínio da transmissão intergeracional das línguas locais, através de uma arquitetura gamificada concebida para reter, educar e inspirar os jovens.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 rounded-3xl border border-outline-variant bg-surface/30 hover:border-gold/40 hover:bg-surface/50 transition-all duration-300 space-y-5 group">
                            <div className="p-3 bg-gold/10 rounded-2xl w-fit group-hover:bg-gold/20 transition-colors">
                                <Target className="text-gold" size={28} />
                            </div>
                            <h3 className="font-black uppercase text-sm tracking-widest text-foreground m-0">Missão</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed m-0">
                                Democratizar a aprendizagem do Nhaneka-Humbe através de mecânicas de jogo dinâmicas, tornando o resgate cultural altamente apelativo e acessível para a nova geração.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl border border-outline-variant bg-surface/30 hover:border-gold/40 hover:bg-surface/50 transition-all duration-300 space-y-5 group">
                            <div className="p-3 bg-gold/10 rounded-2xl w-fit group-hover:bg-gold/20 transition-colors">
                                <Cpu className="text-gold" size={28} />
                            </div>
                            <h3 className="font-black uppercase text-sm tracking-widest text-foreground m-0">Inovação</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed m-0">
                                Aplicação de Inteligência Artificial generativa, modelos de processamento de linguagem natural e análise fonética em tempo real para uma imersão linguística sem precedentes.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl border border-outline-variant bg-surface/30 hover:border-gold/40 hover:bg-surface/50 transition-all duration-300 space-y-5 group">
                            <div className="p-3 bg-gold/10 rounded-2xl w-fit group-hover:bg-gold/20 transition-colors">
                                <ShieldCheck className="text-gold" size={28} />
                            </div>
                            <h3 className="font-black uppercase text-sm tracking-widest text-foreground m-0">Rigor Científico</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed m-0">
                                Infraestrutura técnica resiliente aliada a um conteúdo pedagógico rigorosamente validado, respeitando a integridade das matrizes culturais da região sul.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-surface/40 to-surface/10 p-10 md:p-12 rounded-[2.5rem] border border-gold/20 flex flex-col md:flex-row gap-10 items-center mt-16 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-gold/5 rotate-12 pointer-events-none">
                            <Layers size={300} />
                        </div>

                        <div className="flex-1 space-y-6 relative z-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">A Nossa Abordagem</h3>
                            <p className="text-foreground/70 text-base leading-relaxed">
                                Acreditamos que a tecnologia deve atuar como um veículo para a identidade nacional. Ao integrar sistemas de pontuação contínua, gestão de progressão modular e agentes pedagógicos artificiais, criámos um ecossistema digital onde o erro é parte natural do processo formativo e a curiosidade cultural é constantemente recompensada.
                            </p>
                        </div>

                        <div className="w-full md:w-1/3 flex justify-center relative z-10">
                            <div className="p-8 rounded-full bg-gold/5 border border-gold/10 shadow-[0_0_60px_-15px_rgba(255,215,0,0.1)]">
                                <BookOpen className="text-gold/80" size={80} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}