import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authService = {
    signup: (data: any) => api.post('/auth/signup', data),

    login: (data: any) => api.post('/auth/login', data),

    // Aqui batemos na rota @Post('verify-code') que criámos acima
    verifyCode: (email: string, code: string) =>
        api.post('/auth/verify-code', { email, code }),

    googleLogin: () => {
        window.location.href = `${BASE_URL}/auth/google`;
    }
};

export default api;