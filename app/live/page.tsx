'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { liveService } from '@/services/live.service';
import { Radio, ArrowRight, User, ArrowLeft, CheckCircle2, AlertCircle, X, Hash, Video } from 'lucide-react';
import Link from 'next/link';
import JoinRoomModal from '@/components/live/JoinRoomModal';

interface UserList { id: string; name: string; email: string; }

export default function LiveDashboard() {
    const [title, setTitle] = useState('');
    const [availableUsers, setAvailableUsers] = useState<UserList[]>([]);
    const [selectedCallee, setSelectedCallee] = useState<string>('');
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
            <header className="shrink-0 bg-background/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border/40">
                <Link href="/" className="p-2 rounded-full active:bg-secondary">
                    <ArrowLeft size={22} />
                </Link>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold border border-gold/20 active:scale-95 transition-all"
                >
                    <Video size={16} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Entrar na sala</span>
                </button>

                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                    <Radio size={12} className="animate-pulse text-gold" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Live</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">Nonhande <span className="text-gold">Live.</span></h1>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Tema da Aula</label>
                        <input
                            type="text"
                            placeholder="Ex: Introdução ao Umbundu"
                            className="w-full bg-card border-2 border-border p-5 rounded-2xl outline-none focus:border-gold text-base appearance-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Selecionar Aluno</label>
                        <div className="bg-card border-2 border-border rounded-[28px] overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                {availableUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedCallee(user.id)}
                                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between ${selectedCallee === user.id ? 'border-gold bg-gold/5' : 'border-transparent bg-background/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedCallee === user.id ? 'bg-gold text-white' : 'bg-secondary'}`}><User size={16} /></div>
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

            <div className="p-6 bg-background border-t border-border/40 shrink-0 safe-bottom">
                <button
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="w-full bg-gold text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                    {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <>Criar Sala <ArrowRight size={20} /></>}
                </button>
            </div>

            <JoinRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJoin={(id) => router.push(`/live/${id}`)}
            />

            {/* Toast rendering... */}
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