'use client';

import React, { useState } from 'react';
import { dictionaryService } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mic, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Interface para tipar o erro da API e evitar o 'any'
interface ApiError {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
}

export default function UploadWordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [examples, setExamples] = useState([{ text: '', translation: '' }]);

    const addExampleField = () => setExamples([...examples, { text: '', translation: '' }]);
    const removeExampleField = (index: number) => {
        if (examples.length > 1) setExamples(examples.filter((_, i) => i !== index));
    };

    const handleExampleChange = (index: number, field: string, value: string) => {
        const newExamples = [...examples];
        newExamples[index] = { ...newExamples[index], [field]: value };
        setExamples(newExamples);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formElement = e.currentTarget;
        const formData = new FormData();

        // Mapeamento seguro de tipos
        const getVal = (name: string) => (formElement.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement)?.value || '';

        formData.append('term', getVal('term'));
        formData.append('meaning', getVal('meaning'));
        formData.append('grammaticalType', getVal('grammaticalType'));
        formData.append('category', getVal('category'));
        formData.append('culturalNote', getVal('culturalNote'));

        if (audioFile) formData.append('audio', audioFile);
        formData.append('examples', JSON.stringify(examples));

        try {
            await dictionaryService.addWord(formData);
            setStatus({ type: 'success', msg: 'Catalogado com sucesso!' });
            setTimeout(() => router.push('/dicionary/feed'), 1500);
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error("Erro detalhado:", err.response?.data);
            const rawMsg = err.response?.data?.message || 'Erro ao salvar. Verifique os campos.';
            const errorMsg = Array.isArray(rawMsg) ? rawMsg[0] : rawMsg;
            setStatus({ type: 'error', msg: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12 transition-colors duration-500">
            {/* STATUS NOTIFICATION */}
            {status && (
                <div className={`fixed top-4 left-4 right-4 z-[100] md:left-auto md:right-10 md:w-80 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 ${
                    status.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <p className="text-xs font-bold uppercase tracking-wider">{status.msg}</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-12">

                <Link href="/dicionary/feed" className="inline-flex items-center gap-2 text-silver-dark hover:text-gold mb-6 transition-all group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
                </Link>

                <div className="bg-card-custom border border-platinum/20 rounded-[32px] md:rounded-[48px] p-6 md:p-16 shadow-2xl">

                    <div className="text-center mb-10">
                        <h1 className="text-2xl md:text-5xl font-black text-foreground tracking-tighter italic uppercase leading-tight">
                            Novo <span className="text-gold">Saber</span>
                        </h1>
                        <div className="h-1 w-12 bg-gold/30 mx-auto mt-4 rounded-full" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">

                        {/* SEÇÃO 1: PRINCIPAL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gold uppercase tracking-[0.2em] px-1">Termo Nhaneca</label>
                                <input name="term" required className="w-full bg-background border border-platinum/30 rounded-2xl p-4 text-sm md:text-base focus:border-gold outline-none font-bold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gold uppercase tracking-[0.2em] px-1">Tradução (PT)</label>
                                <input name="meaning" required className="w-full bg-background border border-platinum/30 rounded-2xl p-4 text-sm md:text-base focus:border-gold outline-none font-bold transition-all" />
                            </div>
                        </div>

                        {/* SEÇÃO 2: DETALHES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-silver-dark uppercase tracking-widest px-1">Gramática</label>
                                <select name="grammaticalType" className="w-full bg-background border border-platinum/30 rounded-2xl p-4 text-sm focus:border-gold outline-none font-bold appearance-none cursor-pointer">
                                    <option value="Substantivo">Substantivo</option>
                                    <option value="Verbo">Verbo</option>
                                    <option value="Pronome">Pronome</option>
                                    <option value="Adjetivo">Adjetivo</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-silver-dark uppercase tracking-widest px-1">Categoria</label>
                                <input name="category" className="w-full bg-background border border-platinum/30 rounded-2xl p-4 text-sm focus:border-gold outline-none font-bold" />
                            </div>
                            <div className="space-y-2 sm:col-span-2 md:col-span-1">
                                <label className="text-[9px] font-black text-silver-dark uppercase tracking-widest px-1">Nota Cultural</label>
                                <input name="culturalNote" className="w-full bg-background border border-platinum/30 rounded-2xl p-4 text-sm focus:border-gold outline-none font-bold" />
                            </div>
                        </div>

                        {/* SEÇÃO 3: ÁUDIO */}
                        <div className="bg-platinum/5 p-6 md:p-10 rounded-[32px] border-2 border-dashed border-platinum/20 flex flex-col items-center hover:border-gold/40 transition-all">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                                <Mic size={24} />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-silver-dark mb-4 text-center">Registo de Voz</p>
                            <input
                                type="file" accept="audio/*"
                                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                className="text-[10px] w-full max-w-xs
                                    file:bg-gold file:text-white file:border-0
                                    file:px-4 file:py-2 file:rounded-full
                                    file:font-black file:uppercase file:mr-4
                                    cursor-pointer"
                            />
                        </div>

                        {/* SEÇÃO 4: EXEMPLOS */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-platinum/10 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Exemplos de Uso</h3>
                                <button type="button" onClick={addExampleField} className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1 hover:bg-gold hover:text-white transition-all">
                                    <Plus size={14} /> ADICIONAR
                                </button>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                {examples.map((ex, index) => (
                                    <div key={index} className="flex flex-col gap-3 p-4 bg-background/40 rounded-3xl border border-platinum/10 relative group animate-in fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-silver-dark uppercase ml-1">Nhaneca</span>
                                                <input
                                                    placeholder="Ame nandi kamba..."
                                                    value={ex.text}
                                                    onChange={(e) => handleExampleChange(index, 'text', e.target.value)}
                                                    className="w-full bg-transparent border-b border-platinum/20 p-2 text-sm outline-none focus:border-gold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-silver-dark uppercase ml-1">Português</span>
                                                <input
                                                    placeholder="Eu sou amigo..."
                                                    value={ex.translation}
                                                    onChange={(e) => handleExampleChange(index, 'translation', e.target.value)}
                                                    className="w-full bg-transparent border-b border-platinum/20 p-2 text-sm outline-none focus:border-gold"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeExampleField(index)}
                                            className="absolute -top-2 -right-2 md:top-1/2 md:-translate-y-1/2 md:-right-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 md:py-7 rounded-[24px] font-black uppercase tracking-[0.3em] text-xs md:text-sm shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                                loading ? 'bg-silver-dark text-white cursor-not-allowed' : 'bg-gold hover:bg-gold-dark text-white shadow-gold/20'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {loading ? 'Processando...' : 'Publicar no Acervo'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}