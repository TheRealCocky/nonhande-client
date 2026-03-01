export interface RankingUser {
    id: string;
    name: string;
    avatarUrl?: string;
    xp: number;
    streak: number;
}

export interface UserPosition {
    position: number;
    currentXp: number;
    nextTarget: {
        name: string;
        xpDiff: number;
    } | null;
}