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
    onToggleVoiceMode?: () => void; // Gatilho para o VoiceModeOverlay
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
        <div className="flex flex-col gap-3 p-4 bg-transparent w-full max-w-4xl mx-auto">

            {/* 1. SELETOR DE AGENTES (Estilo Minimalista) */}
            <div className="flex gap-2 px-1 overflow-x-auto scrollbar-hide">
                {(['general', 'tourist', 'document_expert'] as AgentType[]).map((agent) => (
                    <button
                        key={agent}
                        onClick={() => setAgent(agent)}
                        className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                            selectedAgent === agent
                                ? 'bg-gold/10 border-gold text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                                : 'bg-card-custom/40 border-border-custom/40 text-foreground/40 hover:border-gold/20'
                        }`}
                    >
                        {selectedAgent === agent && <Sparkles size={10} className="animate-glow-gold" />}
                        {agent.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* 2. BARRA DE INPUT UNIFICADA (A "Consola") */}
            <div className={`relative flex items-center gap-2 bg-card-custom/60 backdrop-blur-xl rounded-3xl p-1.5 border transition-all duration-500 ${
                isRecording ? 'border-red-500/40 ring-4 ring-red-500/5' : 'border-border-custom focus-within:border-gold/40'
            }`}>

                {/* BOTÃO MODO VOZ (TRIGGER PARA O OVERLAY) */}
                <button
                    onClick={onToggleVoiceMode}
                    className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-foreground/5 text-foreground/60 hover:bg-gold hover:text-black transition-all group shrink-0"
                    title="Entrar em Live Mode"
                >
                    <AudioLines size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                {/* Campo de Texto */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? "A ouvir o Mestre..." : "Perguntar à Nonhande..."}
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/20 text-sm md:text-base px-1 min-w-0"
                />

                {/* Grupo de Ações à Direita */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={toggleRecording}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            isRecording
                                ? 'bg-red-500 text-white animate-pulse shadow-lg'
                                : 'text-foreground/30 hover:text-gold hover:bg-gold/5'
                        }`}
                    >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={isLoading || (!text.trim() && !isRecording)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                            text.trim()
                                ? 'bg-gold text-black shadow-lg shadow-gold/20 scale-100'
                                : 'bg-transparent text-foreground/10 opacity-50 scale-90'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Indicador sutil de gravação quando fora do Overlay */}
            {isRecording && (
                <div className="flex justify-center items-center gap-2 py-1">
                    <div className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-0.5 h-3 bg-red-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                    <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em]">Gravação Activa</span>
                </div>
            )}
        </div>
    );
};