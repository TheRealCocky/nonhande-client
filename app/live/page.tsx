'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { liveService } from '@/services/live.service';
import { Radio, Video, ArrowRight, Sparkles, User, ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';
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

// Componente de Notificação Profissional
const Toast = ({ message, type, onClose }: ToastProps) => (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl animate-in slide-in-from-right-10 duration-300 ${
        type === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-500'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
    }`}>
        {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
        <p className="text-sm font-bold tracking-tight">{message}</p>
        <button onClick={onClose} className="ml-4 hover:opacity-50 transition-opacity">
            <X size={16} />
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
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await liveService.getAvailableUsers();
                setAvailableUsers(data);
            } catch (error) {
                showToast('Não foi possível carregar a lista de alunos.', 'error');
            }
        };
        fetchUsers();
    }, []);

    const showToast = (msg: string, type: 'error' | 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 5000); // Auto-fechar após 5s
    };
    const handleCreateRoom = async () => {
        // 1. O critério de identificação agora é direto e limpo
        const myId = localStorage.getItem("user_id");

        // 2. Opcional: Pegar o token para garantir que a sessão é válida
        const token = localStorage.getItem("nonhande_token");

        console.log("🔍 Verificando credenciais para Live:", { myId, tokenExists: !!token });

        if (!myId || myId === 'undefined') {
            return showToast('Maka: ID não encontrado. Faz login novamente para ativar o sistema.', 'error');
        }

        if (!selectedCallee) {
            return showToast('Mestre, selecione um aluno ou parceiro na lista.', 'error');
        }

        if (!title) {
            return showToast('Por favor, defina o tema da aula.', 'error');
        }

        setLoading(true);
        try {
            // Chamada ao serviço com o ID que acabaste de mapear no Login
            const room = await liveService.createRoom(myId, selectedCallee, title);

            showToast('Sala de transmissão gerada com sucesso!', 'success');

            // Pequeno delay para o utilizador ler o sucesso antes de saltar
            setTimeout(() => router.push(`/live/${room.roomId}`), 800);

        } catch (error: any) {
            console.error("Erro técnico na criação da sala:", error.response?.data || error.message);
            showToast('Maka ao conectar: Servidor de Live offline ou erro de permissão.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-20 pt-28 px-4">
            {/* RENDERIZA O TOAST SE EXISTIR */}
            {toast && (
                <Toast
                    message={toast.msg}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="max-w-5xl mx-auto">
                {/* ... (Resto do código do Link de voltar e Header permanece igual) ... */}
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-8 group">
                    <div className="p-2 rounded-full bg-platinum/20 group-hover:bg-platinum/40 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest">Voltar ao Início</span>
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 bg-platinum/30 border border-platinum px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                                <Radio size={14} className="text-red-500 animate-pulse" />
                                <span>Painel de Transmissão</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                                Nonhande <span className="text-gold">Live.</span>
                            </h1>
                        </div>

                        <div className="p-8 rounded-[32px] border border-platinum bg-card-custom/30 relative overflow-hidden">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Configurar Nova Sessão</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-text-secondary ml-2 mb-2 block">Assunto da Aula</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Fonética do Nhaneka-Humbe"
                                        className="w-full bg-background border border-platinum p-4 rounded-2xl outline-none focus:border-gold transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase text-text-secondary ml-2 mb-2 block">Selecionar Aluno Disponível</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {availableUsers.map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => setSelectedCallee(user.id)}
                                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                                                    selectedCallee === user.id
                                                        ? 'border-gold bg-gold/10'
                                                        : 'border-platinum bg-background hover:border-gold/30'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${selectedCallee === user.id ? 'bg-gold text-white' : 'bg-platinum/20'}`}>
                                                        <User size={16} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold truncate max-w-[120px]">{user.name}</p>
                                                        <p className="text-[10px] text-text-secondary truncate max-w-[120px]">{user.email}</p>
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
                                    className="w-full bg-gold text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-gold/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>A preparar conexão...</span>
                                        </div>
                                    ) : (
                                        <>Iniciar Transmissão <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ... (Coluna 3 e Footer informativo permanecem iguais) ... */}
                    <div className="space-y-6">
                        <div className="p-8 rounded-[32px] border border-platinum bg-card-custom/10 h-fit">
                            <Sparkles className="text-gold mb-4" size={28} />
                            <h3 className="text-lg font-black mb-4 uppercase">Entrar com ID</h3>
                            <p className="text-text-secondary text-xs mb-6 leading-relaxed">
                                Se já tens um Room ID gerado, cola aqui para aceder diretamente à sala.
                            </p>
                            <input
                                type="text"
                                placeholder="UUID da Sala"
                                className="w-full bg-background border border-platinum p-3 rounded-xl outline-none focus:border-gold mb-4 text-sm"
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInput(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    if(!roomIdInput) return showToast("Insira um código válido.", "error");
                                    router.push(`/live/${roomIdInput}`);
                                }}
                                className="w-full bg-background border-2 border-platinum text-foreground py-3 rounded-xl font-bold hover:bg-platinum/20 transition-all text-xs uppercase"
                            >
                                Aceder Sala
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}