'use client';

import React, { useState } from 'react';
import { Mic, Send, MicOff, Sparkles, AudioLines } from 'lucide-react';
import { useAgentStore } from '@/store/useAgentStore';
import { useVoice } from '@/hooks/useVoice';
import { AgentType } from '@/types/chat';

interface ChatInputProps {
    onSendText: (text: string, agent: AgentType) => void;
    onSendVoice: (blob: Blob, agent: AgentType) => void;
    isLoading: boolean;
    onToggleVoiceMode?: () => void;
}

export const ChatInput = ({ onSendText, onSendVoice, isLoading, onToggleVoiceMode }: ChatInputProps) => {
    const [text, setText] = useState('');
    const { selectedAgent, setAgent } = useAgentStore();
    const { isRecording, startRecording, stopRecording } = useVoice();

    const handleSend = () => {
        if (text.trim() && !isLoading) {
            onSendText(text, selectedAgent);
            setText('');
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            const audioBlob = await stopRecording();
            onSendVoice(audioBlob, selectedAgent);
        } else {
            await startRecording();
        }
    };

    return (
        /* CONTAINER: Removi paddings desnecessários que criam espaços brancos no mobile */
        <div className="flex flex-col w-full max-w-2xl mx-auto bg-transparent">

            {/* 1. SELETOR DE AGENTES - Ajustado para não sumir quando o teclado sobe */}
            <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar justify-start md:justify-center px-2">
                {(['general', 'tourist', 'document_expert'] as AgentType[]).map((agent) => (
                    <button
                        key={agent}
                        onClick={() => setAgent(agent)}
                        className={`flex-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                            selectedAgent === agent
                                ? 'bg-gold border-gold text-black shadow-lg shadow-gold/20'
                                : 'bg-card-custom/40 border-border-custom/20 text-foreground/40'
                        }`}
                    >
                        {agent.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* 2. BARRA DE INPUT - Design de Cápsula Focada */}
            <div className={`relative flex items-center gap-2 bg-card-custom/95 backdrop-blur-3xl rounded-2xl p-1.5 border transition-all duration-300 ${
                isRecording ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-border-custom/60 shadow-xl'
            }`}>

                <button
                    onClick={onToggleVoiceMode}
                    className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-foreground/5 text-foreground/40 hover:text-gold transition-all shrink-0"
                >
                    <AudioLines size={18} />
                </button>

                {/* ✨ FIX CRÍTICO: text-[16px] impede o Safari de dar zoom e estragar o layout */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? "A ouvir..." : "Perguntar..."}
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/20 text-[16px] py-2 px-1 min-w-0"
                />

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={toggleRecording}
                        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                            isRecording
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-foreground/20 hover:text-gold'
                        }`}
                    >
                        {isRecording ? <MicOff size={18} /> : <Mic size={20} />}
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={isLoading || (!text.trim() && !isRecording)}
                        className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                            text.trim()
                                ? 'bg-gold text-black shadow-md'
                                : 'bg-transparent text-foreground/5'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Badge de Gravação - Floating para não quebrar o flex */}
                {isRecording && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full shadow-lg border border-white/10 animate-in slide-in-from-bottom-2">
                        <div className="flex gap-0.5">
                            <div className="w-1 h-2 bg-white animate-bounce" />
                            <div className="w-1 h-2 bg-white animate-bounce [animation-delay:0.1s]" />
                            <div className="w-1 h-2 bg-white animate-bounce [animation-delay:0.2s]" />
                        </div>
                        <span className="text-[8px] text-white font-black uppercase">LIVE</span>
                    </div>
                )}
            </div>

            {/* Espaçador dinâmico para iOS Home Bar */}
            <div className="h-safe-bottom md:h-2" />
        </div>
    );
};