import { ChatMessage } from '@/types/chat';
import { FileText, Download } from 'lucide-react'; // Garante que tens o lucide-react instalado

export const ChatBox = ({ messages }: { messages: ChatMessage[] }) => {
    return (
        <div className="flex flex-col gap-6 p-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[85%] p-4 rounded-2xl shadow-sm transition-all ${
                        msg.sender === 'user'
                            ? 'bg-amber-600 text-white rounded-tr-none'
                            : 'bg-card border border-border-custom/50 text-foreground rounded-tl-none'
                    }`}>
                        {/* Texto da Mensagem */}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* 📄 CARD DO PDF (Aparece apenas se houver fileUrl) */}
                        {msg.fileUrl && (
                            <div className="mt-4 p-3 bg-background/50 border border-gold/30 rounded-xl flex items-center justify-between gap-4 group hover:border-gold/60 transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-gold/10 rounded-lg text-gold group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden text-left">
                                        <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Documento Gerado</span>
                                        <span className="text-xs opacity-80 truncate max-w-[140px] font-medium">
                                            {msg.fileName || 'legado_nonhande.pdf'}
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href={msg.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gold text-black p-2 rounded-lg hover:bg-yellow-500 transition-colors"
                                    title="Descarregar Sabedoria"
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        )}

                        {/* Rodapé da Mensagem (Agente e Modelo) */}
                        <div className="flex items-center gap-2 mt-2 opacity-40">
                            {msg.agent && (
                                <span className="text-[9px] uppercase font-bold tracking-tighter italic">
                                    {msg.agent.replace('_', ' ')}
                                </span>
                            )}
                            {msg.model && (
                                <span className="text-[9px] font-mono">
                                    • {msg.model}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};