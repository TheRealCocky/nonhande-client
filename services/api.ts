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
export interface WordExample {
    text: string;
    translation: string;
}

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
    examples: WordExample[];
}

// --- INTERFACES DE GAMIFICAÇÃO ---
export enum ActivityType {
    SELECT = 'SELECT',
    LISTEN_SELECT = 'LISTEN_SELECT',
    TRANSLATE = 'TRANSLATE',
    FILL_BLANK = 'FILL_BLANK',
    IMAGE_CHECK = 'IMAGE_CHECK',
    THEORY = 'THEORY',
    PAIRS = 'PAIRS',      // <--- Adicionado
    VOICE = 'VOICE',      // <--- Adicionado
    LISTEN_ORDER = 'LISTEN_ORDER'
}

export interface ActivityContent {
    correct?: string;
    options?: string[];
    audioUrl?: string;
    audioOptions?: string[]; // <--- Para os distractors de áudio
    imageUrl?: string;
    imageCorrect?: string;
    imageWrong?: string;
    // Adiciona esta linha para suportar os pares
    pairs?: { left: string; right: string }[];
    // Adiciona index signature para evitar erros de tipos dinâmicos
    [key: string]: any;
}

export interface Activity {
    id: string;
    lessonId: string;
    type: ActivityType;
    question: string;
    order: number;
    content: ActivityContent;
    createdAt?: string;
    updatedAt?: string;
}

export interface Lesson {
    id: string;
    title: string;
    order: number;
    xpReward: number;
    isUnlocked?: boolean;
    unitId?: string; // Importante para o redirecionamento
    access: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
    activities?: Activity[];
    userHistory?: Array<{
        completed: boolean;
        lastActivityOrder: number;
        score: number;
    }>;
}

export interface Unit {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
    isUnlocked?: boolean;
    isCompleted?: boolean;
    // Adiciona isto para o progresso circular
    stats?: {
        total: number;
        completed: number;
        percent: number;
    };
}

// ✅ INTERFACE UNIFICADA (A duplicata foi removida daqui)
export interface CompleteLessonData {
    lessonId: string;
    score: number;
    hearts: number;
}

export interface Level {
    id: string;
    title: string;
    order: number;
    units: Unit[];
}

// --- NOVAS INTERFACES DE RESPOSTA ---
export interface UserStatus {
    hearts: number;
    maxHearts: number;
    xp: number;
    streak: number;
    nextHeartInSeconds: number;
    role?: string;
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

// ================= SERVIÇOS DE PROGRESSÃO =================
export const progressionService = {
    getStatus: () =>
        api.get<UserStatus>(`/progression/status`),

    completeLesson: (data: { lessonId: string; score: number;hearts:number }) =>
        api.post('/progression/complete', data),

    savePoint: (lessonId: string, activityOrder: number) =>
        api.post(`/progression/save-point/${lessonId}/${activityOrder}`),

    loseHeart: () =>
        api.post(`/progression/mistake`),
};

// ================= SERVIÇOS DE GAMIFICAÇÃO =================
export const gamificationService = {
    getTrail: (language: string = 'nhaneca') =>
        api.get<Level[]>(`/gamification/trail?lang=${language}`),

    getLesson: (id: string) =>
        api.get<Lesson>(`/gamification/lesson/${id}`),


    createLevel: (data: { title: string; order: number; language: string }) =>
        api.post('/gamification/level', data),

    updateLevel: (id: string, data: Partial<{ title: string; order: number }>) =>
        api.patch(`/gamification/level/${id}`, data),

    deleteLevel: (id: string) =>
        api.delete(`/gamification/level/${id}`),

    createUnit: (data: { title: string; order: number; levelId: string }) =>
        api.post('/gamification/unit', data),

    createLesson: (data: { title: string; order: number; unitId: string; xpReward: number }) =>
        api.post('/gamification/lesson', data),

    updateLesson: (id: string, data: Partial<{ title: string; order: number; xpReward: number }>) =>
        api.patch(`/gamification/lesson/${id}`, data),

    deleteLesson: (id: string) =>
        api.delete(`/gamification/lesson/${id}`),

    createActivity: (formData: FormData) =>
        api.post('/gamification/activity', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    updateActivity: (id: string, formData: FormData) =>
        api.patch(`/gamification/activity/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deleteActivity: (id: string) =>
        api.delete(`/gamification/activity/${id}`),
};

export default api;