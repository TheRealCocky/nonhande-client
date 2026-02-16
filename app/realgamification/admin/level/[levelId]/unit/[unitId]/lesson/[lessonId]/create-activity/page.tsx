'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Sparkles, HelpCircle, Mic,
    Save, Loader2, Trash2, Edit3, Plus, Headphones, Type, ListOrdered, Layers
} from 'lucide-react';
import { gamificationService, ActivityType, Activity } from '@/services/api';
export default function ManageActivityPage() {
    const params = useParams();
    const router = useRouter();
    const { levelId, unitId, lessonId } = params;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    // ESTADOS DO FORMULÁRIO
    const [type, setType] = useState<ActivityType>(ActivityType.SELECT);
    const [question, setQuestion] = useState('');
    const [order, setOrder] = useState(1);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '']);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [pairs, setPairs] = useState<{ left: string, right: string }[]>([{ left: '', right: '' }]);
    const loadActivities = useCallback(async () => {
        try {
            setFetching(true);
            const { data } = await gamificationService.getLesson(lessonId as string);
            if (data.activities) {
                const sorted = data.activities.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                setActivities(sorted);
                if (!editingId) setOrder(sorted.length + 1);
            }
        } catch (error) { console.error(error); } finally { setFetching(false); }
    }, [lessonId, editingId]);
    useEffect(() => { loadActivities(); }, [loadActivities]);
    const startEdit = (activity: Activity) => {
        setEditingId(activity.id);
        setType(activity.type);
        setQuestion(activity.question);
        setOrder(activity.order || 1);
        setCorrectAnswer(activity.content?.correct || '');
        // Filtramos a resposta correta das opções para o formulário não duplicar na edição
        const rawOptions = activity.content?.options || [];
        const distractorsOnly = rawOptions.filter((opt: string) => opt !== activity.content?.correct);
        setOptions([...distractorsOnly, '', '', ''].slice(0, 4));
        if (activity.content?.pairs) setPairs(activity.content.pairs);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const resetForm = () => {
        setEditingId(null);
        setQuestion('');
        setCorrectAnswer('');
        setOptions(['', '', '', '']);
        setAudioFile(null);
        setPairs([{ left: '', right: '' }]);
        setOrder(activities.length + 1);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('question', question);
            formData.append('lessonId', lessonId as string);
            formData.append('order', String(order));
            // LÓGICA CRÍTICA: O Content deve conter a resposta e as opções mescladas
            const content: any = { correct: correctAnswer.trim() };
            if (type === ActivityType.PAIRS) {
                content.pairs = pairs.filter(p => p.left.trim() !== '' && p.right.trim() !== '');
            } else {
                // Para SELECT, TRANSLATE e FILL_BLANK, a resposta correta DEVE estar nas opções
                const validOptions = options.filter(opt => opt.trim() !== '');
                content.options = Array.from(new Set([correctAnswer.trim(), ...validOptions]));
            }
            formData.append('content', JSON.stringify(content));
            if (audioFile) formData.append('audio', audioFile);
            if (editingId) await gamificationService.updateActivity(editingId, formData);
            else await gamificationService.createActivity(formData);
            setStatus({ type: 'success', message: 'Atividade salva!' });
            resetForm();
            loadActivities();
        } catch (error) {
            setStatus({ type: 'error', message: 'Erro ao salvar.' });
        } finally { setLoading(false); }
    };
    const handleDelete = async (id: string) => {
        if (!confirm("Confirmar exclusão?")) return;
        try {
            await gamificationService.deleteActivity(id);
            loadActivities();
        } catch (error) { console.error(error); }
    };
    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen bg-background">
            <Link href={`/realgamification/admin/level/${levelId}/unit/${unitId}`} className="group inline-flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold mb-8">
                <ChevronLeft size={14} /> Voltar
            </Link>
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">{editingId ? 'Reforjar' : 'Forjar'} Atividade</h1>
                </div>
                {editingId && (
                    <button onClick={resetForm} className="bg-secondary px-6 py-2 rounded-full text-[10px] font-black uppercase">Cancelar</button>
                )}
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                <div className="lg:col-span-1 space-y-3">
                    {[
                        { id: ActivityType.SELECT, icon: HelpCircle, label: 'Seleção' },
                        { id: ActivityType.LISTEN_SELECT, icon: Headphones, label: 'Escuta' },
                        { id: ActivityType.TRANSLATE, icon: Type, label: 'Tradução' },
                        { id: ActivityType.FILL_BLANK, icon: Plus, label: 'Completar' },
                        { id: 'PAIRS', icon: Layers, label: 'Pares' },
                    ].map((t) => (
                        <button key={t.id} type="button" onClick={() => setType(t.id as any)} className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${type === t.id ? 'border-gold bg-gold/10' : 'border-border'}`}>
                            <t.icon size={18} className={type === t.id ? 'text-gold' : ''} />
                            <span className="text-[9px] font-black uppercase">{t.label}</span>
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6 bg-card p-8 rounded-[40px] border border-border shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase text-gold">
                                {type === ActivityType.FILL_BLANK ? "Enunciado (Use _ para a lacuna)" : "Pergunta / Texto"}
                            </label>
                            <input required value={question} onChange={e => setQuestion(e.target.value)} className="w-full p-4 rounded-xl bg-background border-2 border-border focus:border-gold outline-none" placeholder="Ex: Ondjaba _ onene" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground/50">Ordem</label>
                            <input type="number" required value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full p-4 rounded-xl bg-background border-2 border-border outline-none" />
                        </div>
                    </div>
                    <div className="p-6 bg-background/50 rounded-3xl border border-border space-y-6">
                        {type !== 'PAIRS' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-emerald-500">Resposta Correta</label>
                                <input required value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="w-full p-4 rounded-xl bg-background border-2 border-emerald-500/30 text-emerald-600 font-bold outline-none" placeholder="A palavra que completa ou a tradução certa" />
                            </div>
                        )}
                        {type === 'PAIRS' && (
                            <div className="space-y-4">
                                {pairs.map((pair, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input placeholder="Esquerda" value={pair.left} onChange={e => { const n = [...pairs]; n[idx].left = e.target.value; setPairs(n); }} className="flex-1 p-3 rounded-xl bg-background border border-border" />
                                        <input placeholder="Direita" value={pair.right} onChange={e => { const n = [...pairs]; n[idx].right = e.target.value; setPairs(n); }} className="flex-1 p-3 rounded-xl bg-background border border-border" />
                                    </div>
                                ))}
                                <button type="button" onClick={() => setPairs([...pairs, { left: '', right: '' }])} className="text-[10px] font-black text-gold uppercase">+ Novo Par</button>
                            </div>
                        )}
                        {[ActivityType.LISTEN_SELECT, ActivityType.SELECT].includes(type) && (
                            <div className="p-4 bg-background rounded-2xl border-2 border-dashed border-border">
                                <p className="text-[9px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-2"><Mic size={12}/> Áudio (Obrigatório para Escuta)</p>
                                <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="text-[10px]" />
                            </div>
                        )}
                        {type !== 'PAIRS' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-red-400">Opções Erradas (Distratores)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {options.map((opt, idx) => (
                                        <input key={idx} value={opt} onChange={e => { const n = [...options]; n[idx] = e.target.value; setOptions(n); }} placeholder={`Opção errada ${idx + 1}`} className="p-3 rounded-xl bg-background border border-border text-xs outline-none focus:border-gold" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-foreground text-background font-black py-6 rounded-[24px] hover:bg-gold hover:text-white transition-all uppercase text-xs flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : editingId ? "Atualizar Atividade" : "Criar Atividade"}
                    </button>
                </form>
            </div>
            {/* LISTA DE ATIVIDADES RECUPERADA */}
            <section className="space-y-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                    <ListOrdered size={20} /> Atividades na Lição
                </h3>
                {fetching ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gold" /></div>
                ) : (
                    <div className="grid gap-3">
                        {activities.map((act) => (
                            <div key={act.id} className="group flex items-center justify-between p-5 bg-card border border-border rounded-[24px] hover:border-gold/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-black text-gold border border-gold/20">{act.order}</div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-gold/60">{act.type}</p>
                                        <h4 className="font-bold text-sm truncate max-w-[300px]">{act.question}</h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(act)} className="p-2 bg-secondary rounded-lg hover:bg-gold hover:text-white transition-colors" title="Editar"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(act.id)} className="p-2 bg-secondary rounded-lg hover:bg-destructive hover:text-white text-destructive transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && <p className="text-center text-muted-foreground text-xs py-10 uppercase font-black tracking-widest">Nenhuma atividade forjada nesta lição.</p>}
                    </div>
                )}
            </section>
        </div>
    );
}