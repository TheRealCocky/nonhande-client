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
        <div className="flex flex-col w-full max-w-4xl mx-auto bg-background/80 backdrop-blur-xl border-t border-border-custom/20">

            {/* 1. SELETOR DE AGENTES - Mais fino e discreto para não roubar espaço */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-b border-border-custom/10">
                {(['general', 'tourist', 'document_expert'] as AgentType[]).map((agent) => (
                    <button
                        key={agent}
                        onClick={() => setAgent(agent)}
                        className={`flex-none flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                            selectedAgent === agent
                                ? 'bg-gold text-black shadow-lg shadow-gold/20'
                                : 'bg-card-custom/40 text-foreground/40 border border-border-custom/20'
                        }`}
                    >
                        {agent.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* 2. BARRA DE INPUT - Sem paddings exagerados para colar no teclado */}
            <div className="p-2 md:p-4">
                <div className={`relative flex items-center gap-2 bg-card-custom/40 rounded-2xl p-1 border transition-all duration-500 ${
                    isRecording ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-custom/40 focus-within:border-gold/40'
                }`}>

                    {/* Botão Live Mode */}
                    <button
                        onClick={onToggleVoiceMode}
                        className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-gold hover:text-black transition-all shrink-0"
                    >
                        <AudioLines size={18} />
                    </button>

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isRecording ? "A ouvir..." : "Mensagem..."}
                        disabled={isLoading}
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/20 text-sm py-2 px-1 min-w-0"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={toggleRecording}
                            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                                isRecording
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'text-foreground/30 hover:text-gold'
                            }`}
                        >
                            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>

                        <button
                            onClick={handleSend}
                            disabled={isLoading || (!text.trim() && !isRecording)}
                            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                                text.trim()
                                    ? 'bg-gold text-black shadow-gold/20'
                                    : 'bg-transparent text-foreground/10'
                            }`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Gravação Activa - Compacto */}
            {isRecording && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full shadow-lg">
                    <div className="flex gap-0.5">
                        <div className="w-1 h-2 bg-white animate-bounce" />
                        <div className="w-1 h-2 bg-white animate-bounce [animation-delay:0.1s]" />
                        <div className="w-1 h-2 bg-white animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <span className="text-[8px] text-white font-bold uppercase tracking-tighter">Gravando</span>
                </div>
            )}
        </div>
    );
};