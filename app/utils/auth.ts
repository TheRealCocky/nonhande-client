// utils/auth.ts
import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = (): string | null => {
    try {
        const token = localStorage.getItem('nonhande_token');
        if (!token) return null;
        const decoded = jwtDecode<{ sub: string }>(token);
        return decoded.sub || null;
    } catch {
        return null;
    }
};