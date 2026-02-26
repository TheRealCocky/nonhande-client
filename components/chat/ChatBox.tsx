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
        /* Reduzi o gap para mobile e aumentei para desktop */
        <div className="flex flex-col gap-4 md:gap-8 p-1 md:p-4 max-w-4xl mx-auto w-full">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 md:gap-4 w-full ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* AVATAR - Mais compacto no mobile */}
                    <div className={`flex-none w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                        msg.sender === 'user'
                            ? 'bg-foreground text-background border-foreground shadow-sm'
                            : 'bg-gold/10 border-gold/30 text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                    }`}>
                        {msg.sender === 'user' ? <User size={12} className="md:size-[18px]" /> : <Sparkles size={12} className="md:size-[18px]" />}
                    </div>

                    {/* CONTEÚDO - Ajuste de largura crítica para UX */}
                    <div className={`flex flex-col gap-1.5 min-w-0 max-w-[88%] md:max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 md:p-5 rounded-2xl transition-all w-fit ${
                            msg.sender === 'user'
                                ? 'bg-card-custom border border-border-custom/50 text-foreground rounded-tr-none shadow-sm'
                                : 'bg-transparent text-foreground'
                        }`}>

                            <div className={`text-[14px] md:text-[15px] leading-relaxed prose prose-sm max-w-none overflow-x-auto
                                ${msg.sender === 'user' ? 'prose-p:text-foreground/90' : 'prose-p:text-foreground/90'}
                                prose-headings:text-gold prose-headings:font-bold prose-headings:my-2
                                prose-strong:text-gold prose-strong:font-black
                                prose-ul:list-disc prose-ul:ml-4
                                prose-table:block prose-table:overflow-x-auto prose-table:my-4
                                prose-th:bg-gold/10 prose-th:text-gold prose-th:p-2 prose-th:border prose-th:border-border-custom/40
                                prose-td:p-2 prose-td:border prose-td:border-border-custom/20
                            `}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>

                            {msg.fileUrl && (
                                <div className="mt-3 p-2 md:p-3 bg-background/40 border border-gold/20 rounded-xl flex items-center justify-between gap-3 group hover:border-gold/50 transition-all">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="text-gold shrink-0" size={16} />
                                        <span className="text-[10px] font-medium truncate max-w-[100px] md:max-w-[150px]">{msg.fileName}</span>
                                    </div>
                                    <a href={msg.fileUrl} className="p-1.5 bg-gold text-black rounded-lg hover:bg-gold-dark transition-colors">
                                        <Download size={12} />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* TOOLBAR - Mais discreta */}
                        <div className={`flex items-center gap-3 px-1 transition-opacity ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <button onClick={() => handleCopy(msg.text, msg.id)} className="text-foreground/20 hover:text-gold p-1">
                                {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                            </button>

                            {msg.sender === 'ai' && (
                                <button
                                    onClick={() => handleToggleSpeak(msg.text, msg.id)}
                                    className={`p-1 transition-all ${playingId === msg.id ? 'text-gold scale-110' : 'text-foreground/20 hover:text-gold'}`}
                                >
                                    {playingId === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                </button>
                            )}

                            <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-foreground/20">{msg.agent?.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            ))}

            {/* LOADING - Design Compacto */}
            {isLoading && (
                <div className="flex gap-2 flex-row animate-in fade-in duration-500 items-center px-1">
                    <div className="w-6 h-6 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center">
                        <Sparkles size={12} className="animate-glow-gold" />
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1 h-1 rounded-full bg-gold animate-bounce" />
                    </div>
                </div>
            )}

            <div ref={scrollAnchor} className="h-4 w-full" />
        </div>
    );
};
