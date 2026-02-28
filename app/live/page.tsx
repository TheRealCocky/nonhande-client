'use client';

import { useState, useEffect, useCallback } from 'react';
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

    // ✨ Estado crítico para mobile: a altura real visível
    const [visibleHeight, setVisibleHeight] = useState('100dvh');
    const router = useRouter();

    const showToast = useCallback((msg: string, type: 'error' | 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 5000);
    }, []);

    // 🔥 ENGINE DE VIEWPORT MOBILE (Resolve o bug das fotos)
    useEffect(() => {
        const handleViewportChange = () => {
            if (window.visualViewport) {
                // Força a altura para ser EXATAMENTE o que sobra acima do teclado
                setVisibleHeight(`${window.visualViewport.height}px`);
                // Garante que o scroll do browser não desalinhe a UI
                window.scrollTo(0, 0);
            }
        };

        window.visualViewport?.addEventListener('resize', handleViewportChange);
        window.visualViewport?.addEventListener('scroll', handleViewportChange);
        handleViewportChange();

        return () => {
            window.visualViewport?.removeEventListener('resize', handleViewportChange);
            window.visualViewport?.removeEventListener('scroll', handleViewportChange);
        };
    }, []);

    useEffect(() => {
        liveService.getAvailableUsers().then(setAvailableUsers).catch(() => {
            showToast('Erro ao carregar alunos.', 'error');
        });
    }, [showToast]);

    const handleCreateRoom = async () => {
        const myId = localStorage.getItem("user_id");
        if (!myId || !selectedCallee || !title) return showToast('Preencha todos os campos.', 'error');
        setLoading(true);
        try {
            const room = await liveService.createRoom(myId, selectedCallee, title);
            router.push(`/live/${room.roomId}`);
        } catch {
            showToast('Erro ao criar sala.', 'error');
            setLoading(false);
        }
    };

    return (
        <div
            style={{ height: visibleHeight }}
            className="fixed inset-0 w-full bg-background text-foreground flex flex-col overflow-hidden"
        >
            {/* Header Fixo */}
            <div className="p-4 flex items-center justify-between shrink-0">
                <Link href="/" className="p-2 rounded-full bg-secondary active:scale-90 transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                    <Radio size={12} className="animate-pulse text-gold" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold">Live Dashboard</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Conteúdo com Scroll Interno (UX de App Nativa) */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                <div className="max-w-md mx-auto space-y-6">

                    <h1 className="text-3xl font-black uppercase tracking-tighter mt-2">
                        Nonhande <span className="text-gold">Live.</span>
                    </h1>

                    {/* Card Principal */}
                    <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Tema da Aula</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Conversação em Umbundu"
                                    className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-gold transition-all text-sm"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Escolher Aluno</label>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {availableUsers.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelectedCallee(user.id)}
                                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all active:scale-95 ${
                                                selectedCallee === user.id ? 'border-gold bg-gold/5' : 'border-border bg-background/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCallee === user.id ? 'bg-gold text-white' : 'bg-secondary text-muted-foreground'}`}>
                                                    <User size={16} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold truncate w-40">{user.name}</p>
                                                </div>
                                            </div>
                                            {selectedCallee === user.id && <CheckCircle2 size={18} className="text-gold" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreateRoom}
                                disabled={loading}
                                className="w-full bg-gold text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Criar Sala <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    </div>

                    {/* Acesso Rápido */}
                    <div className="bg-card border border-border rounded-[32px] p-6 mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="text-gold" size={20} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tight">Acesso Rápido</h3>
                        </div>
                        <input
                            type="text"
                            placeholder="Introduzir UUID da sala"
                            className="w-full bg-background border border-border p-4 rounded-xl outline-none focus:border-gold mb-3 text-xs font-mono"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                        />
                        <button
                            onClick={() => roomIdInput && router.push(`/live/${roomIdInput}`)}
                            className="w-full bg-secondary text-foreground py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95"
                        >
                            Validar ID
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast com Z-Index superior ao teclado */}
            {toast && (
                <div className="fixed bottom-10 inset-x-4 z-[999] bg-card border border-border p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                    {toast.type === 'error' ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-emerald-500" />}
                    <p className="text-xs font-bold flex-1">{toast.msg}</p>
                    <button onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}
        </div>
    );
}