import { useState, useCallback, useRef } from 'react';
import { aiService } from '@/services/api';
import { ChatMessage, AgentType, ChatResponse, ChatRequest } from '@/types/chat';
import { useVoice, UseVoiceReturn } from './useVoice';

export const useChat = (userId?: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatSessions, setChatSessions] = useState<any[]>([]); // ✨ Para o Sidebar
    const [isLoading, setIsLoading] = useState(false);

    const shouldSpeakRef = useRef(false);
    const { speak } = useVoice() as UseVoiceReturn;

    const generateId = () => {
        try { return crypto.randomUUID(); }
        catch (e) { return Math.random().toString(36).substring(2, 15); }
    };

    /**
     * ✨ CARREGAR HISTÓRICO: Busca as mensagens no banco de dados via API
     */
    const loadHistory = useCallback(async () => {
        if (!userId || userId === 'utilizador_logado') return;

        try {
            // Chamada à API que consulta o ChatHistory do Prisma no NestJS
            const response = await aiService.getHistory(userId);

            if (response?.data) {
                // Mapeamos o formato do banco de dados para o formato do ChatBox
                const formattedMessages: ChatMessage[] = response.data.flatMap((chat: any) => [
                    {
                        id: `old-u-${chat.id}`,
                        text: chat.query,
                        sender: 'user' as const,
                        createdAt: new Date(chat.createdAt),
                        agent: chat.agent || 'general'
                    },
                    {
                        id: `old-a-${chat.id}`,
                        text: chat.answer,
                        sender: 'ai' as const,
                        createdAt: new Date(chat.createdAt),
                        agent: chat.agent || 'general'
                    }
                ]);

                setMessages(formattedMessages);
                setChatSessions(response.data); // Guarda para listar no Sidebar
            }
        } catch (error) {
            console.error("Erro ao carregar histórico da Nonhande:", error);
        }
    }, [userId]);

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
            agent: (agent as AgentType) || 'general',
            model: model || 'gemini',
        });

        if (shouldSpeakRef.current && text) {
            speak(text);
            shouldSpeakRef.current = false;
        }
    }, [addMessage, speak]);

    const sendMessage = async (text: string, selectedAgent: AgentType) => {
        if (!text.trim() || !userId) return;

        setIsLoading(true);
        shouldSpeakRef.current = false;
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
        setMessages,
        chatSessions, // ✨ Exposto para o Sidebar
        loadHistory,  // ✨ Exposto para ser chamado no useEffect da Page
        sendMessage,
        sendVoice,
        isLoading,
        speak: (text: string) => speak(text)
    };
};