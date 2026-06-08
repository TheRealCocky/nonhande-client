// utils/storage.ts

export const storage = {
    set(key: string, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch {
            // Safari fallback → cookie
        }
        document.cookie = `${key}=${value};path=/;max-age=2592000`; // 30 dias
    },

    get(key: string): string | null {
        try {
            const val = localStorage.getItem(key);
            if (val) return val;
        } catch {
            // Safari fallback → cookie
        }
        const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
        return match ? match[2] : null;
    },

    remove(key: string) {
        try { localStorage.removeItem(key); } catch { /* ignore */ }
        document.cookie = `${key}=;path=/;max-age=0`;
    }
};