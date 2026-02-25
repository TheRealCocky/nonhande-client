export type AgentType = 'tourist' | 'document_expert' | 'general';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    agent?: AgentType;
    model?: string;

    // ✨ Consistente com o Record para o RAG
    sourceContext?: Record<string, unknown>;

    transcription?: string;

    // 📄 CAMPOS PARA DOCUMENTOS
    fileUrl?: string;
    fileName?: string;
    fileType?: string;

    createdAt: Date;
}

export interface ChatRequest {
    message: string;
    selectedAgent?: AgentType;
}

export interface ChatResponse {
    text: string;
    agent: string;
    model: string;

    // ✨ REMOVIDO O 'ANY': Usando o mesmo padrão do ChatMessage
    sourceContext?: Record<string, unknown>;

    transcription?: string;

    // 📄 CAMPOS DE FICHEIRO
    fileUrl?: string;
    fileName?: string;
}