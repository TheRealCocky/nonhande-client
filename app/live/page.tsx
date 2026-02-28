'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { liveService } from '@/services/live.service';
import { Radio, ArrowRight, Sparkles, User, ArrowLeft, CheckCircle2, AlertCircle, X, Hash } from 'lucide-react';
import Link from 'next/link';

interface UserList { id: string; name: string; email: string; }

export default function LiveDashboard() {
    const [title, setTitle] = useState('');
    const [availableUsers, setAvailableUsers] = useState<UserList[]>([]);
    const [selectedCallee, setSelectedCallee] = useState<string>('');
    const [roomIdInput, setRoomIdInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{msg: string, type: 'error' | 'success'} | null>(null);
    const router = useRouter();

    useEffect(() => {
        liveService.getAvailableUsers().then(setAvailableUsers).catch(() => {
            setToast({ msg: 'Erro ao carregar alunos.', type: 'error' });
        });
    }, []);

    const handleCreateRoom = async () => {
        const myId = localStorage.getItem("user_id");
        if (!myId || !selectedCallee || !title) {
            setToast({ msg: 'Preencha o tema e selecione um aluno.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const room = await liveService.createRoom(myId, selectedCallee, title);
            router.push(`/live/${room.roomId}`);
        } catch {
            setToast({ msg: 'Erro ao criar sala.', type: 'error' });
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
            {/* Header com Botão de Entrada por ID */}
            <header className="shrink-0 bg-background/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border/40">
                <Link href="/" className="p-2 rounded-full active:bg-secondary transition-colors">
                    <ArrowLeft size={22} />
                </Link>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold border border-gold/20 active:scale-95 transition-all shadow-sm shadow-gold/5"
                >
                    <Hash size={16} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Entrar na sala</span>
                </button>

                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                    <Radio size={12} className="animate-pulse text-gold" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Live</span>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                        Nonhande <span className="text-gold">Live.</span>
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">Painel do Professor</p>
                </div>

                <div className="space-y-6">
                    {/* Tema */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Tema da Aula</label>
                        <input
                            type="text"
                            placeholder="Ex: Introdução ao Umbundu"
                            className="w-full bg-card border-2 border-border p-5 rounded-2xl outline-none focus:border-gold transition-all text-base appearance-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Alunos com Scroll Interno */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">Selecionar Aluno</label>
                        <div className="bg-card border-2 border-border rounded-[28px] overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                {availableUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedCallee(user.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all active:scale-[0.97] flex items-center justify-between ${
                                            selectedCallee === user.id ? 'border-gold bg-gold/5' : 'border-transparent bg-background/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedCallee === user.id ? 'bg-gold text-white' : 'bg-secondary'}`}>
                                                <User size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold truncate max-w-[150px]">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                        {selectedCallee === user.id && <CheckCircle2 size={18} className="text-gold" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Ação Fixa no Rodapé */}
            <div className="p-6 bg-background border-t border-border/40 shrink-0 safe-bottom">
                <button
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="w-full bg-gold text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <>Criar Sala <ArrowRight size={20} /></>}
                </button>
            </div>

            {/* Modal de Acesso via ID */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-sm bg-card border-2 border-border rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-20">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-muted-foreground active:scale-75 transition-transform"><X size={24} /></button>

                        <div className="flex flex-col items-center text-center space-y-4 mb-8">
                            <div className="w-16 h-16 bg-gold/10 rounded-[20px] flex items-center justify-center">
                                <Sparkles className="text-gold" size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">Entrar via ID</h3>
                                <p className="text-muted-foreground text-xs font-medium">Insira o código UUID da sala.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="0000-0000-..."
                                className="w-full bg-background border-2 border-border p-5 rounded-2xl outline-none focus:border-gold text-center font-mono text-sm uppercase tracking-widest placeholder:opacity-30"
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInput(e.target.value)}
                            />
                            <button
                                onClick={() => roomIdInput && router.push(`/live/${roomIdInput}`)}
                                className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg"
                            >
                                Validar Acesso
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificações */}
            {toast && (
                <div className={`fixed top-6 inset-x-6 z-[110] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <p className="text-xs font-black flex-1 uppercase tracking-tight">{toast.msg}</p>
                    <button onClick={() => setToast(null)}><X size={18} /></button>
                </div>
            )}
        </div>
    );
}