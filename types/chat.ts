export type AgentType = 'tourist' | 'document_expert' | 'general';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    agent?: AgentType;
    model?: string;
    sourceContext?: Record<string, unknown>;
    transcription?: string;

    // 📄 CAMPOS PARA DOCUMENTOS (PDFs do DocumentAgent)
    fileUrl?: string;
    fileName?: string;
    fileType?: string;

    // 🔊 CAMPO PARA ÁUDIO (Mesmo que venha null do back, o front pode usar)
    audioUrl?: string | null;

    createdAt: Date;
}

export interface ChatRequest {
    message: string;
    userId: string; // ✨ ADICIONADO: Essencial para a memória no Prisma
    selectedAgent?: AgentType;
}

export interface ChatResponse {
    text: string;
    agent: string;
    model: string;
    confidence?: number; // ✨ ADICIONADO: O back envia isto (ex: 0.98)
    sourceContext?: Record<string, unknown>;
    transcription?: string;
    fileUrl?: string;
    fileName?: string;
    audioUrl?: string | null; // ✨ ADICIONADO: Para consistência com o áudio nativo
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