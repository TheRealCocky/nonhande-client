'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { liveService } from '@/services/live.service';
import { Radio, ArrowRight, Sparkles, User, ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface UserList {
    id: string;
    name: string;
    email: string;
}

interface ToastProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => (
    <div className={`fixed bottom-6 right-4 left-4 md:left-auto md:bottom-8 md:right-8 z-[110] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl animate-in slide-in-from-bottom-10 duration-300 ${
        type === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-500'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
    }`}>
        {type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
        <p className="text-sm font-bold tracking-tight flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:opacity-50 transition-opacity">
            <X size={18} />
        </button>
    </div>
);

export default function LiveDashboard() {
    const [title, setTitle] = useState('');
    const [availableUsers, setAvailableUsers] = useState<UserList[]>([]);
    const [selectedCallee, setSelectedCallee] = useState<string>('');
    const [roomIdInput, setRoomIdInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{msg: string, type: 'error' | 'success'} | null>(null);
    const [viewportHeight, setViewportHeight] = useState('100dvh');
    const router = useRouter();

    const showToast = useCallback((msg: string, type: 'error' | 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 5000);
    }, []);

    // ✨ SINCRONIZAÇÃO DO VIEWPORT (Como no Chat)
    useEffect(() => {
        const onResize = () => {
            if (window.visualViewport) {
                setViewportHeight(`${window.visualViewport.height}px`);
                window.scrollTo(0, 0);
            }
        };

        window.visualViewport?.addEventListener('resize', onResize);
        window.visualViewport?.addEventListener('scroll', onResize);
        onResize();

        return () => {
            window.visualViewport?.removeEventListener('resize', onResize);
            window.visualViewport?.removeEventListener('scroll', onResize);
        };
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await liveService.getAvailableUsers();
                setAvailableUsers(data);
            } catch {
                showToast('Não foi possível carregar a lista de alunos.', 'error');
            }
        };
        fetchUsers();
    }, [showToast]);

    const handleCreateRoom = async () => {
        const myId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;
        if (!myId || myId === 'undefined') return showToast('Maka: Faz login novamente.', 'error');
        if (!selectedCallee) return showToast('Selecione um aluno.', 'error');
        if (!title) return showToast('Defina o tema da aula.', 'error');

        setLoading(true);
        try {
            const room = await liveService.createRoom(myId, selectedCallee, title);
            showToast('Sala gerada com sucesso!', 'success');
            setTimeout(() => router.push(`/live/${room.roomId}`), 800);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Erro na conexão';
            console.error("Erro técnico:", errorMsg);
            showToast('Erro ao conectar ao servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{ height: viewportHeight, top: 0, left: 0, position: 'fixed' }}
            className="w-full bg-background text-foreground transition-colors duration-500 overflow-hidden flex flex-col items-center pt-16 md:pt-28 px-4"
        >
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-full max-w-5xl overflow-y-auto scrollbar-hide pb-20">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 group active:scale-95">
                    <div className="p-2 rounded-full bg-secondary group-hover:bg-gold/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-widest">Voltar</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gold">
                                <Radio size={14} className="animate-pulse" />
                                <span>Live Dashboard</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                                Nonhande <span className="text-gold">Live.</span>
                            </h1>
                        </div>

                        <div className="p-6 md:p-10 rounded-[40px] border border-border bg-card shadow-xl transition-colors duration-500">
                            <h3 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-2 h-2 bg-gold rounded-full" />
                                Nova Sessão
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-3 block tracking-widest">Tema da Aula</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Conversação em Umbundu"
                                        className="w-full bg-background border border-border p-5 rounded-2xl outline-none focus:border-gold transition-all text-sm"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2 mb-3 block tracking-widest">Aluno Disponível</label>
                                    <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                        {availableUsers.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => setSelectedCallee(user.id)}
                                                className={`p-5 rounded-2xl border transition-all flex items-center justify-between group active:scale-[0.97] ${
                                                    selectedCallee === user.id
                                                        ? 'border-gold bg-gold/5'
                                                        : 'border-border bg-background/50 hover:border-gold/30'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedCallee === user.id ? 'bg-gold text-white' : 'bg-secondary text-muted-foreground'}`}>
                                                        <User size={20} />
                                                    </div>
                                                    <div className="text-left overflow-hidden">
                                                        <p className="text-sm font-bold truncate max-w-[150px] md:max-w-full">{user.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                                {selectedCallee === user.id && <CheckCircle2 size={22} className="text-gold shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateRoom}
                                    disabled={loading}
                                    className="w-full bg-gold text-white py-6 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.25em] shadow-lg shadow-gold/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Entrar na Sala <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 rounded-[40px] border border-border bg-card h-fit lg:sticky lg:top-28 transition-colors duration-500">
                            <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-8">
                                <Sparkles className="text-gold" size={28} />
                            </div>
                            <h3 className="text-lg font-black mb-3 uppercase tracking-tight">Acesso Rápido</h3>
                            <p className="text-muted-foreground text-[11px] mb-8 leading-relaxed font-medium">
                                Tens um código? Introduz o UUID da sala abaixo.
                            </p>
                            <input
                                type="text"
                                placeholder="0000-0000-..."
                                className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-gold mb-4 text-xs font-mono appearance-none"
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInput(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    if(!roomIdInput) return showToast("Código inválido.", "error");
                                    router.push(`/live/${roomIdInput}`);
                                }}
                                className="w-full bg-secondary border border-border text-foreground py-4 rounded-xl font-bold hover:bg-secondary/80 transition-all text-[10px] uppercase tracking-widest active:scale-95 touch-manipulation"
                            >
                                Validar ID
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}