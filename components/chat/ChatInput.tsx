'use client';

import React, { useState } from 'react';
import { Mic, Send, MicOff, UserCircle } from 'lucide-react';
import { useAgentStore } from '@/store/useAgentStore';
import { useVoice } from '@/hooks/useVoice';
import { AgentType } from '@/types/chat';

interface ChatInputProps {
    onSendText: (text: string, agent: AgentType) => void;
    onSendVoice: (blob: Blob, agent: AgentType) => void;
    isLoading: boolean;
}

export const ChatInput = ({ onSendText, onSendVoice, isLoading }: ChatInputProps) => {
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
        <div className="flex flex-col gap-2 p-4 bg-white border-t">
            {/* 1. SELETOR DE AGENTES (Tabs por cima do input) */}
            <div className="flex gap-2 mb-2">
                {(['general', 'tourist', 'document_expert'] as AgentType[]).map((agent) => (
                    <button
                        key={agent}
                        onClick={() => setAgent(agent)}
                        className={`px-3 py-1 rounded-full text-xs transition ${
                            selectedAgent === agent
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {agent.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* 2. BARRA DE INPUT UNIFICADA */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-amber-500 transition shadow-sm">

                {/* Botão de Áudio */}
                <button
                    onClick={toggleRecording}
                    className={`p-2 rounded-full transition ${
                        isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-200'
                    }`}
                >
                    {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                {/* Campo de Texto */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? "Ouvindo o Mestre..." : `Falar com ${selectedAgent}...`}
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                />

                {/* Botão de Enviar */}
                <button
                    onClick={handleSend}
                    disabled={isLoading || (!text.trim() && !isRecording)}
                    className="p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:bg-gray-300 transition"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};