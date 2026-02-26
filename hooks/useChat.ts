import { useState, useCallback } from 'react';
import { aiService } from '@/services/api';
import { ChatMessage, AgentType, ChatResponse, ChatRequest } from '@/types/chat';
import { useVoice, UseVoiceReturn } from './useVoice';

export const useChat = (userId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { speak } = useVoice() as UseVoiceReturn;

    // ✨ MELHORIA: Função de ID robusta para evitar tela branca
    const generateId = () => {
        try {
            return crypto.randomUUID();
        } catch (e) {
            // Fallback caso o navegador bloqueie o crypto (comum em http)
            return Math.random().toString(36).substring(2, 15);
        }
    };

    const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'createdAt'>) => {
        const newMsg: ChatMessage = {
            ...msg,
            id: generateId(), // Usa a nossa função segura
            createdAt: new Date(),
        };
        setMessages((prev) => [...prev, newMsg]);
        return newMsg;
    }, []);

    const handleResponse = useCallback((response: { data: ChatResponse }, userMsgId: string) => {
        // ✨ SEGURANÇA: Verifica se a resposta existe para não quebrar o hook
        if (!response?.data) return;

        const { text, agent, model, transcription } = response.data;

        if (transcription) {
            setMessages(prev => prev.map(m =>
                m.id === userMsgId ? { ...m, text: transcription } : m
            ));
        }

        addMessage({
            text: text || "Sem resposta do servidor.",
            sender: 'ai',
            agent: (agent as AgentType) || 'personal',
            model: model || 'gemini',
        });
    }, [addMessage]);

    const sendMessage = async (text: string, selectedAgent: AgentType) => {
        // Se o userId ainda não chegou do localStorage, não avançamos
        if (!text.trim() || !userId) {
            console.warn("Tentativa de envio sem userId ou texto vazio");
            return;
        }

        setIsLoading(true);
        const userMsg = addMessage({ text, sender: 'user', agent: selectedAgent });

        try {
            const response = await aiService.sendMessage({
                message: text,
                selectedAgent,
                userId
            } as ChatRequest);
            handleResponse(response, userMsg.id);
        } catch (error) {
            console.error("Erro no sendMessage:", error);
            addMessage({ text: 'Erro na conexão com a Nonhande.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    const sendVoice = async (audioBlob: Blob, selectedAgent: AgentType) => {
        if (!userId) return;
        setIsLoading(true);
        const userMsg = addMessage({ text: '🎤 Processando áudio...', sender: 'user', agent: selectedAgent });
        try {
            const response = await aiService.sendVoice(audioBlob, userId);
            handleResponse(response, userMsg.id);
        } catch (error) {
            console.error("Erro no sendVoice:", error);
            addMessage({ text: 'Erro ao processar áudio.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeak = useCallback((text: string) => {
        if (typeof speak === 'function') {
            speak(text);
        }
    }, [speak]);

    return {
        messages,
        sendMessage,
        sendVoice,
        isLoading,
        speak: (text: string) => speak(text)
    };
};