'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { gamificationService } from '@/services/api';

export default function EditLevelPage() {
    const router = useRouter();
    const params = useParams();
    // Pegamos o id diretamente do hook, que é mais seguro em Client Components
    const id = params?.id as string;

    const [formData, setFormData] = useState({ title: '', order: 1 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadLevel = useCallback(async () => {
        if (!id) {
            console.log("⏳ Aguardando ID...");
            return;
        }

        try {
            console.log("🚀 Iniciando busca para ID:", id);
            const response = await gamificationService.getTrail('nhaneca');

            // Tratamento de resposta robusto para Axios
            const rawData = response.data || response;
            const levelsArray = Array.isArray(rawData) ? rawData : rawData?.data;

            if (Array.isArray(levelsArray)) {
                const level = levelsArray.find((l: any) => String(l.id) === String(id));
                if (level) {
                    setFormData({ title: level.title, order: level.order });
                    console.log("✅ Dados carregados!");
                } else {
                    console.warn("⚠️ Nível não encontrado na lista.");
                }
            }
        } catch (error) {
            console.error("❌ Erro na requisição:", error);
        } finally {
            // O segredo está aqui: o loading TEM de parar.
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadLevel();
    }, [loadLevel]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await gamificationService.updateLevel(id, formData);
            router.push('/realgamification/admin');
            router.refresh();
        } catch (error) {
            alert("Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    };

    // UI de Loading
    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-background italic font-black text-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            <span className="tracking-[0.3em] uppercase text-[10px]">Sincronizando...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
            <div className="max-w-2xl mx-auto">
                <Link href="/realgamification/admin" className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-muted/50 hover:bg-gold/10 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-all duration-300 border border-border">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar ao Painel
                </Link>

                <div className="mt-12 mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-gold" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Oficina Ancestral</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        Reforjar <span className="text-muted-foreground/30 not-italic font-normal">Nível</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-card p-10 rounded-[40px] border border-border shadow-2xl relative overflow-hidden">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Título do Nível</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-muted/30 border border-border rounded-2xl p-5 font-bold focus:outline-none focus:border-gold/50 transition-all text-foreground text-xl"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Ordem na Trilha</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-muted/30 border border-border rounded-2xl p-5 font-bold focus:outline-none focus:border-gold/50 transition-all text-foreground text-xl"
                            min="1"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-foreground text-background py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gold hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Gravar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
}