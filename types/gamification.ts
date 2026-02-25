export enum ActivityType {
    SELECT = 'SELECT',
    LISTEN_SELECT = 'LISTEN_SELECT',
    TRANSLATE = 'TRANSLATE',
    FILL_BLANK = 'FILL_BLANK',
    IMAGE_CHECK = 'IMAGE_CHECK',
    THEORY = 'THEORY',
    PAIRS = 'PAIRS',
    VOICE = 'VOICE',
    LISTEN_ORDER = 'LISTEN_ORDER'
}

export interface ActivityContent {
    correct?: string;
    options?: string[];
    audioUrl?: string;
    audioOptions?: string[];
    imageUrl?: string;
    imageCorrect?: string;
    imageWrong?: string;
    pairs?: { left: string; right: string }[];
    // ✨ CORREÇÃO CRÍTICA: Substituído 'any' por 'unknown' para passar no linter
    [key: string]: unknown;
}

export interface Activity {
    id: string;
    lessonId: string;
    type: ActivityType;
    question: string;
    order: number;
    content: ActivityContent;
    metadata?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}

export interface Lesson {
    id: string;
    title: string;
    order: number;
    xpReward: number;
    isUnlocked?: boolean;
    unitId?: string;
    access: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
    activities?: Activity[];
    userHistory?: Array<{
        completed: boolean;
        lastActivityOrder: number;
        score: number;
    }>;
}

export interface Unit {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
    isUnlocked?: boolean;
    isCompleted?: boolean;
    stats?: {
        total: number;
        completed: number;
        percent: number;
    };
}

export interface CompleteLessonData {
    lessonId: string;
    score: number;
    hearts: number;
}

export interface Level {
    id: string;
    title: string;
    order: number;
    units: Unit[];
}

// --- NOVAS INTERFACES DE RESPOSTA ---
export interface UserStatus {
    hearts: number;
    maxHearts: number;
    xp: number;
    streak: number;
    nextHeartInSeconds: number;
    role?: string;
    accessLevel: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
}