import { X, Plus, MessageSquare, Settings } from 'lucide-react';
import {ChatSession, ChatSidebarProps} from '@/types/chat';
// ✨ Definimos a interface para as sessões aqui também




export function ChatSidebar({
                                isOpen,
                                onClose,
                                onNewChat,
                                sessions,
                                onSelectSession
                            }: ChatSidebarProps) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            <aside
                className={`fixed left-0 top-0 h-full w-[280px] md:w-[320px] bg-card-custom border-r border-border-custom/40 z-[70] transition-transform duration-300 ease-out shadow-2xl ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col">
                            <h2 className="text-gold font-black tracking-widest text-sm uppercase">Nonhande AI</h2>
                            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">Angola Edition</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full text-foreground/60 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            onNewChat();
                            onClose();
                        }}
                        className="flex items-center gap-3 w-full p-4 mb-6 bg-gold text-black font-bold rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-gold/20"
                    >
                        <Plus size={20} />
                        <span className="text-sm uppercase font-black">Novo Chat</span>
                    </button>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest px-2 mb-2">
                            Histórico Recente
                        </p>

                        {sessions && sessions.length > 0 ? (
                            sessions.map((session, index) => (
                                <div
                                    key={session.id || index}
                                    onClick={() => {
                                        onSelectSession(session);
                                        onClose();
                                    }}
                                    className="p-3 flex items-center gap-3 bg-white/5 hover:bg-white/10 active:bg-white/20 rounded-xl border border-white/5 cursor-pointer transition-all group"
                                >
                                    <MessageSquare size={16} className="text-gold/50 group-hover:text-gold transition-colors" />
                                    <span className="text-xs truncate text-foreground/80 group-hover:text-foreground flex-1">
                                        {session.query?.substring(0, 35) || "Conversa sobre Angola"}...
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-2 py-8 text-center border border-dashed border-white/5 rounded-xl">
                                <p className="text-[10px] italic text-foreground/30 font-medium">
                                    Sem memórias guardadas ainda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-border-custom/40 space-y-2">
                        <button className="flex items-center gap-3 w-full p-3 text-sm text-foreground/60 hover:text-white transition-colors group">
                            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
                            <span className="font-medium">Definições</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}