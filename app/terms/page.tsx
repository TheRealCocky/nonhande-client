import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold"><FileText size={32} /></div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Termos de Uso</h1>
                </div>
                <div className="space-y-8 text-foreground/70">
                    <p className="p-6 bg-card-custom rounded-3xl border border-border-custom italic">
                        Ao utilizar a Nonhande, concordas em respeitar a integridade cultural do conteúdo e as leis de propriedade intelectual vigentes em Angola.
                    </p>
                    <div className="space-y-6">
                        <h3 className="text-foreground font-bold">Uso da Plataforma</h3>
                        <p className="text-sm">É proibido o uso da nossa IA para gerar conteúdo difamatório ou que desvirtue as tradições dos povos Nhaneca-Humbe.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}