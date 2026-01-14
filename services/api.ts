import axios from 'axios';

// --- INTERFACES DE AUTENTICAÇÃO ---
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

// --- INTERFACES DO DICIONÁRIO ---
export interface WordResponse {
    id: string;
    term: string;
    infinitive?: string;
    meaning: string;
    audioUrl?: string;
    language: string;
    imageUrl?: string;
    category?: string;
    grammaticalType?: string;
    culturalNote?: string;
    tags?: string[];
    searchTags?: string[];
    examples: Array<{ text: string; translation: string }>;
}

// --- INTERFACES DE GAMIFICAÇÃO ---
export enum ChallengeType {
    SELECT = 'SELECT',
    TRANSLATE = 'TRANSLATE',
    ORDER = 'ORDER',
    PAIRS = 'PAIRS',
    VOICE = 'VOICE'
}

export interface CompleteLessonData {
    userId: string;
    lessonId: string;
    score: number; // 0 a 100
}

export interface CreateChallengeData {
    type: ChallengeType;
    question: string;
    content: any;
    lessonId: string;
    order?: number;
}

// --- NOVAS INTERFACES DE RESPOSTA ---
export interface UserStatus {
    hearts: number;
    maxHearts: number;
    xp: number;
    streak: number;
    nextHeartInSeconds: number;
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

// ================= SERVIÇOS DO DICIONÁRIO =================
export const dictionaryService = {
    addWord: (formData: FormData) =>
        api.post('/dictionary/add-word', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    updateWord: (id: string, formData: FormData) =>
        api.patch(`/dictionary/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deleteWord: (id: string) =>
        api.delete(`/dictionary/delete/${id}`),

    getAll: (page: number = 1, limit: number = 10, search?: string) => {
        const query = search ? `&search=${encodeURIComponent(search)}` : '';
        return api.get(`/dictionary/all?page=${page}&limit=${limit}${query}`);
    },

    getByTerm: (term: string) =>
        api.get(`/dictionary/search/${encodeURIComponent(term)}`),
};

// ================= SERVIÇOS DE USUÁRIOS =================
export const userService = {
    getUsers: () => api.get('/users/all'),
    searchUsers: (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
};

// ================= SERVIÇOS DE PROGRESSÃO (VIDAS E XP) =================
export const progressionService = {
    getStatus: (userId: string) =>
        api.get<UserStatus>(`/progression/status/${userId}`),

    processCompletion: (data: CompleteLessonData) =>
        api.post('/progression/complete', data),

    loseHeart: (userId: string) =>
        api.post(`/progression/mistake/${userId}`),
};

// ================= SERVIÇOS DE GAMIFICAÇÃO (CONTEÚDO) =================
export const gamificationService = {
    getTrail: (language: string = 'nhaneca') =>
        api.get(`/gamification/trail?language=${language}`),

    getLesson: (id: string) =>
        api.get(`/gamification/lesson/${id}`),

    /**
     * ✅ CORREÇÃO: Aceita CreateChallengeData (JSON) em vez de FormData
     */
    createChallenge: (data: CreateChallengeData) =>
        api.post('/gamification/challenge', data),

    createLevel: (data: { title: string; order: number; language: string }) =>
        api.post('/gamification/level', data),
};

export default api;