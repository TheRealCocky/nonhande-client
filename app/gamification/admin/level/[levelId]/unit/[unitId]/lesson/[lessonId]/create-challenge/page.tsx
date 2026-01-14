'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { gamificationService, ChallengeType } from '@/services/api';

export default function CreateChallenge() {
    const { levelId, unitId, lessonId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Estados do Formulário
    const [type, setType] = useState<ChallengeType>(ChallengeType.SELECT);
    const [question, setQuestion] = useState('');
    const [content, setContent] = useState('');

    // Helper para mostrar ao Teacher o que deve escrever no JSON
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
                content: JSON.parse(content), // Converte a string do textarea em objeto
                lessonId: lessonId as string,
                order: 1 // Você pode tornar este campo dinâmico depois
            };

            await gamificationService.createChallenge(payload);
            alert("Desafio criado com sucesso em Angola!");
            router.push(`/gamification/admin/level/${levelId}/unit/${unitId}/lesson/${lessonId}`);
        } catch (error: any) {
            alert("Erro: Verifique se o JSON está correto. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/gamification/admin/level/${levelId}/unit/${unitId}/lesson/${lessonId}`}
                    className="text-sm font-bold text-slate-500"
                >
                    ← CANCELAR E VOLTAR
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mt-2">Novo Desafio</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* TIPO DE DESAFIO */}
                <div>
                    <label className="block text-sm font-black uppercase text-slate-600 mb-2">Tipo de Exercício</label>
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as ChallengeType);
                            setContent(''); // Limpa para o novo placeholder
                        }}
                        className="w-full p-3 rounded-xl border-2 border-slate-200 font-bold focus:border-orange-500 outline-none"
                    >
                        {Object.values(ChallengeType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* PERGUNTA */}
                <div>
                    <label className="block text-sm font-black uppercase text-slate-600 mb-2">Pergunta / Comando</label>
                    <input
                        required
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ex: Como se diz 'Olá' em Nhaneca?"
                        className="w-full p-3 rounded-xl border-2 border-slate-200 font-medium focus:border-orange-500 outline-none"
                    />
                </div>

                {/* CONTEÚDO JSON */}
                <div>
                    <label className="block text-sm font-black uppercase text-slate-600 mb-2">Configuração (JSON)</label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={getJsonPlaceholder()}
                        className="w-full h-48 p-4 rounded-xl border-2 border-slate-200 font-mono text-sm bg-slate-50 focus:border-orange-500 outline-none"
                    />
                    <p className="mt-2 text-[10px] text-slate-400 font-medium">Siga rigorosamente o formato JSON acima.</p>
                </div>

                {/* BOTÃO SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-colors disabled:bg-slate-300"
                >
                    {loading ? 'A GUARDAR NO BANCO...' : 'PUBLICAR DESAFIO'}
                </button>
            </form>
        </div>
    );
}