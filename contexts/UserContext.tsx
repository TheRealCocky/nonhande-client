'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { progressionService, UserStatus } from '@/services/api';

interface UserContextType {
    status: UserStatus | null;
    refreshStatus: () => Promise<void>;
    reduceHeart: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<UserStatus | null>(null);

    const refreshStatus = useCallback(async () => {
        try {
            const { data } = await progressionService.getStatus();
            setStatus(data);
        } catch (e) {
            console.error("Erro ao sincronizar status global", e);
        }
    }, []);

    // ✅ CORREÇÃO: Usamos uma função interna para evitar o erro de "cascading renders"
    useEffect(() => {
        let isMounted = true;

        const initStatus = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('nonhande_token') : null;
            if (token && isMounted) {
                await refreshStatus();
            }
        };

        initStatus();

        return () => {
            isMounted = false;
        };
    }, [refreshStatus]);

    const reduceHeart = () => {
        setStatus(prev => prev ? { ...prev, hearts: Math.max(0, prev.hearts - 1) } : null);
    };

    return (
        <UserContext.Provider value={{ status, refreshStatus, reduceHeart }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser deve ser usado dentro de UserProvider");
    return context;
};