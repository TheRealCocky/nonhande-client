// utils/storage.ts
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export const storage = {
    set(key: string, value: string) {
        if (!isBrowser) return;
        try {
            localStorage.setItem(key, value);
        } catch {
            // localStorage bloqueado (Safari privado, etc.)
        }
        try {
            document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=2592000;SameSite=Lax`;
        } catch {
            // cookie bloqueado
        }
    },

    get(key: string): string | null {
        if (!isBrowser) return null;
        // 1. Tenta localStorage
        try {
            const val = localStorage.getItem(key);
            if (val) return val;
        } catch {
            // localStorage bloqueado
        }
        // 2. Fallback: cookie
        try {
            const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
            if (match) return decodeURIComponent(match[2]);
        } catch {
            // cookie bloqueado
        }
        return null;
    },

    remove(key: string) {
        if (!isBrowser) return;
        try {
            localStorage.removeItem(key);
        } catch {
            // ignore
        }
        try {
            document.cookie = `${key}=;path=/;max-age=0`;
        } catch {
            // ignore
        }
    }
};