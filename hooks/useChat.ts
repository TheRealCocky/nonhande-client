import { useState, useCallback, useRef } from 'react';
import { aiService } from '@/services/api';
import { ChatMessage, AgentType, ChatResponse, ChatRequest, ChatSession } from '@/types/chat';
import { useVoice, UseVoiceReturn } from './useVoice';

export const useChat = (initialUserId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const shouldSpeakRef = useRef(false);
    const { speak } = useVoice() as UseVoiceReturn;

    // 🎯 Captura o ID real do localStorage de forma segura
    const getEffectiveUserId = useCallback(() => {
        if (typeof window === 'undefined') return initialUserId || 'utilizador_logado';

        const storedId = localStorage.getItem("user_id");

        // Se temos um ID real (visto no MongoDB), usamos. Caso contrário, fallback.
        if (storedId && storedId !== 'utilizador_logado') return storedId;
        return initialUserId || 'utilizador_logado';
    }, [initialUserId]);

    const generateId = () => {
        try { return crypto.randomUUID(); }
        catch { return Math.random().toString(36).substring(2, 15); }
    };

    const loadHistory = useCallback(async () => {
        const userId = getEffectiveUserId();
        // Não carregamos histórico se for o ID genérico
        if (!userId || userId === 'utilizador_logado') return;

        try {
            const response = await aiService.getHistory(userId);
            const historyData = (response?.data as unknown) as ChatSession[];

            if (historyData && Array.isArray(historyData)) {
                const formattedMessages: ChatMessage[] = historyData.flatMap((chat) => [
                    {
                        id: `old-u-${chat.id}`,
                        text: chat.query,
                        sender: 'user' as const,
                        createdAt: new Date(chat.createdAt),
                        agent: (chat.agent as AgentType) || 'general'
                    },
                    {
                        id: `old-a-${chat.id}`,
                        text: chat.answer,
                        sender: 'ai' as const,
                        createdAt: new Date(chat.createdAt),
                        agent: (chat.agent as AgentType) || 'general'
                    }
                ]);

                setMessages(formattedMessages);
                setChatSessions(historyData);
            }
        } catch (error) {
            console.error("Erro ao carregar histórico da Nonhande:", error);
        }
    }, [getEffectiveUserId]);

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

        addMessage({
            text: text || "A Nonhande está a descansar um pouco, tenta de novo.",
            sender: 'ai',
            agent: (agent as AgentType) || 'general',
            model: model || 'gemini',
        });

        if (shouldSpeakRef.current && text) {
            speak(text);
            shouldSpeakRef.current = false;
        }
    }, [addMessage, speak]);

    const sendMessage = async (text: string, selectedAgent: AgentType) => {
        const userId = getEffectiveUserId();

        // 🛡️ AQUI ESTAVA O ERRO: Se userId fosse undefined, o return parava o chat.
        // Agora garantimos que o texto existe. O ID, se não houver, vai como genérico.
        if (!text.trim()) return;

        setIsLoading(true);
        shouldSpeakRef.current = false;

        // Adicionamos a mensagem no ecrã IMEDIATAMENTE
        const userMsg = addMessage({ text, sender: 'user', agent: selectedAgent });

        try {
            const response = await aiService.sendMessage({
                message: text,
                selectedAgent,
                userId: userId || 'utilizador_logado' // Fallback para não quebrar a API
            } as ChatRequest);
            handleResponse(response, userMsg.id);
        } catch (error) {
            console.error("Erro no sendMessage:", error);
            addMessage({ text: 'Mestre, tive uma falha na ligação. Tenta de novo.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    const sendVoice = async (audioBlob: Blob, selectedAgent: AgentType) => {
        const userId = getEffectiveUserId();
        setIsLoading(true);
        shouldSpeakRef.current = true;

        const userMsg = addMessage({ text: '🎤 A ouvir o mestre...', sender: 'user', agent: selectedAgent });
        try {
            const response = await aiService.sendVoice(audioBlob, userId || 'utilizador_logado');
            handleResponse(response, userMsg.id);
        } catch (error) {
            console.error("Erro no sendVoice:", error);
            addMessage({ text: 'Não consegui processar o teu áudio.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        setMessages,
        chatSessions,
        loadHistory,
        sendMessage,
        sendVoice,
        isLoading,
        speak: (text: string) => speak(text)
    };
};