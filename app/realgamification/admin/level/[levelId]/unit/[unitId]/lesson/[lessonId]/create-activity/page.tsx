'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Sparkles, HelpCircle, Mic,
    Save, Loader2, AlertCircle, CheckCircle2, BookOpen, Image as ImageIcon, Upload
} from 'lucide-react';
import { gamificationService, ActivityType, ActivityContent } from '@/services/api';

export default function CreateActivityPage() {
    const params = useParams();
    const router = useRouter();
    const { levelId, unitId, lessonId } = params;

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    // ESTADOS ADAPTATIVOS
    const [type, setType] = useState<ActivityType>(ActivityType.SELECT);
    const [question, setQuestion] = useState('');
    const [order, setOrder] = useState(1);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '']);

    // ESTADOS DE FICHEIROS
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('question', question);
            formData.append('lessonId', lessonId as string);
            formData.append('order', String(order));

            // Construir o JSON do conteúdo usando a interface ActivityContent que definimos no api.ts
            const content: ActivityContent = {
                correct: correctAnswer
            };

            if (type === ActivityType.SELECT) {
                content.options = options.filter(opt => opt.trim() !== '');
            }

            formData.append('content', JSON.stringify(content));

            // Anexar Ficheiros
            if (audioFile) formData.append('audio', audioFile);
            images.forEach((img, idx) => {
                if (img) formData.append(`images`, img);
            });

            await gamificationService.createActivity(formData);

            setStatus({ type: 'success', message: 'Atividade forjada no Reino!' });

            setTimeout(() => {
                setQuestion('');
                setCorrectAnswer('');
                setOptions(['', '', '', '']);
                setAudioFile(null);
                setImages([]);
                setOrder(prev => prev + 1);
                setStatus({ type: null, message: '' });
                router.refresh();
            }, 2000);

        } catch (error: unknown) {
            console.error(error);
            setStatus({ type: 'error', message: 'Erro ao comunicar com o servidor.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto min-h-screen font-sans bg-background text-foreground transition-colors duration-500">
            <Link
                href={`/realgamification/admin/level/${levelId}/unit/${unitId}`}
                className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-all mb-8"
            >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Voltar à Unidade
            </Link>

            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-gold" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Oficina de Conteúdo</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground">Forjar Atividade</h1>
            </header>

            {status.type && (
                <div className={`mb-8 p-6 rounded-[24px] border-2 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${
                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest ml-1">Arquétipo</label>
                    <div className="flex flex-col gap-3">
                        {[
                            { id: ActivityType.THEORY, icon: BookOpen, label: 'Teoria' },
                            { id: ActivityType.SELECT, icon: HelpCircle, label: 'Seleção (Quiz)' },
                            { id: ActivityType.IMAGE_CHECK, icon: ImageIcon, label: 'Visual (2 Fotos)' },
                            { id: ActivityType.VOICE, icon: Mic, label: 'Voz / Escuta' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => { setType(t.id as ActivityType); setImages([]); }}
                                className={`p-5 rounded-[24px] border-2 flex items-center gap-4 transition-all ${
                                    type === t.id ? 'border-gold bg-gold/10 shadow-lg' : 'border-border bg-card text-muted-foreground'
                                }`}
                            >
                                <t.icon size={20} className={type === t.id ? 'text-gold' : ''} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8 bg-card p-8 md:p-10 rounded-[48px] border border-border shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3 space-y-3">
                            <label className="text-[10px] font-black uppercase text-gold tracking-widest">
                                {type === ActivityType.THEORY ? 'Título do Slide' : 'Enunciado'}
                            </label>
                            <input required value={question} onChange={e => setQuestion(e.target.value)} className="w-full p-5 rounded-2xl bg-background border-2 border-border font-bold focus:border-gold outline-none" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">Ordem</label>
                            <input type="number" required value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full p-5 rounded-2xl bg-background border-2 border-border font-bold focus:border-gold outline-none" />
                        </div>

                        <div className="md:col-span-4 p-6 bg-background/50 rounded-3xl border border-border space-y-6">
                            {type === ActivityType.THEORY ? (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-gold">Corpo da Teoria (Explicação)</label>
                                    <textarea required value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="w-full p-5 h-32 rounded-2xl bg-background border border-border outline-none font-medium" />
                                    <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-2xl bg-card">
                                        <input type="file" id="theoryImg" className="hidden" onChange={e => { if(e.target.files) setImages([e.target.files[0]]); }} />
                                        <label htmlFor="theoryImg" className="cursor-pointer flex items-center gap-3 text-[10px] font-black uppercase">
                                            <Upload size={16} /> {images[0] ? images[0].name : 'Imagem Ilustrativa'}
                                        </label>
                                    </div>
                                </div>
                            ) : type === ActivityType.IMAGE_CHECK ? (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-gold">Desafio Visual</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-emerald-500 uppercase">Foto Correta</p>
                                            <input type="file" required onChange={e => { if(e.target.files) { const f = [...images]; f[0] = e.target.files[0]; setImages(f); } }} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-destructive uppercase">Foto Errada</p>
                                            <input type="file" required onChange={e => { if(e.target.files) { const f = [...images]; f[1] = e.target.files[0]; setImages(f); } }} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gold">Resposta Correta</label>
                                        <input required value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="w-full p-4 rounded-xl bg-background border border-gold/30 text-gold font-bold outline-none" />
                                    </div>
                                    {type === ActivityType.SELECT && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {options.map((opt, idx) => (
                                                <input key={idx} required value={opt} onChange={e => handleOptionChange(idx, e.target.value)} placeholder={`Opção ${idx + 1}`} className="p-4 rounded-xl bg-background border border-border text-sm outline-none" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {type !== ActivityType.THEORY && (
                        <div className="flex items-center gap-4 p-5 bg-background rounded-3xl border border-border">
                            <Mic className="text-gold" />
                            <div className="flex-1">
                                <p className="text-[9px] font-black uppercase text-muted-foreground/50">Áudio da Pronúncia (Opcional)</p>
                                <input type="file" accept="audio/*" onChange={e => { if(e.target.files) setAudioFile(e.target.files[0]); }} className="text-xs mt-1" />
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-foreground text-background font-black py-7 rounded-[28px] hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] disabled:opacity-30">
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Consolidar Atividade</>}
                    </button>
                </form>
            </div>
        </div>
    );
}