export type AgentType = 'tourist' | 'document_expert' | 'general' | 'system';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    agent?: AgentType;
    model?: string;
    // O contexto pode vir como objeto ou string do backend
    sourceContext?: string | Record<string, unknown>;
    transcription?: string;

    // 📄 CAMPOS PARA DOCUMENTOS (PDFs do DocumentAgent)
    fileUrl?: string;
    fileName?: string;
    fileType?: string;

    // 🔊 CAMPO PARA ÁUDIO
    audioUrl?: string | null;

    createdAt: Date;
}

export interface ChatRequest {
    message: string;
    userId: string;
    selectedAgent?: AgentType;
}

export interface ChatResponse {
    text: string;
    agent: string;
    model: string;
    confidence?: number;
    sourceContext?: string | Record<string, unknown>;
    transcription?: string;
    fileUrl?: string;
    fileName?: string;
    audioUrl?: string | null;

    // ✨ ADICIONADO: Essencial para o Hook bloquear o chat e pedir 5.000 Kz
    requiresUpgrade?: boolean;
}

export interface ChatSession {
    id: string;
    query: string;
    answer: string;
    agent?: string;
    createdAt: string | Date;
}

export interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNewChat: () => void;
    sessions: ChatSession[];
    onSelectSession: (session: ChatSession) => void;
}