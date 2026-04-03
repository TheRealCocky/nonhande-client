import { create } from 'zustand';
import { AgentType } from '@/types/chat';

// Definimos a estrutura do estado do nosso Agente
interface AgentState {
    selectedAgent: AgentType;
    // Ação para mudar o agente
    setAgent: (agent: AgentType) => void;
    // Atalhos para labels bonitas no Frontend
    getAgentLabel: () => string;
}

export const useAgentStore = create<AgentState>((set, get) => ({
    // Estado inicial: Assistente Geral
    selectedAgent: 'general',

    // Função para atualizar o agente
    setAgent: (agent: AgentType) => set({ selectedAgent: agent }),

    // Função utilitária para mostrar nomes amigáveis na UI
    getAgentLabel: () => {
        // ✅ CORREÇÃO: Adicionado o campo 'system' que faltava no Record
        const labels: Record<AgentType, string> = {
            general: 'Assistente Geral',
            tourist: 'Guia Turístico',
            document_expert: 'Guardião de Documentos',
            system: 'Sistema de Apoio' // Ou o nome que preferires para o agente system
        };

        return labels[get().selectedAgent];
    },
}));