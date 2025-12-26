import axios from 'axios';

// Definimos as formas dos dados para o TypeScript ficar feliz
export interface SignupData {
    email: string;
    name: string;
    password?: string; // Interrogação se for opcional (ex: Google users)
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface VerifyCodeData {
    email: string;
    code: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authService = {
    // Substituímos 'any' pelas interfaces que criámos
    signup: (data: SignupData) => api.post('/auth/signup', data),

    login: (data: LoginData) => api.post('/auth/login', data),

    verifyCode: (email: string, code: string) =>
        api.post<VerifyCodeData>('/auth/verify-code', { email, code }),

    googleLogin: () => {
        // Redirecionamento para o backend (Render ou Localhost)
        window.location.href = `${BASE_URL}/auth/google`;
    }
};

export default api;