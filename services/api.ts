import axios from 'axios';

// --- INTERFACES ORIGINAIS ---
export interface SignupData {
    email: string;
    name: string;
    password?: string;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface VerifyCodeData {
    email: string;
    code: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
}

// --- NOVAS INTERFACES ATUALIZADAS ---
export interface WordResponse {
    id: string;
    term: string;
    meaning: string;
    audioUrl?: string;
    language: string;
    imageUrl?: string;
    category?: string;
    grammaticalType?: string;
    culturalNote?: string;
    tags?: string[]; // Adicionado conforme planeado
    examples: Array<{ text: string; translation: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

/**
 * 🛡️ INTERCEPTOR DE SEGURANÇA
 */
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('nonhande_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ================= SERVIÇOS DE AUTENTICAÇÃO =================
export const authService = {
    signup: (data: SignupData) => api.post('/auth/signup', data),
    login: (data: LoginData) => api.post('/auth/login', data),
    verifyCode: (email: string, code: string) =>
        api.post('/auth/verify-code', { email, code }),
    googleLogin: () => {
        window.location.href = `${BASE_URL}/auth/google`;
    },
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),
    resetPassword: (data: ResetPasswordData) =>
        api.post('/auth/reset-password', data),
};

// ================= SERVIÇOS DO DICIONÁRIO (CRUD COMPLETO) =================
export const dictionaryService = {
    /**
     * Upload de nova palavra (Admin/Teacher)
     */
    addWord: (formData: FormData) =>
        api.post('/dictionary/add-word', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    /**
     * Atualizar palavra existente (Admin/Teacher)
     */
    updateWord: (id: string, formData: FormData) =>
        api.patch(`/dictionary/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    /**
     * Apagar palavra e ficheiros associados (Admin/Teacher)
     */
    deleteWord: (id: string) =>
        api.delete(`/dictionary/delete/${id}`),

    /**
     * Listagem oficial com paginação
     */
    getAll: (page: number = 1, limit: number = 10) =>
        api.get(`/dictionary/all?page=${page}&limit=${limit}`),

    /**
     * Pesquisa de termos
     */
    search: (term: string) =>
        api.get(`/dictionary/search/${term}`),
};

// ================= SERVIÇOS DE USUÁRIOS =================
export const userService = {
    getUsers: () => api.get('/users/all'),
    searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
};

export default api;