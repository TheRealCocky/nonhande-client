import { useState, useCallback } from 'react';
import { aiService } from '@/services/api';
import { ChatMessage, AgentType, ChatResponse } from '@/types/chat';

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'createdAt'>) => {
        const newMsg: ChatMessage = {
            ...msg,
            id: crypto.randomUUID(),
            createdAt: new Date(),
        };
        setMessages((prev) => [...prev, newMsg]);
        return newMsg;
    }, []);

    const handleResponse = (response: { data: ChatResponse }, userMsgId: string) => {
        // ✨ Extraímos fileUrl e fileName da resposta
        const { text, agent, model, transcription, sourceContext, fileUrl, fileName } = response.data;

        if (transcription) {
            setMessages(prev => prev.map(m =>
                m.id === userMsgId ? { ...m, text: transcription } : m
            ));
        }

        addMessage({
            text,
            sender: 'ai',
            agent: agent as AgentType,
            model,
            // ✨ Tipagem segura sem 'any'
            sourceContext: sourceContext ? (sourceContext as Record<string, unknown>) : undefined,
            // 📄 Passamos os novos campos para a mensagem
            fileUrl,
            fileName
        });
    };

    const sendMessage = async (text: string, selectedAgent: AgentType) => {
        if (!text.trim()) return;

        setIsLoading(true);
        const userMsg = addMessage({ text, sender: 'user', agent: selectedAgent });

        try {
            const response = await aiService.sendMessage({ message: text, selectedAgent });
            handleResponse(response, userMsg.id);
        } catch (error) {
            console.error('Erro no Chat:', error);
            addMessage({ text: 'Ocorreu um erro ao conectar com o Guardião.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    const sendVoice = async (audioBlob: Blob, selectedAgent: AgentType) => {
        setIsLoading(true);
        const userMsg = addMessage({ text: '🎤 Processando áudio...', sender: 'user', agent: selectedAgent });

        try {
            const response = await aiService.sendVoice(audioBlob);
            handleResponse(response, userMsg.id);
        } catch (error) {
            console.error('Erro no Áudio:', error);
            addMessage({ text: 'Não consegui entender o áudio, mestre.', sender: 'ai' });
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, setMessages, sendMessage, sendVoice, isLoading };
};