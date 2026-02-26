import { ChatMessage } from '@/types/chat';
import { FileText, Download, Volume2, Copy, Check, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBoxProps {
    messages: ChatMessage[];
    onSpeak: (text: string) => void;
    isLoading?: boolean; // ✨ Adicionado para controlar o estado de digitação
}

export const ChatBox = ({ messages, onSpeak, isLoading }: ChatBoxProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col gap-8 p-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* AVATAR */}
                    <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center border ${
                        msg.sender === 'user'
                            ? 'bg-orange-500 border-amber-500 text-white'
                            : 'bg-gold/10 border-gold/20 text-gold'
                    }`}>
                        {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>

                    {/* CONTEÚDO DA MENSAGEM */}
                    <div className={`flex flex-col gap-2 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                        <div className={`p-5 rounded-3xl transition-all ${
                            msg.sender === 'user'
                                ? 'bg-amber-600/10 border border-amber-600/20 text-foreground rounded-tr-none'
                                : 'bg-transparent text-foreground'
                        }`}>

                            <div className={`text-sm leading-relaxed prose prose-sm max-w-none 
                                ${msg.sender === 'user' ? 'prose-p:text-foreground/90' : 'prose-p:text-foreground/90'}
                                prose-headings:text-gold prose-headings:font-black
                                prose-strong:text-gold prose-strong:font-black
                                prose-ul:list-disc prose-ul:ml-4
                                prose-ol:list-decimal prose-ol:ml-4
                                prose-blockquote:border-l-gold prose-blockquote:bg-gold/5 prose-blockquote:py-1 prose-blockquote:px-4
                                
                                /* ✨ ESTILIZAÇÃO DE TABELAS (BORDAS VISÍVEIS ATRAVÉS DO GLOBALS.CSS) */
                                prose-table:border prose-table:border-border-custom/30 prose-table:rounded-xl prose-table:overflow-hidden
                                prose-th:border prose-th:border-border-custom/30 prose-th:bg-gold/10 prose-th:p-3 prose-th:text-gold
                                prose-td:border prose-td:border-border-custom/30 prose-td:p-3
                            `}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>

                            {/* DOCUMENTOS */}
                            {msg.fileUrl && (
                                <div className="mt-4 p-3 bg-card border border-gold/30 rounded-xl flex items-center justify-between gap-4 group hover:border-gold/60 transition-all">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-gold" size={20} />
                                        <span className="text-xs font-medium truncate max-w-[150px]">{msg.fileName || 'documento.pdf'}</span>
                                    </div>
                                    <a href={msg.fileUrl} className="p-2 bg-gold text-black rounded-lg hover:bg-yellow-500 transition-colors">
                                        <Download size={16} />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* BARRA DE FERRAMENTAS */}
                        <div className="flex items-center gap-3 px-2">
                            <button
                                onClick={() => handleCopy(msg.text, msg.id)}
                                className="p-1.5 text-foreground/40 hover:text-gold transition-colors rounded-md hover:bg-gold/5"
                                title="Copiar texto"
                            >
                                {copiedId === msg.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>

                            {msg.sender === 'ai' && (
                                <button
                                    onClick={() => onSpeak(msg.text)}
                                    className="p-1.5 text-foreground/40 hover:text-gold transition-colors rounded-md hover:bg-gold/5"
                                    title="Ouvir resposta"
                                >
                                    <Volume2 size={14} />
                                </button>
                            )}

                            <span className="text-[8px] uppercase font-black tracking-widest opacity-20 ml-2">
                                {msg.agent?.replace('_', ' ') || 'Nonhande'} • {msg.model || 'v3'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {/* ✨ ESTADO DE PROCESSAMENTO (IA DIGITANDO) */}
            {isLoading && (
                <div className="flex gap-4 flex-row animate-in fade-in slide-in-from-left-2 transition-all">
                    <div className="flex-none w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Sparkles size={16} className="animate-glow-gold" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="p-5">
                            <div className="flex gap-1.5 items-center h-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce [animation-duration:0.8s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
