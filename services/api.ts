import axios from 'axios';

// --- INTERFACES ---
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

// Novos tipos para recuperação de senha
export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string; // A nova senha
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authService = {
    signup: (data: SignupData) => api.post('/auth/signup', data),

    login: (data: LoginData) => api.post('/auth/login', data),

    verifyCode: (email: string, code: string) =>
        api.post('/auth/verify-code', { email, code }),

    googleLogin: () => {
        window.location.href = `${BASE_URL}/auth/google`;
    },

    // ================= NOVOS ENDPOINTS =================

    /**
     * Solicita o envio do e-mail de recuperação
     */
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),

    /**
     * Envia o token e a nova senha para atualizar no banco
     */
    resetPassword: (data: ResetPasswordData) =>
        api.post('/auth/reset-password', data),
};

export default api;