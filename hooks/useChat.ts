import { useState, useCallback, useRef } from 'react';
import { aiService } from '@/services/api';
import { ChatMessage, AgentType, ChatResponse, ChatRequest, ChatSession } from '@/types/chat';
import { useVoice } from './useVoice';

interface HistoryItem {
    id: string;
    query?: string;
    message?: string;
    answer?: string;
    response?: string;
    createdAt: string | Date;
    agent?: string;
}

export const useChat = (initialUserId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requiresUpgrade, setRequiresUpgrade] = useState(false);

    const shouldSpeakRef = useRef(false);
    const voice = useVoice();
    const speak = voice?.speak;

    const getEffectiveUserId = useCallback(() => {
        if (typeof window === 'undefined') return initialUserId ?? null;
        const storedId = localStorage.getItem("user_id");
        const effectiveId = initialUserId || storedId;
        if (!effectiveId || effectiveId === 'utilizador_logado') {
            console.error("❌ userId não encontrado! Utilizador não está logado?");
            return null;
        }
        return effectiveId;
    }, [initialUserId]);

    const generateId = () => {
        try { return crypto.randomUUID(); }
        catch { return Math.random().toString(36).substring(2, 15); }
    };

    const loadHistory = useCallback(async () => {
        const userId = getEffectiveUserId();
        if (!userId) return;

        try {
            const response = await aiService.getHistory(userId);
            const historyData = (response.data as unknown) as HistoryItem[];

            if (historyData && Array.isArray(historyData)) {
                const formattedMessages: ChatMessage[] = historyData.flatMap((chat) => [
                    {
                        id: `old-u-${chat.id || generateId()}`,
                        text: chat.query || chat.message || '',
                        sender: 'user' as const,
                        createdAt: new Date(chat.createdAt),
                        agent: (chat.agent as AgentType) || 'general'
                    },
                    {
                        id: `old-a-${chat.id || generateId()}`,
                        text: chat.answer || chat.response || '',
                        sender: 'ai' as const,
                        createdAt: new Date(chat.createdAt),
                        agent: (chat.agent as AgentType) || 'general'
                    }
                ]);

                const sessions: ChatSession[] = historyData.map((chat) => ({
                    id: chat.id,
                    query: chat.query || chat.message || '',
                    answer: chat.answer || chat.response || '',
                    createdAt: new Date(chat.createdAt),
                    agent: (chat.agent as AgentType) || 'general',
                }));

                setChatSessions(sessions);
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
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

        const { text, agent, model, transcription, requiresUpgrade: needsPay } = response.data;

        if (needsPay) setRequiresUpgrade(true);

        if (transcription) {
            setMessages(prev => prev.map(m =>
                m.id === userMsgId ? { ...m, text: transcription } : m
            ));
        }

        addMessage({
            text: text || "A Nonhande está a descansar um pouco, tenta de novo.",
            sender: 'ai',
            agent: (agent as AgentType) || 'general',
            model: model || 'llama-3.3-70b',
        });

        if (shouldSpeakRef.current && text && speak) {
            speak(text);
            shouldSpeakRef.current = false;
        }
    }, [addMessage, speak]);

    const sendMessage = async (text: string, selectedAgent: AgentType) => {
        const finalUserId = getEffectiveUserId();

        if (!finalUserId) {
            addMessage({ text: 'Sessão expirada. Por favor faz login novamente.', sender: 'ai' });
            return;
        }

        if (!text.trim()) return;

        setIsLoading(true);
        shouldSpeakRef.current = false;

        const userMsg = addMessage({ text, sender: 'user', agent: selectedAgent });

        try {
            const response = await aiService.sendMessage({
                message: text,
                selectedAgent,
                userId: finalUserId
            } as ChatRequest);

            handleResponse(response, userMsg.id);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error("Detalhes do Erro:", errorMessage);

            if (errorMessage === "Network Error") {
                addMessage({
                    text: 'O servidor da Nonhande parece estar offline ou bloqueou o acesso (CORS).',
                    sender: 'ai'
                });
            } else {
                addMessage({ text: 'Erro na conexão com a Nonhande.', sender: 'ai' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const sendVoice = async (audioBlob: Blob, selectedAgent: AgentType) => {
        const userId = getEffectiveUserId();

        if (!userId) {
            addMessage({ text: 'Sessão expirada. Por favor faz login novamente.', sender: 'ai' });
            return;
        }

        setIsLoading(true);
        shouldSpeakRef.current = true;

        const userMsg = addMessage({ text: '🎤 A ouvir o mestre...', sender: 'user', agent: selectedAgent });
        try {
            const response = await aiService.sendVoice(audioBlob, userId);
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
        requiresUpgrade,
        setRequiresUpgrade,
        speak: (text: string) => speak && speak(text)
    };
};