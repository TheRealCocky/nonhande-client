'use client';

import { ChatMessage } from '@/types/chat';
import { FileText, Download, Volume2, VolumeX, Copy, Check, User, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBoxProps {
    messages: ChatMessage[];
    onSpeak: (text: string) => void;
    isLoading?: boolean;
}

export const ChatBox = ({ messages, onSpeak, isLoading }: ChatBoxProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const scrollAnchor = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // ✨ Referência para limpar o intervalo

    // Auto-scroll eficiente
    useEffect(() => {
        if (scrollAnchor.current) {
            scrollAnchor.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // ✨ Limpeza de segurança ao destruir o componente
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            window.speechSynthesis.cancel();
        };
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleToggleSpeak = (text: string, id: string) => {
        // Se já houver um monitoramento ativo, limpamos
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (playingId === id) {
            window.speechSynthesis.cancel();
            setPlayingId(null);
        } else {
            window.speechSynthesis.cancel();
            setPlayingId(id);
            onSpeak(text);

            // Monitoramento seguro do fim da fala
            intervalRef.current = setInterval(() => {
                if (!window.speechSynthesis.speaking) {
                    setPlayingId(null);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 500);
        }
    };

    return (
        <div className="flex flex-col gap-6 md:gap-10 p-2 md:p-4 max-w-4xl mx-auto mb-20">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* AVATAR */}
                    <div className={`flex-none w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border transition-all ${
                        msg.sender === 'user'
                            ? 'bg-foreground text-background border-foreground shadow-sm'
                            : 'bg-gold/10 border-gold/30 text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                    }`}>
                        {msg.sender === 'user' ? <User size={14} className="md:size-[18px]" /> : <Sparkles size={14} className="md:size-[18px]" />}
                    </div>

                    {/* CONTEÚDO */}
                    <div className={`flex flex-col gap-2 w-full max-w-[92%] md:max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 md:p-5 rounded-2xl transition-all w-full ${
                            msg.sender === 'user'
                                ? 'bg-card-custom border border-border-custom text-foreground rounded-tr-none shadow-sm'
                                : 'bg-transparent text-foreground'
                        }`}>

                            <div className={`text-sm md:text-[15px] leading-relaxed prose prose-sm max-w-none overflow-x-auto
                                ${msg.sender === 'user' ? 'prose-p:text-foreground/80' : 'prose-p:text-foreground/90'}
                                prose-headings:text-gold prose-headings:font-bold
                                prose-strong:text-gold prose-strong:font-black
                                prose-ul:list-disc prose-ul:ml-4
                                prose-table:block md:prose-table:table prose-table:my-4
                                prose-th:bg-gold/10 prose-th:text-gold prose-th:p-2 md:prose-th:p-3 prose-th:border prose-th:border-border-custom/40
                                prose-td:p-2 md:prose-td:p-3 prose-td:border prose-td:border-border-custom/20
                            `}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>

                            {/* DOWNLOAD DE ARQUIVOS */}
                            {msg.fileUrl && (
                                <div className="mt-4 p-3 bg-background/40 border border-gold/20 rounded-xl flex items-center justify-between gap-4 group hover:border-gold/50 transition-all">
                                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                                        <FileText className="text-gold" size={18} />
                                        <span className="text-[10px] md:text-xs font-medium truncate max-w-[120px] md:max-w-[150px]">{msg.fileName}</span>
                                    </div>
                                    <a href={msg.fileUrl} className="p-2 bg-gold text-black rounded-lg hover:bg-gold-dark transition-colors shadow-sm">
                                        <Download size={14} />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* TOOLBAR */}
                        <div className="flex items-center gap-4 px-1 opacity-40 hover:opacity-100 transition-opacity">
                            <button onClick={() => handleCopy(msg.text, msg.id)} className="hover:text-gold p-1">
                                {copiedId === msg.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>

                            {msg.sender === 'ai' && (
                                <button
                                    onClick={() => handleToggleSpeak(msg.text, msg.id)}
                                    className={`p-1 transition-all ${playingId === msg.id ? 'text-gold scale-110' : 'hover:text-gold'}`}
                                >
                                    {playingId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            )}

                            <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em]">{msg.agent?.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            ))}

            {/* LOADING STATE */}
            {isLoading && (
                <div className="flex gap-3 md:gap-4 flex-row animate-in fade-in duration-500">
                    <div className="flex-none w-7 h-7 md:w-9 md:h-9 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center">
                        <Sparkles size={14} className="animate-glow-gold" />
                    </div>
                    <div className="p-3 md:p-5 flex items-center">
                        <div className="flex gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-gold/60 animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1 h-1 rounded-full bg-gold/40 animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1 h-1 rounded-full bg-gold/20 animate-bounce" />
                        </div>
                    </div>
                </div>
            )}

            <div ref={scrollAnchor} className="h-2 w-full" />
        </div>
    );
};
