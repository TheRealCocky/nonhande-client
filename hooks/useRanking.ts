import { useState, useEffect } from 'react';
import { rankingService } from '@/services/api';
import { RankingUser, UserPosition } from '@/types/ranking';

export function useRanking() {
    const [leaders, setLeaders] = useState<RankingUser[]>([]);
    const [myPos, setMyPos] = useState<UserPosition | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadRankingData = async () => {
            try {
                const [resGlobal, resPos] = await Promise.all([
                    rankingService.getGlobal(10),
                    rankingService.getMyPosition()
                ]);
                setLeaders(resGlobal.data);
                setMyPos(resPos.data);
            } catch (error) {
                console.error("Erro ao buscar a elite de Angola:", error);
            } finally {
                setLoading(false);
            }
        };
        loadRankingData();
    }, []);

    return { leaders, myPos, loading };
}