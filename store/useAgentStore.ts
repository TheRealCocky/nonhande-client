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
        const labels: Record<AgentType, string> = {
            general: 'Assistente Geral',
            tourist: 'Guia Turístico',
            culture: 'Guardião Cultural',
        };
        return labels[get().selectedAgent];
    },
}));