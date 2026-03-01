import { Info, Globe, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <header className="space-y-4 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Sobre <span className="text-gold">Nós.</span></h1>
                    <p className="text-xl text-foreground/50 font-medium">Do Lubango para o mundo, preservando a essência Nhaneca.</p>
                </header>

                <section className="grid gap-12 text-foreground/80 leading-relaxed text-lg">
                    <p>
                        O <span className="text-gold font-bold">Nonhande</span> não é apenas uma plataforma; é um manifesto tecnológico. Nascido na Huíla, o nosso projeto une a inteligência artificial de última geração com o rigor linguístico para garantir que as línguas nacionais de Angola ocupem o seu lugar de direito na era digital.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                        <div className="p-8 rounded-[32px] border border-border-custom bg-card-custom/30 space-y-4">
                            <Globe className="text-gold" size={24} />
                            <h3 className="font-black uppercase text-xs tracking-widest">Missão</h3>
                            <p className="text-sm opacity-60">Digitalizar a ancestralidade angolana com excelência.</p>
                        </div>
                        <div className="p-8 rounded-[32px] border border-border-custom bg-card-custom/30 space-y-4">
                            <ShieldCheck className="text-gold" size={24} />
                            <h3 className="font-black uppercase text-xs tracking-widest">Rigor</h3>
                            <p className="text-sm opacity-60">Conteúdo validado por especialistas locais da Chibia e Gambos.</p>
                        </div>
                        <div className="p-8 rounded-[32px] border border-border-custom bg-card-custom/30 space-y-4">
                            <Info className="text-gold" size={24} />
                            <h3 className="font-black uppercase text-xs tracking-widest">Inovação</h3>
                            <p className="text-sm opacity-60">IA generativa aplicada ao contexto cultural nacional.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}