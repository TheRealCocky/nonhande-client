'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Code, CheckCircle2 } from 'lucide-react';
import { gamificationService, ChallengeType } from '@/services/api';

export default function CreateChallenge() {
    const params = useParams();
    const levelId = params?.levelId as string;
    const unitId = params?.unitId as string;
    const lessonId = params?.lessonId as string;

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estados do Formulário
    const [type, setType] = useState<ChallengeType>(ChallengeType.SELECT);
    const [question, setQuestion] = useState('');
    const [content, setContent] = useState('');

    const getJsonPlaceholder = () => {
        if (type === ChallengeType.SELECT) return '{\n  "options": ["Mene", "Tyina", "Tala"],\n  "correct": "Mene"\n}';
        if (type === ChallengeType.ORDER) return '{\n  "words": ["Mene", "kupi", "oko"],\n  "correctOrder": ["Mene", "kupi", "oko"]\n}';
        return '{ "translation": "Bom dia", "audioUrl": "opcional" }';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                type,
                question,
                content: JSON.parse(content),
                lessonId: lessonId,
                order: 1
            };

            await gamificationService.createChallenge(payload);
            router.push(`/gamification/admin/level/${levelId}/unit/${unitId}/lesson/${lessonId}`);
        } catch (error: unknown) {
            // CORREÇÃO DO ERRO ANY (L41)
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            alert("Erro de Sintaxe JSON: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-3xl mx-auto min-h-screen">
            <div className="mb-12">
                <Link
                    href={`/gamification/admin/level/${levelId}/unit/${unitId}/lesson/${lessonId}`}
                    className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-gold transition-colors"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Cancelar e Voltar
                </Link>
                <div className="mt-6 flex items-center gap-3">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                        <Sparkles size={24} />
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Novo Desafio</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card-custom p-8 md:p-12 rounded-[40px] border border-platinum/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Code size={120} />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* TIPO DE DESAFIO */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gold mb-3 tracking-widest">Tipo de Exercício</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value as ChallengeType);
                                setContent('');
                            }}
                            className="w-full p-4 rounded-2xl bg-background border border-platinum/50 font-bold text-foreground focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                        >
                            {Object.values(ChallengeType).map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
                        </select>
                    </div>

                    {/* PERGUNTA */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gold mb-3 tracking-widest">Pergunta / Comando</label>
                        <input
                            required
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ex: Como se diz 'Olá' em Nhaneca?"
                            className="w-full p-4 rounded-2xl bg-background border border-platinum/50 font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-text-secondary/30"
                        />
                    </div>
                </div>

                {/* CONTEÚDO JSON */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-[10px] font-black uppercase text-gold tracking-widest">Configuração (JSON)</label>
                        <span className="text-[9px] font-bold text-text-secondary/50 uppercase italic">Validar sintaxe antes de publicar</span>
                    </div>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={getJsonPlaceholder()}
                        className="w-full h-64 p-6 rounded-[32px] bg-background border border-platinum/50 font-mono text-sm text-gold focus:border-gold outline-none transition-all shadow-inner resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-foreground text-background font-black py-6 rounded-[24px] hover:bg-gold hover:text-white transition-all disabled:bg-platinum disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <CheckCircle2 size={18} />
                            Publicar na Trilha
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}