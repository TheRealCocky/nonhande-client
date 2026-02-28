'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { liveService } from '@/services/live.service';
import { Radio, ArrowRight, Sparkles, User, ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface UserList { id: string; name: string; email: string; }

export default function LiveDashboard() {
    const [title, setTitle] = useState('');
    const [availableUsers, setAvailableUsers] = useState<UserList[]>([]);
    const [selectedCallee, setSelectedCallee] = useState<string>('');
    const [roomIdInput, setRoomIdInput] = useState('');
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
            setToast({ msg: 'Preencha todos os campos.', type: 'error' });
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
        /* Estrutura fluida que respeita o Safe Area do iPhone */
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden safe-bottom">

            {/* Header com padding extra para não sumir no topo */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-border/40">
                <Link href="/" className="p-2 -ml-2 rounded-full active:bg-secondary transition-colors">
                    <ArrowLeft size={22} />
                </Link>
                <div className="flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">
                    <Radio size={12} className="animate-pulse text-gold" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-gold">Live Dashboard</span>
                </div>
            </header>

            <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full space-y-8">

                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                        Nonhande <span className="text-gold">Live.</span>
                    </h1>
                    <p className="text-muted-foreground text-xs font-medium">Inicia uma aula em tempo real.</p>
                </div>

                {/* Seção Nova Sessão */}
                <section className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Tema da Aula</label>
                        <input
                            type="text"
                            placeholder="Ex: Conversação em Nhaneka"
                            className="w-full bg-card border-2 border-border p-5 rounded-2xl outline-none focus:border-gold transition-all text-base appearance-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Escolher Aluno</label>
                        <div className="grid gap-3">
                            {availableUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedCallee(user.id)}
                                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                                        selectedCallee === user.id ? 'border-gold bg-gold/5' : 'border-border bg-card'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCallee === user.id ? 'bg-gold text-white' : 'bg-secondary'}`}>
                                            <User size={18} />
                                        </div>
                                        <span className="text-sm font-bold truncate max-w-[180px]">{user.name}</span>
                                    </div>
                                    {selectedCallee === user.id && <CheckCircle2 size={20} className="text-gold" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateRoom}
                        disabled={loading}
                        className="w-full bg-gold text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <>Criar Sala Agora <ArrowRight size={20} /></>}
                    </button>
                </section>

                <hr className="border-border/50" />

                {/* Seção Acesso Rápido */}
                <section className="pb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="text-gold" size={24} />
                        <h3 className="text-lg font-black uppercase tracking-tight">Acesso Rápido</h3>
                    </div>
                    <div className="bg-secondary/30 p-2 rounded-2xl border border-border">
                        <input
                            type="text"
                            placeholder="Introduzir UUID"
                            className="w-full bg-transparent p-4 outline-none text-sm font-mono uppercase"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                        />
                        <button
                            onClick={() => roomIdInput && router.push(`/live/${roomIdInput}`)}
                            className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95"
                        >
                            Validar Entrada
                        </button>
                    </div>
                </section>
            </main>

            {/* Toasts */}
            {toast && (
                <div className="fixed bottom-8 inset-x-6 z-[100] bg-foreground text-background p-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <p className="text-xs font-bold flex-1">{toast.msg}</p>
                    <button onClick={() => setToast(null)}><X size={18} /></button>
                </div>
            )}
        </div>
    );
}