import axios from 'axios';

// 1. Criamos a instância para o Microserviço de Live
const liveApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LIVE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// 🛡️ INTERCEPTOR DE SEGURANÇA (Igual ao teu api principal)
liveApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        // IMPORTANTE: Usar a mesma chave 'nonhande_token' que o teu authService usa
        const token = localStorage.getItem('nonhande_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const liveService = {
    // 1. Busca os usuários reais do MongoDB
    getAvailableUsers: async () => {
        const response = await liveApi.get('/live/users');
        return response.data;
    },

    // 2. Cria a sala passando os IDs reais
    createRoom: async (callerId: string, calleeId: string, title: string) => {
        const response = await liveApi.post('/live/room', {
            callerId,
            calleeId,
            title
        });
        return response.data;
    },

    // 3. Verifica status da sala
    getRoomStatus: async (roomId: string) => {
        const response = await liveApi.get(`/live/room/${roomId}`);
        return response.data;
    },

    // 4. Encerrar sessão
    endRoom: async (roomId: string) => {
        const response = await liveApi.post(`/live/room/${roomId}/end`);
        return response.data;
    }
};