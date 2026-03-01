export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    xp: number;
    hearts: number;
    maxHearts: number;
    streak: number;
    level: number;
    createdAt: string;
}

export interface UpdateProfileData {
    name?: string;
    bio?: string;
    avatarUrl?: string;
}