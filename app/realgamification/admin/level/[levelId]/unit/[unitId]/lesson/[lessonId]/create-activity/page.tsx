'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, HelpCircle, Mic,
    Loader2, Trash2, Edit3, Plus, Headphones, Type, ListOrdered, Layers,
    BookOpen, Globe
} from 'lucide-react';
import { gamificationService } from '@/services/api';
import { ActivityType, Activity} from '@/types/gamification'

// ✨ INTERFACE PARA CALAR O LINTER
interface ActivityMetadata {
    difficulty?: string;
    context?: string;
    informant?: string;
    region?: string;
}

export default function ManageActivityPage() {
    const params = useParams();
    const { levelId, unitId, lessonId } = params;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [type, setType] = useState<ActivityType>(ActivityType.SELECT);
    const [question, setQuestion] = useState('');
    const [order, setOrder] = useState(1);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '']);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [pairs, setPairs] = useState<{ left: string, right: string }[]>([{ left: '', right: '' }]);

    const [difficulty, setDifficulty] = useState('beginner');
    const [context, setContext] = useState('geral');
    const [informant, setInformant] = useState('Avó do Mestre');

    const loadActivities = useCallback(async () => {
        try {
            setFetching(true);
            const { data } = await gamificationService.getLesson(lessonId as string);
            if (data.activities) {
                const sorted = data.activities.sort((a: Activity, b: Activity) => (a.order || 0) - (b.order || 0));
                setActivities(sorted);
                if (!editingId) setOrder(sorted.length + 1);
            }
        } catch (err) { console.error(err); } finally { setFetching(false); }
    }, [lessonId, editingId]);

    useEffect(() => { loadActivities(); }, [loadActivities]);

    const startEdit = (activity: Activity) => {
        setEditingId(activity.id);
        setType(activity.type as ActivityType);
        setQuestion(activity.question);
        setOrder(activity.order || 1);

        // ✨ CORREÇÃO: Cast para a interface em vez de any
        const meta = (activity.metadata as ActivityMetadata) || {};
        setDifficulty(meta.difficulty || 'beginner');
        setContext(meta.context || 'geral');
        setInformant(meta.informant || 'Avó do Mestre');

        setCorrectAnswer(activity.type === ActivityType.THEORY
            ? (activity.content?.explanation as string || '')
            : (activity.content?.correct as string || '')
        );

        const rawOptions = (activity.content?.options as string[]) || [];
        const distractorsOnly = rawOptions.filter((opt: string) => opt !== activity.content?.correct);
        setOptions([...distractorsOnly, '', '', ''].slice(0, 4));

        if (activity.content?.pairs) setPairs(activity.content.pairs as {left: string, right: string}[]);
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
        setDifficulty('beginner');
        setContext('geral');
        setInformant('Avó do Mestre');
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

            const content: Record<string, unknown> = {};

            if (type === ActivityType.THEORY) {
                content.explanation = correctAnswer.trim();
                content.isInstruction = true;
            } else if (type === ActivityType.PAIRS) {
                content.pairs = pairs.filter(p => p.left.trim() !== '' && p.right.trim() !== '');
            } else {
                content.correct = correctAnswer.trim();
                const validOptions = options.filter(opt => opt.trim() !== '');
                const allOptions = correctAnswer.trim()
                    ? Array.from(new Set([correctAnswer.trim(), ...validOptions]))
                    : validOptions;
                content.options = allOptions;
            }

            formData.append('content', JSON.stringify(content));

            formData.append('metadata', JSON.stringify({
                difficulty,
                context,
                informant,
                region: 'Huíla'
            }));

            if (audioFile) formData.append('audio', audioFile);

            if (editingId) await gamificationService.updateActivity(editingId, formData);
            else await gamificationService.createActivity(formData);

            resetForm();
            loadActivities();
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Mestre, confirmar exclusão deste desafio?")) return;
        try {
            await gamificationService.deleteActivity(id);
            loadActivities();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen bg-background text-foreground">
            <Link href={`/realgamification/admin/level/${levelId}/unit/${unitId}`} className="group inline-flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-gold mb-8">
                <ChevronLeft size={14} /> Voltar ao Painel
            </Link>

            <header className="mb-10 flex justify-between items-end">
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">{editingId ? 'Reforjar' : 'Forjar'} Atividade</h1>
                {editingId && (
                    <button onClick={resetForm} className="bg-secondary px-6 py-2 rounded-full text-[10px] font-black uppercase">Cancelar Edição</button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                <div className="lg:col-span-1 space-y-3">
                    {[
                        { id: ActivityType.SELECT, icon: HelpCircle, label: 'Seleção' },
                        { id: ActivityType.LISTEN_SELECT, icon: Headphones, label: 'Escuta' },
                        { id: ActivityType.TRANSLATE, icon: Type, label: 'Tradução' },
                        { id: ActivityType.FILL_BLANK, icon: Plus, label: 'Completar' },
                        { id: ActivityType.PAIRS, icon: Layers, label: 'Pares' },
                        { id: ActivityType.THEORY, icon: BookOpen, label: 'Teoria' },
                    ].map((t) => (
                        <button key={t.id} type="button" onClick={() => { setType(t.id as ActivityType); resetForm(); }} className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${type === t.id ? 'border-gold bg-gold/10' : 'border-border hover:bg-muted/50'}`}>
                            <t.icon size={18} className={type === t.id ? 'text-gold' : ''} />
                            <span className="text-[9px] font-black uppercase">{t.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6 bg-card p-8 rounded-[40px] border border-border shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase text-gold">
                                {type === ActivityType.FILL_BLANK ? "Enunciado (Use _ para a lacuna)" :
                                    type === ActivityType.THEORY ? "Título da Lição" : "Pergunta / Texto Principal"}
                            </label>
                            <input required value={question} onChange={e => setQuestion(e.target.value)} className="w-full p-4 rounded-xl bg-background border-2 border-border focus:border-gold outline-none" placeholder="Ex: Como se diz Olá em Nhaneca?" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground/50">Ordem</label>
                            <input type="number" required value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full p-4 rounded-xl bg-background border-2 border-border outline-none" />
                        </div>
                    </div>

                    <div className="p-6 bg-background/50 rounded-3xl border border-border space-y-6">
                        {type !== ActivityType.PAIRS && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-emerald-500">
                                    {type === ActivityType.THEORY ? "Conteúdo Teórico / Explicação" : "Resposta Correta (Obrigatória)"}
                                </label>
                                {type === ActivityType.THEORY ? (
                                    <textarea required value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="w-full p-4 rounded-xl bg-background border-2 border-emerald-500/30 text-foreground font-medium outline-none min-h-[120px]" placeholder="Escreve aqui a regra gramatical ou curiosidade cultural..." />
                                ) : (
                                    <input required value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} className="w-full p-4 rounded-xl bg-background border-2 border-emerald-500/30 text-emerald-600 font-bold outline-none" />
                                )}
                            </div>
                        )}

                        {type === ActivityType.PAIRS && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gold">Configurar Pares</label>
                                {pairs.map((pair, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input placeholder="Esquerda (ex: Olá)" value={pair.left} onChange={e => { const n = [...pairs]; n[idx].left = e.target.value; setPairs(n); }} className="flex-1 p-3 rounded-xl bg-background border border-border" />
                                        <input placeholder="Direita (ex: Tyange)" value={pair.right} onChange={e => { const n = [...pairs]; n[idx].right = e.target.value; setPairs(n); }} className="flex-1 p-3 rounded-xl bg-background border border-border" />
                                    </div>
                                ))}
                                <button type="button" onClick={() => setPairs([...pairs, { left: '', right: '' }])} className="text-[10px] font-black text-gold uppercase flex items-center gap-1"><Plus size={12}/> Adicionar Par</button>
                            </div>
                        )}

                        {[ActivityType.LISTEN_SELECT, ActivityType.SELECT, ActivityType.THEORY].includes(type) && (
                            <div className="p-4 bg-background rounded-2xl border-2 border-dashed border-border">
                                <p className="text-[9px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-2"><Mic size={12}/> Áudio {type === ActivityType.LISTEN_SELECT ? "(Obrigatório)" : "(Opcional)"}</p>
                                <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="text-[10px]" />
                            </div>
                        )}

                        {![ActivityType.PAIRS, ActivityType.THEORY].includes(type) && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-red-400">Opções Erradas (Distratores)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {options.map((opt, idx) => (
                                        <input key={idx} value={opt} onChange={e => { const n = [...options]; n[idx] = e.target.value; setOptions(n); }} placeholder={`Opção errada ${idx + 1}`} className="p-3 rounded-xl bg-background border border-border text-xs outline-none focus:border-gold" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gold/5 rounded-3xl border border-gold/20">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gold">Nível de Desafio</label>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 rounded-xl bg-background border border-gold/20 text-[10px] font-bold outline-none focus:border-gold">
                                    <option value="beginner">Nível 1: Principiante</option>
                                    <option value="elementary">Nível 2: Elementar</option>
                                    <option value="intermediate">Nível 3: Intermédio</option>
                                    <option value="advanced">Nível 4: Avançado</option>
                                    <option value="master">Nível 5: Mestre</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gold flex items-center gap-1"><Globe size={10}/> Contexto Cultural</label>
                                <select value={context} onChange={e => setContext(e.target.value)} className="w-full p-3 rounded-xl bg-background border border-gold/20 text-[10px] font-bold outline-none">
                                    <option value="geral">Geral</option>
                                    <option value="saudações">Saudações</option>
                                    <option value="família">Família</option>
                                    <option value="comércio">Comércio / Mercado</option>
                                    <option value="natureza">Natureza / Gado</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gold">Fonte/Informante</label>
                                <input value={informant} onChange={e => setInformant(e.target.value)} className="w-full p-3 rounded-xl bg-background border border-gold/20 text-[10px] font-bold outline-none" placeholder="Ex: Avó Maria" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-foreground text-background font-black py-6 rounded-[24px] hover:bg-gold hover:text-white transition-all uppercase text-xs flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : editingId ? "Atualizar Desafio" : "Forjar Desafio"}
                    </button>
                </form>
            </div>

            <section className="space-y-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                    <ListOrdered size={20} /> Ordem dos Desafios na Lição
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
                                        {/* ✨ CORREÇÃO: Cast para a interface para exibir a dificuldade sem erro */}
                                        <p className="text-[8px] font-black uppercase text-gold/60">
                                            {act.type} • {(act.metadata as ActivityMetadata)?.difficulty || 'beginner'}
                                        </p>
                                        <h4 className="font-bold text-sm truncate max-w-[300px]">{act.question}</h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(act)} className="p-2 bg-secondary rounded-lg hover:bg-gold hover:text-white transition-colors"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(act.id)} className="p-2 bg-secondary rounded-lg hover:bg-destructive hover:text-red-600 text-destructive transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
