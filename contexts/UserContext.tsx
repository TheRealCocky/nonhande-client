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
            // ✅ Forçamos a busca sem cache
            const { data } = await progressionService.getStatus();
            console.log("DADOS VINDOS DO BACKEND:", data); // Para tu veres no F12
            setStatus(data);
        } catch (e) {
            console.error("Erro ao sincronizar status global", e);
        }
    }, []);

    // Carrega ao iniciar o app
    useEffect(() => {
        const token = localStorage.getItem('nonhande_token');
        if (token) refreshStatus();
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