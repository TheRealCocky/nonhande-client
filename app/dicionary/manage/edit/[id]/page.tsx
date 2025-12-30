'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dictionaryService, WordResponse } from '@/services/api';
import {
    ArrowLeft, Mic, Save, CheckCircle2,
    AlertCircle, Loader2, Tag, Plus, Trash2, Info
} from 'lucide-react';

export default function EditWordPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    // Estados do Formulário
    const [formData, setFormData] = useState<Partial<WordResponse>>({});
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [examples, setExamples] = useState<Array<{ text: string; translation: string }>>([]);

    // 1. Carregar dados atuais
    useEffect(() => {
        async function loadWord() {
            try {
                // Buscamos no acervo pelo ID
                const response = await dictionaryService.getAll(1, 2000);
                const word = response.data?.items?.find((w: WordResponse) => w.id === id);

                if (word) {
                    setFormData(word);
                    setExamples(word.examples && word.examples.length > 0
                        ? word.examples
                        : [{ text: '', translation: '' }]
                    );
                } else {
                    setStatus({ type: 'error', msg: 'Vocábulo não encontrado.' });
                }
            } catch (error) {
                setStatus({ type: 'error', msg: 'Erro ao carregar dados do servidor.' });
            } finally {
                setLoading(false);
            }
        }
        if (id) loadWord();
    }, [id]);

    const handleExampleChange = (index: number, field: string, value: string) => {
        const newExamples = [...examples];
        newExamples[index] = { ...newExamples[index], [field]: value };
        setExamples(newExamples);
    };

    const addExample = () => setExamples([...examples, { text: '', translation: '' }]);

    const removeExample = (index: number) => {
        if (examples.length > 1) {
            setExamples(examples.filter((_, i) => i !== index));
        }
    };

    // 2. Submissão
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            const payload = new FormData();
            const target = e.currentTarget;

            // Helper para pegar valores dos inputs
            const getVal = (name: string) => (target.elements.namedItem(name) as HTMLInputElement)?.value || '';

            payload.append('term', getVal('term'));
            payload.append('meaning', getVal('meaning'));
            payload.append('grammaticalType', getVal('grammaticalType'));
            payload.append('category', getVal('category'));
            payload.append('culturalNote', getVal('culturalNote'));
            payload.append('tags', getVal('tags')); // O backend vai fazer o .split()

            if (audioFile) payload.append('audio', audioFile);

            // Limpeza de exemplos vazios
            const validExamples = examples.filter(ex => ex.text.trim() !== '' && ex.translation.trim() !== '');
            payload.append('examples', JSON.stringify(validExamples));

            await dictionaryService.updateWord(id as string, payload);

            setStatus({ type: 'success', msg: 'Saber atualizado com sucesso!' });
            setTimeout(() => router.push('/dicionary/manage'), 1500);

        } catch (error: any) {
            const msg = error.response?.data?.message || 'Falha na atualização.';
            setStatus({ type: 'error', msg: Array.isArray(msg) ? msg[0] : msg });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-500">
            <Loader2 className="animate-spin text-gold" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-20 pt-10">
            {/* Alert Status */}
            {status && (
                <div className={`fixed top-6 right-6 z-[100] p-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-5 ${
                    status.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                } text-white`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="text-xs font-black uppercase tracking-tighter">{status.msg}</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4">
                <button onClick={() => router.push('/dicionary/manage')} className="inline-flex items-center gap-2 text-silver-dark hover:text-gold mb-10 transition-all group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Voltar à Gestão</span>
                </button>

                <div className="bg-card-custom border border-border-custom rounded-[50px] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Edit3 size={120} className="text-gold" />
                    </div>

                    <header className="mb-16 relative">
                        <h1 className="text-4xl md:text-6xl font-black text-foreground italic uppercase tracking-tighter leading-none">
                            Editar <br/><span className="text-gold">Vocábulo</span>
                        </h1>
                        <p className="text-[10px] text-silver-dark font-bold mt-4 uppercase tracking-[0.3em]">ID: {id}</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Bloco 1: Identidade */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gold uppercase tracking-widest px-1">Termo em Nhaneca</label>
                                <input name="term" defaultValue={formData.term} required className="w-full bg-background border-2 border-border-custom rounded-3xl p-5 font-bold focus:border-gold outline-none transition-all text-xl" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gold uppercase tracking-widest px-1">Significado em Português</label>
                                <input name="meaning" defaultValue={formData.meaning} required className="w-full bg-background border-2 border-border-custom rounded-3xl p-5 font-bold focus:border-gold outline-none transition-all text-xl" />
                            </div>
                        </div>

                        {/* Bloco 2: Classificação */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-silver-dark uppercase tracking-widest px-1">Tipo Gramatical</label>
                                <select name="grammaticalType" defaultValue={formData.grammaticalType} className="w-full bg-background border-2 border-border-custom rounded-2xl p-4 font-bold focus:border-gold outline-none appearance-none">
                                    <option value="Substantivo">Substantivo</option>
                                    <option value="Verbo">Verbo</option>
                                    <option value="Adjetivo">Adjetivo</option>
                                    <option value="Advérbio">Advérbio</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-silver-dark uppercase tracking-widest px-1">Categoria</label>
                                <input name="category" defaultValue={formData.category} className="w-full bg-background border-2 border-border-custom rounded-2xl p-4 font-bold focus:border-gold outline-none" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gold uppercase tracking-widest px-1 flex items-center gap-2"><Tag size={12}/> Tags</label>
                                <input name="tags" defaultValue={formData.tags?.join(', ')} placeholder="Separe por vírgulas" className="w-full bg-background border-2 border-border-custom rounded-2xl p-4 font-bold focus:border-gold outline-none" />
                            </div>
                        </div>

                        {/* Bloco 3: Nota Cultural */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-silver-dark uppercase tracking-widest px-1">Nota de Contexto Cultural</label>
                            <textarea name="culturalNote" defaultValue={formData.culturalNote} rows={3} className="w-full bg-background border-2 border-border-custom rounded-3xl p-5 font-medium focus:border-gold outline-none resize-none" />
                        </div>

                        {/* Bloco 4: Áudio */}
                        <div className="bg-gold/5 p-10 rounded-[40px] border-2 border-dashed border-gold/20 flex flex-col items-center group hover:bg-gold/10 transition-all">
                            <div className="w-16 h-16 bg-gold text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform">
                                <Mic size={28} />
                            </div>
                            <h4 className="text-xs font-black uppercase text-gold tracking-widest">Substituir Pronúncia</h4>
                            <p className="text-[9px] text-silver-dark mt-1 font-bold italic">Deixe vazio para manter o áudio original</p>
                            <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="mt-6 text-[10px] file:bg-white file:text-black file:border-0 file:px-4 file:py-2 file:rounded-full file:font-black cursor-pointer" />
                        </div>

                        {/* Bloco 5: Exemplos Dinâmicos */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-border-custom pb-4">
                                <h3 className="text-xs font-black uppercase text-foreground tracking-widest italic">Frases de Exemplo</h3>
                                <button type="button" onClick={addExample} className="p-2 bg-gold/10 text-gold rounded-full hover:bg-gold hover:text-white transition-all">
                                    <Plus size={18} />
                                </button>
                            </div>

                            {examples.map((ex, idx) => (
                                <div key={idx} className="flex gap-4 items-start group">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/40 p-6 rounded-[30px] border border-border-custom group-hover:border-gold/30 transition-all">
                                        <input placeholder="Frase em Nhaneca" value={ex.text} onChange={(e) => handleExampleChange(idx, 'text', e.target.value)} className="bg-transparent border-b border-border-custom py-2 text-sm focus:border-gold outline-none font-medium" />
                                        <input placeholder="Tradução literal" value={ex.translation} onChange={(e) => handleExampleChange(idx, 'translation', e.target.value)} className="bg-transparent border-b border-border-custom py-2 text-sm focus:border-gold outline-none italic" />
                                    </div>
                                    <button type="button" onClick={() => removeExample(idx)} className="mt-6 text-red-500/50 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-7 bg-gold hover:bg-gold-dark text-white rounded-[35px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-gold/20 flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                            {submitting ? 'A Sincronizar Dados...' : 'Finalizar Edição'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Icone auxiliar para o header
function Edit3(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    )
}