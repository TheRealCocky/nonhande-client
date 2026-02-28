export interface Room {
    id: string; // O _id do MongoDB
    roomId: string; // O UUID (ex: 123e4567...)
    callerId: string;
    calleeId: string;
    status: 'PENDING' | 'ONGOING' | 'COMPLETED';
    startedAt: string;
    endedAt?: string | null;
}

export interface CreateRoomResponse {
    roomId: string;
    status: string;
    callerId: string;
}

// Tipos para a Sinalização WebRTC (Unificado para facilitar)
export interface SignalData {
    toRoom: string;
    from?: string;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
}

// Tipos para os eventos do Socket (Lado do Cliente ouvindo o Servidor)
export interface ServerToClientEvents {
    'user-joined': (data: { userId: string }) => void;
    'offer': (data: { from: string; offer: RTCSessionDescriptionInit }) => void;
    'answer': (data: { from: string; answer: RTCSessionDescriptionInit }) => void;
    // Ajustado: O servidor envia o objeto completo do candidato
    'ice-candidate': (data: { from: string; candidate: RTCIceCandidateInit }) => void;
    'user-disconnected': (data: { userId: string }) => void;
    'error': (data: { message: string }) => void; // Importante para debug no TCC
}

// Tipos para os eventos do Socket (Cliente enviando para o Servidor)
export interface ClientToServerEvents {
    'join-room': (data: { roomId: string }) => void;
    'offer': (data: SignalData) => void;
    'answer': (data: SignalData) => void;
    'ice-candidate': (data: SignalData) => void;
}