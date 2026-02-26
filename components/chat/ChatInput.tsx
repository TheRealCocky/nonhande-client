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
        /* 1. CONTAINER: max-w-2xl para centralizar como o Grok, e padding lateral para respiro */
        <div className="flex flex-col w-full max-w-2xl mx-auto px-4 md:px-0 bg-transparent">

            {/* 2. SELETOR DE AGENTES - Mais minimalista, sem bordas pesadas */}
            <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar justify-start md:justify-center">
                {(['general', 'tourist', 'document_expert'] as AgentType[]).map((agent) => (
                    <button
                        key={agent}
                        onClick={() => setAgent(agent)}
                        className={`flex-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                            selectedAgent === agent
                                ? 'bg-gold text-black shadow-lg shadow-gold/20'
                                : 'bg-card-custom/40 text-foreground/30 hover:text-foreground/60'
                        }`}
                    >
                        {agent.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* 3. BARRA DE INPUT - Estilo Cápsula Flutuante */}
            <div className={`relative flex items-center gap-2 bg-card-custom/90 backdrop-blur-3xl rounded-3xl p-1.5 border transition-all duration-500 ${
                isRecording ? 'border-red-500/50 ring-4 ring-red-500/5' : 'border-border-custom/50 shadow-2xl focus-within:border-gold/30'
            }`}>

                {/* Live Mode - Ícone mais discreto */}
                <button
                    onClick={onToggleVoiceMode}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 text-foreground/40 hover:bg-gold hover:text-black transition-all shrink-0"
                    title="Live Mode"
                >
                    <AudioLines size={18} />
                </button>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? "A ouvir..." : "Perguntar à Nonhande..."}
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/20 text-[15px] md:text-base py-2 px-1 min-w-0"
                />

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={toggleRecording}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            isRecording
                                ? 'bg-red-500 text-white animate-pulse shadow-lg'
                                : 'text-foreground/20 hover:text-gold'
                        }`}
                    >
                        {isRecording ? <MicOff size={18} /> : <Mic size={20} />}
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={isLoading || (!text.trim() && !isRecording)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${
                            text.trim()
                                ? 'bg-gold text-black shadow-lg'
                                : 'bg-transparent text-foreground/5'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Gravação Activa - Não empurra o layout */}
                {isRecording && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500 px-4 py-1.5 rounded-full shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-white animate-bounce" />
                            <div className="w-1 h-3 bg-white animate-bounce [animation-delay:0.1s]" />
                            <div className="w-1 h-3 bg-white animate-bounce [animation-delay:0.2s]" />
                        </div>
                        <span className="text-[10px] text-white font-black uppercase tracking-tighter">Em Directo</span>
                    </div>
                )}
            </div>

            {/* Espaçador inferior para não colar no bezel do telemóvel */}
            <div className="h-2" />
        </div>
    );
};