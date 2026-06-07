import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/api';
import { ClassGlobalStats, StudentReport } from '@/types/analytics';

/**
 * Hook nativo para obter as estatísticas globais da turma
 */
export const useClassAnalytics = (groupId?: string) => {
    const [data, setData] = useState<ClassGlobalStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Função para buscar dados (pode ser chamada manualmente para refresh)
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await analyticsService.getClassSummary(groupId);
            setData(response.data);
            setError(null);
        } catch (err) {
            const formattedError = err instanceof Error ? err : new Error(String(err));
            setError(formattedError);
            console.error("Erro ao carregar analytics:", formattedError);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    // ✅ CRÍTICO: Se o groupId mudar, o efeito dispara novamente e atualiza o ecrã
    }, [groupId]); 

    // Retornamos a função fetchData para o componente poder fazer "refresh" manualmente
    return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook nativo para detalhes de um estudante
 */
export const useStudentAnalytics = (userId: string | null) => {
    const [data, setData] = useState<StudentReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            setData(null);
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await analyticsService.getStudentDetail(userId);
                setData(response.data);
            } catch (err) {
                console.error("Erro ao carregar estudante:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return { data, isLoading };
};