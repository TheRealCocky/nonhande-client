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
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (scrollAnchor.current) {
            scrollAnchor.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

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
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (playingId === id) {
            window.speechSynthesis.cancel();
            setPlayingId(null);
        } else {
            window.speechSynthesis.cancel();
            setPlayingId(id);
            onSpeak(text);
            intervalRef.current = setInterval(() => {
                if (!window.speechSynthesis.speaking) {
                    setPlayingId(null);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 500);
        }
    };

    return (
        /* Ajuste: Gap reduzido e padding lateral maior para centralizar o fluxo */
        <div className="flex flex-col gap-6 md:gap-10 px-2 md:px-6 py-4 max-w-3xl mx-auto w-full mb-10">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 md:gap-4 w-full ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* AVATAR - Minimalista para não distrair do texto */}
                    <div className={`flex-none w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border transition-all shrink-0 shadow-sm ${
                        msg.sender === 'user'
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-gold/5 border-gold/20 text-gold'
                    }`}>
                        {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </div>

                    {/* CONTEÚDO - Aqui está a correção de UX (Max-width controlado) */}
                    <div className={`flex flex-col gap-1.5 min-w-0 max-w-[85%] md:max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 md:p-5 rounded-2xl transition-all ${
                            msg.sender === 'user'
                                ? 'bg-card-custom border border-border-custom/60 text-foreground rounded-tr-none'
                                : 'bg-transparent text-foreground/95'
                        }`}>

                            <div className={`text-base leading-relaxed prose prose-base max-w-none overflow-x-auto
                                ${msg.sender === 'user' ? 'prose-p:text-foreground/90' : 'prose-p:text-foreground/90'}
                                prose-headings:text-gold prose-headings:font-bold
                                prose-strong:text-gold prose-strong:font-black
                                prose-ul:list-disc prose-ul:ml-4
                                prose-table:block prose-table:overflow-x-auto
                                prose-th:bg-gold/5 prose-th:text-gold prose-th:border-border-custom/40
                                prose-td:border-border-custom/20
                            `}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>

                            {msg.fileUrl && (
                                <div className="mt-4 p-3 bg-background/50 border border-gold/20 rounded-xl flex items-center justify-between gap-4 group hover:border-gold/50 transition-all">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="text-gold shrink-0" size={18} />
                                        <span className="text-[11px] font-medium truncate">{msg.fileName}</span>
                                    </div>
                                    <a href={msg.fileUrl} className="p-2 bg-gold text-black rounded-lg hover:scale-105 transition-transform">
                                        <Download size={14} />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* TOOLBAR - Padrão Grok (Sutil e alinhada) */}
                        <div className={`flex items-center gap-4 px-1 transition-opacity opacity-30 hover:opacity-100 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <button onClick={() => handleCopy(msg.text, msg.id)} className="hover:text-gold p-1 transition-colors">
                                {copiedId === msg.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                            </button>

                            {msg.sender === 'ai' && (
                                <button
                                    onClick={() => handleToggleSpeak(msg.text, msg.id)}
                                    className={`p-1 transition-all ${playingId === msg.id ? 'text-gold scale-110' : 'hover:text-gold'}`}
                                >
                                    {playingId === msg.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                </button>
                            )}

                            <span className="text-[9px] uppercase font-black tracking-widest text-foreground/40">
                                {msg.agent?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {/* LOADING - Compacto e Elegante */}
            {isLoading && (
                <div className="flex gap-3 flex-row animate-in fade-in duration-700 items-center px-2">
                    <div className="w-7 h-7 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center">
                        <Sparkles size={14} className="animate-pulse text-gold/50" />
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold/20 animate-bounce" />
                    </div>
                </div>
            )}

            <div ref={scrollAnchor} className="h-4 w-full" />
        </div>
    );
};
