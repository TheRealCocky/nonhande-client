import axios from 'axios';
import {ChatRequest, ChatResponse} from "@/types/chat";
import {LoginData, ResetPasswordData, SignupData} from "@/types/auth";
import {WordResponse} from "@/types/dicionary";
import {Activity, CompleteLessonData, Lesson, Level, UserStatus} from "@/types/gamification";
import {Unit} from "sharp";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
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
        api.get<WordResponse>(`/dictionary/search/${encodeURIComponent(term)}`),
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

    completeLesson: (data: CompleteLessonData) =>
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
        api.post<Level>('/gamification/level', data),

    updateLevel: (id: string, data: Partial<{ title: string; order: number }>) =>
        api.patch<Level>(`/gamification/level/${id}`, data),

    deleteLevel: (id: string) =>
        api.delete(`/gamification/level/${id}`),

    createUnit: (data: { title: string; order: number; levelId: string }) =>
        api.post<Unit>('/gamification/unit', data),

    createLesson: (data: { title: string; order: number; unitId: string; xpReward: number }) =>
        api.post<Lesson>('/gamification/lesson', data),

    updateLesson: (id: string, data: Partial<{ title: string; order: number; xpReward: number }>) =>
        api.patch<Lesson>(`/gamification/lesson/${id}`, data),

    deleteLesson: (id: string) =>
        api.delete(`/gamification/lesson/${id}`),

    createActivity: (formData: FormData) =>
        api.post<Activity>('/gamification/activity', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    updateActivity: (id: string, formData: FormData) =>
        api.patch<Activity>(`/gamification/activity/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deleteActivity: (id: string) =>
        api.delete(`/gamification/activity/${id}`),
};

// ================= SERVIÇOS DE IA (CHAT & VOZ) =================
export const aiService = {
    // Enviar mensagem de texto (POST /ai/chat)
    sendMessage: (data: ChatRequest) =>
        api.post<ChatResponse>('/ai/chat', data),

    // Enviar áudio para transcrição e resposta (POST /ai/media/transcribe)
    sendVoice: (audioBlob: Blob) => {
        const formData = new FormData();
        // O nome 'file' deve ser igual ao que definiste no @FileInterceptor('file') no NestJS
        formData.append('file', audioBlob, 'recording.wav');

        return api.post<ChatResponse>('/ai/media/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
};

export default api;