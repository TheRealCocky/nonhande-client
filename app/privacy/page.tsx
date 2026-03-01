import { Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold"><Shield size={32} /></div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Privacidade</h1>
                </div>
                <div className="prose prose-invert space-y-8 text-foreground/70">
                    <section>
                        <h3 className="text-foreground font-black uppercase text-sm tracking-widest mb-4">1. Proteção de Dados</h3>
                        <p>No Nonhande, a tua voz e os teus documentos são sagrados. Não partilhamos dados pessoais com terceiros para fins publicitários.</p>
                    </section>
                    <section>
                        <h3 className="text-foreground font-black uppercase text-sm tracking-widest mb-4">2. Uso de IA</h3>
                        <p>As interações com a Nonhande IA são processadas de forma anónima para treinar modelos de linguagem que respeitem a fonética angolana.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}