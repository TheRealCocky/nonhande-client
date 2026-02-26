import { useState, useCallback, useEffect, useRef } from 'react'; // Adicionei useRef e useEffect
import { aiService } from '@/services/api';
import { ChatMessage, AgentType, ChatResponse, ChatRequest } from '@/types/chat';
import { useVoice, UseVoiceReturn } from './useVoice';

export const useChat = (userId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 💡 Referência para saber se devemos falar a próxima mensagem automaticamente
    const shouldSpeakRef = useRef(false);

    const { speak } = useVoice() as UseVoiceReturn;

    const generateId = () => {
        try { return crypto.randomUUID(); }
        catch (e) { return Math.random().toString(36).substring(2, 15); }
    };

    const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'createdAt'>) => {
        const newMsg: ChatMessage = {
            ...msg,
            id: generateId(),
            createdAt: new Date(),
        };
        setMessages((prev) => [...prev, newMsg]);
        return newMsg;
    }, []);

    const handleResponse = useCallback((response: { data: ChatResponse }, userMsgId: string) => {
        if (!response?.data) return;

        const { text, agent, model, transcription } = response.data;

        if (transcription) {
            setMessages(prev => prev.map(m =>
                m.id === userMsgId ? { ...m, text: transcription } : m
            ));
        }

        const aiMsg = addMessage({
            text: text || "Sem resposta do servidor.",
            sender: 'ai',
            agent: (agent as AgentType) || 'personal',
            model: model || 'gemini',
        });

        // ✨ AUTO-SPEAK: Se a mensagem veio de voz, ativamos a fala automática
        if (shouldSpeakRef.current && text) {
            speak(text);
            shouldSpeakRef.current = false; // Reset após falar
        }
    }, [addMessage, speak]);

    const sendMessage = async (text: string, selectedAgent: AgentType) => {
        if (!text.trim() || !userId) return;

        setIsLoading(true);
        shouldSpeakRef.current = false; // No texto, normalmente não queremos auto-speak (opcional)
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
            addMessage({ text: 'Erro na conexão.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    const sendVoice = async (audioBlob: Blob, selectedAgent: AgentType) => {
        if (!userId) return;
        setIsLoading(true);

        // ✨ Se o usuário enviou voz, ele espera ouvir voz de volta
        shouldSpeakRef.current = true;

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

    return {
        messages,
        sendMessage,
        sendVoice,
        isLoading,
        speak: (text: string) => speak(text)
    };
};